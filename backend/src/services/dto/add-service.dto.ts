import { ApiProperty } from '@nestjs/swagger';

export class AddServiceDto {
  @ApiProperty({
    description: 'The platform of the request (web or mobile)',
    example: 'web',
  })
  platform: string;
}
