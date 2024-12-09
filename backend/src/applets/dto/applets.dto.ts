import { ApiProperty } from '@nestjs/swagger';

export class AppletModuleDto {
    @ApiProperty({ example: "discord",  description: "The service of the action/reaction"})
    service: string;

    @ApiProperty({ example: "send_webhook_message",  description: "The name of the action/reaction"})
    name: string;

    @ApiProperty({ example: {
        webhook_url: "https://discord/webhook/dzkadlzakjdlzakjdlzakjdl/zakjd",
        content: "This is a first example message"
    },  description: "The name of the action/reaction"})
    params: {};
}

export class AppletDto {
    appletId: number;
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

    active: boolean;
}
