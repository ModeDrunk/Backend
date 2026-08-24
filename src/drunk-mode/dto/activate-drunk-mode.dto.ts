import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ActivateDrunkModeDto {
  @ApiProperty({
    required: false,
    default: 'manual',
    description: 'manual, voice, schedule',
  })
  @IsOptional()
  @IsString()
  activationType?: string;

  @ApiProperty({ required: false, example: { location: 'home' } })
  @IsOptional()
  metadata?: Record<string, any>;
}
