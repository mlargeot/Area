import { ApiProperty } from '@nestjs/swagger';

export class AppletModuleDto {
    service: string;
    name: string;
    params: {};
}

export class AppletDto {
    @ApiProperty({ example: 10, description: "Applet id."})
    appletId: number;

    @ApiProperty({ example: 1, description: "applet user id."})
    userId: number;

    @ApiProperty({ example: {
        service: "github",
        name: "pr_assigned",
        params: {
            email: "example@gmail.com",
            githubRepoUrl: "https://github.com/owner/repository"
        }
    }, description: 'The action of the applet' })
    action: AppletModuleDto;

    @ApiProperty({ example: {
        service: "discord",
        name: "send_webhook_message",
        params: {
            webhook_url: "https://discord/webhook/dzkadlzakjdlzakjdlzakjdl/zakjd",
            content: "This is a first example message"
        }
    }, description: 'The action of the applet' })
    reaction: AppletModuleDto;

    @ApiProperty({ example: true, description: "Activity of the applet."})
    active: boolean;
}

export class AppletBodyDto {
    @ApiProperty({ example: {
        service: "github",
        name: "pr_assigned",
        params: {
            email: "example@gmail.com",
            githubRepoUrl: "https://github.com/owner/repository"
        }
    }, description: 'The action of the applet' })
    action: AppletModuleDto;

    @ApiProperty({ example: {
        service: "discord",
        name: "send_webhook_message",
        params: {
            webhook_url: "https://discord/webhook/dzkadlzakjdlzakjdlzakjdl/zakjd",
            content: "This is a first example message"
        }
    }, description: 'The action of the applet' })
    reaction: AppletModuleDto;

    @ApiProperty({ example: true, description: "Activity of the applet."})
    active: boolean;
}
