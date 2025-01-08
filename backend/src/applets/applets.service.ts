import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AppletDto,
  AppletBodyDto,
  AppletModuleDto
} from 'src/applets/dto/applets.dto';
import { User } from 'src/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid'
import { ActionsService } from 'src/automation/services/default.action.service';

@Injectable()
export class AppletsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly actionsService : ActionsService
  ) {}

  /**
  * Retrieves the list of applets for a specified user.
  * 
  * This service returns all applets associated with a given user. 
  * If the user does not exist, an exception is thrown.
  * If the user has no applets, an empty list is returned.
  * 
  * @param userId - The ID of the user whose applets need to be retrieved.
  * 
  * @returns A promise resolved with an array of `AppletDto` objects, or an empty list if no applets are found.
  * 
  * @throws NotFoundException - If no user is found with the provided ID.
  * 
  * ### Usage Example:
  * ```typescript
  * const applets = await getApplets('12345abc');
  * console.log(applets); // Logs the applets associated with the user.
  * ```
  */
  async getApplets(
    userId: string
  ): Promise<AppletDto[]> {
    const user = await this.userModel.findById(userId).select('applets').lean();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.applets.length > 0)
      return user.applets;
    else
      return [];
  }

  /**
  * Retrieves a specific applet for a user by its ID.
  * 
  * This service searches for a user by their ID and retrieves a specific applet 
  * based on the provided applet ID. If the user or applet is not found, 
  * an exception is thrown.
  * 
  * @param userId - The ID of the user to search for.
  * @param appletId - The ID of the applet to retrieve.
  * 
  * @returns A promise resolved with the `AppletDto` object for the specified applet.
  * 
  * @throws NotFoundException - If the user or the applet is not found.
  * 
  * ### Usage Example:
  * ```typescript
  * const applet = await getAppletById('12345abc', '67890def');
  * console.log(applet); // Logs the applet data for the specified user and applet ID.
  * ```
  */
  async getAppletById(
    userId: string,
    appletId: string
  ): Promise<AppletDto> {
    const user = await this.userModel.findOne(
      { _id: userId, 'applets.appletId': appletId },
      { 'applets.$': 1 }
    ).lean();
  
    if (!user || !user.applets || user.applets.length === 0) {
      throw new NotFoundException(`Applet with ID ${appletId} not found for user ${userId}.`);
    }

    return user.applets[0];
  }

  /**
  * Creates a new applet for a specified user.
  * 
  * This service creates a new applet by initializing an action, associating it 
  * with the user, and storing it in the database. It generates a unique ID for 
  * the applet and sets its metadata based on the response of the action's execution.
  * 
  * @param userId - The ID of the user for whom the applet is being created.
  * @param appletDto - The data transfer object containing the applet details 
  * including action and reaction configurations.
  * 
  * @returns A promise resolved with the newly created `AppletDto` object.
  * 
  * @throws NotFoundException - If the user is not found in the database.
  * @throws Error - If the initialization of the action fails.
  * 
  * ### Usage Example:
  * ```typescript
  * const newApplet = await createApplet('12345abc', {
  *   action: {
  *     name: 'playlist_activity',
  *     service: 'Spotify',
  *     params: { playlistUrl: 'https://open.spotify.com/playlist/...' },
  *   },
  *   reaction: {
  *     name: 'send_webhook_message',
  *     service: 'Discord',
  *     params: { url: 'https://discord.com/api/webhooks/...' },
  *   },
  *   active: true,
  * });
  * console.log(newApplet); // Logs the newly created applet object.
  * ```
  */
  async createApplet(
    userId: string,
    appletDto: AppletBodyDto
  ): Promise<AppletDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
  
    const newApplet: AppletDto = {
      appletId: uuidv4(),
      userId,
      action: null,
      reaction: appletDto.reaction,
      active: appletDto.active,
      metadata: null,
    };
  
    try {
      const actionResponse = await this.actionsService.executeAction(
        userId,
        appletDto.action.name,
        appletDto.action.params,
      );

      if (actionResponse) {
        newApplet.metadata = {
          "response": actionResponse
        }
      }

      const appletAction: AppletModuleDto = {
        name: appletDto.action.name,
        service: appletDto.action.service,
        params: appletDto.action.params,
      };
      newApplet.action = appletAction;
    } catch (error) {
      throw new Error(`Failed to init action "${appletDto.action.name}": ${error.message}`);
    }
  
    user.applets.push(newApplet);
    await user.save();  
    return newApplet;
  }

  /**
  * Updates an existing applet for a specified user.
  * 
  * This service updates an applet's action, reaction, active status, and metadata 
  * for a given user. If the action details are modified, the service initializes 
  * the new action, destroys the previous action, and updates the metadata accordingly.
  * 
  * @param userId - The ID of the user who owns the applet.
  * @param appletId - The ID of the applet to be updated.
  * @param appletDto - The data transfer object containing the updated applet details 
  * including action, reaction, active status, and additional configurations.
  * 
  * @returns A promise resolved with the updated `AppletDto` object.
  * 
  * @throws NotFoundException - If the user or the applet is not found.
  * @throws BadRequestException - If the action name or parameters are invalid.
  * 
  * ### Usage Example:
  * ```typescript
  * const updatedApplet = await updateApplet(
  *   '12345abc',
  *   '5d2180df-3d7a-4c3a-82de-ff61484e7aab',
  *   {
  *     action: {
  *       name: 'playlist_activity',
  *       service: 'Spotify',
  *       params: { playlistUrl: 'https://open.spotify.com/playlist/...' },
  *     },
  *     reaction: {
  *       name: 'send_webhook_message',
  *       service: 'Discord',
  *       params: { url: 'https://discord.com/api/webhooks/...', content: 'Updated content' },
  *     },
  *     active: true,
  *   }
  * );
  * console.log(updatedApplet); // Logs the updated applet object.
  * ```
  */
  async updateApplet(
    userId: string,
    appletId: string,
    appletDto: AppletBodyDto
  ): Promise<AppletDto> {
    const user = await this.userModel.findOne(
      {
        _id: userId,
        'applets.appletId': appletId,
      },
      { 'applets.$': 1 }
    ).lean();
  
    if (!user || !user.applets || user.applets.length === 0) {
      throw new NotFoundException(
        `Applet with ID ${appletId} not found for user ${userId}.`
      );
    }
  
    const existingApplet = user.applets[0];
    const newMetadata = { response: {} };
  
    if (
      existingApplet.action.name !== appletDto.action.name ||
      JSON.stringify(existingApplet.action.params) !==
        JSON.stringify(appletDto.action.params)
    ) {
      try {
        const initResponse = await this.actionsService.executeAction(
          userId,
          appletDto.action.name,
          appletDto.action.params
        );
  
        if (initResponse) {
          await this.actionsService.destroyAction(
            userId,
            existingApplet.action.name,
            existingApplet.metadata
          );
          newMetadata.response = initResponse;
        } else {
          throw new Error(`Failed to init new action.`);
        }
      } catch (error) {
        throw new BadRequestException(
          `Invalid action name or parameters: ${error.message}`
        );
      }
      console.log(`Action successfully updated for applet: ${appletId}.`);
    } else {
      newMetadata.response = existingApplet.metadata.response;
    }

    await this.userModel.updateOne(
      {
        _id: userId,
        'applets.appletId': appletId,
      },
      {
        $set: {
          'applets.$.action': appletDto.action,
          'applets.$.reaction': appletDto.reaction,
          'applets.$.active': appletDto.active,
          'applets.$.metadata': newMetadata,
        },
      }
    );
  
    const updatedUser = await this.userModel.findOne(
      {
        _id: userId,
        'applets.appletId': appletId,
      },
      { 'applets.$': 1 }
    ).lean();
  
    if (!updatedUser || !updatedUser.applets || updatedUser.applets.length === 0) {
      throw new NotFoundException(
        `Failed to update applet with ID ${appletId} for user ${userId}.`
      );
    }
  
    console.log(`New applet data set for user: ${userId}`);
    return updatedUser.applets[0];
  }


  /**
  * Deletes an applet for a specified user.
  * 
  * This service removes an applet from a user's collection by its ID. Before deletion, 
  * it destroys any associated action and metadata using the `destroyAction` method 
  * from the `actionsService`.
  * 
  * @param userId - The ID of the user who owns the applet.
  * @param appletId - The ID of the applet to be deleted.
  * 
  * @returns A promise that resolves to `true` if the applet was successfully deleted.
  * 
  * @throws NotFoundException - If the user or the applet is not found, or if the deletion fails.
  * 
  * ### Usage Example:
  * ```typescript
  * const isDeleted = await deleteApplet('12345abc', '5d2180df-3d7a-4c3a-82de-ff61484e7aab');
  * if (isDeleted) {
  *   console.log('Applet successfully deleted.');
  * }
  * ```
  */
  async deleteApplet(
    userId: string,
    appletId: string
  ): Promise<boolean> {

    const user = await this.userModel.findOne(
      {
        _id: userId,
        'applets.appletId': appletId,
      },
      { 'applets.$': 1 }
    ).lean();

    if (!user || !user.applets || user.applets.length === 0) {
      throw new NotFoundException(
        `Applet with ID ${appletId} not found for user ${userId}.`
      );
    }

    this.actionsService.destroyAction(userId, user.applets[0].action.name, user.applets[0].metadata)

    const result = await this.userModel.updateOne(
      { _id: userId, 'applets.appletId': appletId },
      { $pull: { applets: { appletId: appletId } } }
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        `Failed to delete applet with ID ${appletId} for user ${userId}.`
      );
    }  
    return true;
  }
}
