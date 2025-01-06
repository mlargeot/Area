import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
  constructor() {}

  private servicesDescription: Array<{
    service: string;
    description: string;
  }> = [
    {
        service: "Twitch",
        description: "Twitch is a live streaming platform primarily focused on gaming, where content creators can broadcast their gameplay, interact with their audience in real-time, and share other types of content like music, discussions, or tutorials. It also allows viewers to follow and support streamers through subscriptions and donations.",
    },
    {
        service: "Discord",
        description: "Discord is a communication platform offering customizable servers for text, voice, and video chats. It is popular among gaming communities but has also expanded to businesses, clubs, and social groups for collaboration, file sharing, and online event organization."
    },
    {
        service: "GitHub",
        description: "GitHub is a platform for source code management and collaboration, primarily used by developers to host, version, and share their programming projects. It provides tools like issue tracking, pull requests, and actions for continuous integration, fostering efficient teamwork."
    },
    {
        service: "Microsoft",
        description: "Microsoft is a technology company offering software, hardware, and cloud solutions. It is known for products like Windows, Office 365, Azure (cloud services), and collaborative tools like Teams. Microsoft also provides services for developers and businesses through its APIs and integrations."
    },
    {
        service: "Spotify",
        description: "Spotify is a music streaming platform that offers access to millions of songs, podcasts, and playlists. It allows users to listen online or offline, discover new music through personalized recommendations, and share playlists with others."
    },
    {
        service: "Google",
        description: "Google is a global technology company offering services like its search engine, Gmail, Google Drive, YouTube, and Google Cloud. It also provides integration solutions through APIs, enabling access to features like calendar management, email handling, and data analysis through its powerful tools."
    }
  ];

  getServicesDescription() {
    return this.servicesDescription;
  }
}
