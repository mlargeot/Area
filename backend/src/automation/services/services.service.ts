import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
  constructor() {}

  private servicesDescription: Array<{
    service: string;
    description: string;
    color: string;
    icon_url: string;
  }> = [
    {
        service: "Twitch",
        icon_url: "https://docs.expo.dev/static/images/sdk/auth-session/twitch.png",
        description: "Twitch is a live streaming platform primarily focused on gaming, where content creators can broadcast their gameplay, interact with their audience in real-time, and share other types of content like music, discussions, or tutorials. It also allows viewers to follow and support streamers through subscriptions and donations.",
        color: "#9146FF"
      },
    {
        service: "Discord",
        icon_url: "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
        description: "Discord is a communication platform offering customizable servers for text, voice, and video chats. It is popular among gaming communities but has also expanded to businesses, clubs, and social groups for collaboration, file sharing, and online event organization.",
        color: "#5865F2"
      },
    {
        service: "Github",
        icon_url: "https://docs.expo.dev/static/images/sdk/auth-session/github.png",
        description: "GitHub is a platform for source code management and collaboration, primarily used by developers to host, version, and share their programming projects. It provides tools like issue tracking, pull requests, and actions for continuous integration, fostering efficient teamwork.",
        color: "#333333"
      },
    {
        service: "Microsoft",
        icon_url: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
        description: "Microsoft is a technology company offering software, hardware, and cloud solutions. It is known for products like Windows, Office 365, Azure (cloud services), and collaborative tools like Teams. Microsoft also provides services for developers and businesses through its APIs and integrations.",
        color: "#00A4EF"
      },
    {
        service: "Spotify",
        icon_url: "https://docs.expo.dev/static/images/sdk/auth-session/spotify.png",
        description: "Spotify is a music streaming platform that offers access to millions of songs, podcasts, and playlists. It allows users to listen online or offline, discover new music through personalized recommendations, and share playlists with others.",
        color: "#1DB954"
      },
    {
        service: "Google",
        icon_url: "https://docs.expo.dev/static/images/sdk/auth-session/google.png",
        description: "Google is a global technology company offering services like its search engine, Gmail, Google Drive, YouTube, and Google Cloud. It also provides integration solutions through APIs, enabling access to features like calendar management, email handling, and data analysis through its powerful tools.",
        color: "#FF0000"
      },
      {
        service: "Itch.io",
        icon_url: "https://static-00.iconduck.com/assets.00/itch-io-icon-1024x1024-fev9qpvd.png",
        description: "Itch.io is a platform for indie game developers to share, sell, and download games. It offers a wide range of games, from experimental projects to commercial releases, and supports developers through features like analytics, sales tracking, and community engagement.",
        color: "#FA5C5C"
      },
      {
        service: "Youtube",
        icon_url: "https://cdn3.iconfinder.com/data/icons/social-network-30/512/social-06-512.png",
        description: "YouTube is a video-sharing platform where users can upload, view, rate, share, and comment on videos. It hosts a wide range of content, including music videos, educational tutorials, vlogs, and live streams. YouTube also offers monetization options for content creators through ads and memberships.",
        color: "#FF0000"
      },
      {
        service: "Strava",
        icon_url: "https://docs.expo.dev/static/images/sdk/auth-session/strava.png",
        description: "Strava is a social fitness network that allows users to track and share their activities like running, cycling, and swimming. It offers features for route planning, performance analysis, and community engagement, motivating athletes to set and achieve their fitness goals.",
        color: "#FC4C02"
      },
      {
        service: "Facebook",
        icon_url: "https://docs.expo.dev/static/images/sdk/auth-session/facebook.png",
        description: "Facebook is a social media platform for connecting with friends, family, and communities. Users can share updates, photos, videos, and events, as well as join groups and pages based on their interests. Facebook also offers advertising and business tools for brands and organizations.",
        color: "#1877F2"
      },
      {
        service: "League of Legends",
        icon_url: "https://freepngimg.com/download/league_of_legends/85643-blue-league-legends-icons-of-symbol-garena.png",
        description: "League of Legends is a popular multiplayer online battle arena (MOBA) game developed by Riot Games. Players compete in teams to destroy the enemy Nexus while battling champions with unique abilities. The game has a large esports scene and a dedicated community of players worldwide.",
        color: "#F89D14"
      }
  ];

  getServicesDescription() {
    return this.servicesDescription;
  }
}
