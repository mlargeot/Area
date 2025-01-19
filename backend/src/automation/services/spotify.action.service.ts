import axios from 'axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Cron,
  CronExpression
} from '@nestjs/schedule';
import {
  User, 
  UserDocument
} from 'src/schemas/user.schema';
import {
  Model,
  Types
 } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReactionsService } from 'src/automation/services/default.reaction.service';

@Injectable()
export class SpotifyAcitonsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reactionsService : ReactionsService
  ) {}

  /**
   * Init Spotify `new_playlist_song` by performing a request to the playlist once 
   * to get the necessary metadata if the request succeeds.
   * 
   * @param userId Id of the user that initializes the action.
   * @param params Parameters of the action.
   * @returns Necessary metadata if successful.
   * 
   * @throws BadRequestException if the playlist URL is invalid.
   * @throws NotFoundException if the playlist is not found or inaccessible.
   */
  async initActivityPlaylistCheck(userId: string, params: { playlistUrl: string }) {
    const playlistId = this.extractPlaylistId(params.playlistUrl);
    if (!playlistId) {
      throw new BadRequestException('Invalid playlist URL.');
    }

    const playlistData = await this.getSpotifyPlaylist(userId, playlistId);
    if (!playlistData) {
      throw new NotFoundException('Playlist not found or inaccessible.');
    }

    const lastSong = playlistData.tracks.items[playlistData.tracks.total - 1]?.track.name;

    return {
      playlistId,
      songsNumber: playlistData.tracks.total,
      lastSong,
    };
  }

  /**
   * Extracts the playlist ID from a Spotify playlist URL.
   * 
   * @param playlistUrl The URL of the playlist.
   * @returns The playlist ID if valid, or null otherwise.
   */
  private extractPlaylistId(playlistUrl: string): string | null {
    const match = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  /**
  * Fetches detailed information about a Spotify playlist using the user's Spotify access token.
  * 
  * @param userId - The ID of the user requesting the playlist information.
  * @param playlistId - The ID of the Spotify playlist to fetch.
  * @returns A Promise resolving to the playlist data if successful.
  * 
  * @throws {UnauthorizedException} If the user is not found in the database.
  * @throws {UnauthorizedException} If the user does not have a Spotify access token.
  * @throws {UnauthorizedException} If the request to the Spotify API fails.
  * 
  * ### Example Response from Spotify API:
  * ```json
  * {
  *   "name": "My Playlist",
  *   "tracks": {
  *     "total": 25
  *   },
  *   "id": "playlistId123"
  * }
  * ```
  * 
  * ### Usage Example:
  * ```typescript
  * const playlistData = await this.getSpotifyPlaylist('userId123', 'playlistId123');
  * console.log(playlistData.name); // Outputs the playlist name
  * ```
  */
  private async getSpotifyPlaylist(userId: string, playlistId: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });
  
    if (!user)
      throw new UnauthorizedException(`User with ID ${userId} not found.`);

    const spotifyProvider = user.oauthProviders?.find((provider) => provider.provider === 'spotify');
    if (!spotifyProvider || !spotifyProvider.accessToken)
      throw new UnauthorizedException(`Spotify access token not found for user with ID ${userId}.`);

    const token = spotifyProvider.accessToken;

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(`Failed to fetch Spotify playlist with ID ${playlistId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Cron job to check for new songs in playlists for all users.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkPlaylistActivity() {
    try {
      const users = await this.userModel.find({
        'applets.active': true,
        'applets.action.name': 'playlist_activity',
      }).select('applets');

      for (const user of users) {
        const activeApplets = user.applets.filter(applet => applet.active && applet.action.name === 'playlist_activity');

        for (const applet of activeApplets) {
          const { appletId, userId, reaction } = applet;
          const { playlistId, songsNumber, lastSong } = applet.metadata.response;

          const currentResponse = await this.getSpotifyPlaylist(userId, playlistId);
          if (songsNumber !== currentResponse.tracks.total) {
            await this.setNewPlaylistMetadata(
              {
                newId: playlistId,
                newSongsNumber: currentResponse.tracks.total,
                newLastSong: currentResponse.tracks.items[currentResponse.tracks.total - 1]?.track.name
              },
              userId,
              appletId
            );
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);
          } else if (lastSong !== currentResponse.tracks.items[currentResponse.tracks.total - 1]?.track.name) {
            await this.setNewPlaylistMetadata(
              {
                newId: playlistId,
                newSongsNumber: currentResponse.tracks.total,
                newLastSong: currentResponse.tracks.items[currentResponse.tracks.total - 1]?.track.name
              },
              userId,
              appletId
            );
            await this.reactionsService.executeReaction(userId, reaction.name, reaction.params);
          } else
            continue;
        }
      }
    } catch (error) {
      console.error('action: playlist_activity', error.message);

      console.error('Failed to process active applets:', error.message);
    }
  }

  /**
  * Updates the metadata.response field of a user's applet with new playlist metadata.
  * 
  * This method locates the user and their specific applet by their IDs, then updates
  * the metadata.response field of the applet with the provided new playlist metadata.
  * 
  * ### Example Metadata Object:
  * ```json
  * {
  *   "newId": "2Frip4bF8igNgrnuRjqKGm",
  *   "newSongsNumber": 20,
  *   "newLastSong": "New Song Name"
  * }
  * ```
  * 
  * @param metadata - The new playlist metadata to set.
  *  - `newId` (string): The new playlist ID.
  *  - `newSongsNumber` (number): The updated number of songs in the playlist.
  *  - `newLastSong` (string): The name of the latest song added to the playlist.
  * 
  * @param userId - The ID of the user whose applet is to be updated.
  * @param appletId - The ID of the applet to update.
  * 
  * @returns A Promise that resolves when the update is successful.
  * 
  * @throws {NotFoundException} If the user or applet is not found in the database.
  * @throws {Error} If an unexpected error occurs during the update process.
  * 
  * ### Usage Example:
  * ```typescript
  * await this.setNewPlaylistMetadata(
  *   {
  *     newId: '2Frip4bF8igNgrnuRjqKGm',
  *     newSongsNumber: 20,
  *     newLastSong: 'New Song Name',
  *   },
  *   '677d033071c847a4b50f9134', // userId
  *   'aca92f82-cf2b-4bce-9670-38c9634d83b1' // appletId
  * );
  * ```
  * 
  * ### Expected Database Update:
  * ```json
  * "metadata": {
  *   "response": {
  *     "playlistId": "2Frip4bF8igNgrnuRjqKGm",
  *     "songsNumber": 20,
  *     "lastSong": "New Song Name"
  *   }
  * }
  * ```
  */
  private async setNewPlaylistMetadata(
    metadata: {
      newId: string;
      newSongsNumber: number;
      newLastSong: string;
    },
    userId: string,
    appletId: string
  ): Promise<void> {
    try {
      const result = await this.userModel.updateOne(
        {
          _id: new Types.ObjectId(userId),
          'applets.appletId': appletId,
        },
        {
          $set: {
            'applets.$.metadata.response': {
              playlistId: metadata.newId,
              songsNumber: metadata.newSongsNumber,
              lastSong: metadata.newLastSong,
            },
          },
        }
      );
  
      if (result.matchedCount === 0) {
        throw new NotFoundException(
          `Applet with ID ${appletId} not found for user ${userId}.`
        );
      }
  
      console.log(
        `Successfully updated metadata for applet ${appletId} of user ${userId}.`
      );
    } catch (error) {
      console.error(
        `Failed to update metadata for applet ${appletId} of user ${userId}:`,
        error.message
      );
      throw new Error('Failed to update applet metadata.');
    }
  }
}
