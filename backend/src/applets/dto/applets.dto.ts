import { ApiProperty } from '@nestjs/swagger';

export class AppletModuleDto {
    service: string;
    name: string;
    params: {};
}

export class AppletDto {
    @ApiProperty({ example: "675628e68b37fadf8ffeaeaczeceq565", description: "Applet id."})
    appletId: string;

    @ApiProperty({ example: "675628e68b37fadf8ff9b9b4", description: "applet user id."})
    userId: string;

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
