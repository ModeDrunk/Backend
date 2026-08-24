import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class DeactivateDrunkModeDto {
  @ApiProperty({
    example: '1234',
    description: 'PIN code to deactivate drunk mode',
  })
  @IsString()
  @MinLength(4)
  pinCode: string | undefined;

  @ApiProperty({
    required: false,
    default: 'pin',
    description: 'pin, biometric, timeout',
  })
  @IsString()
  @IsOptional()
  deactivationType?: string;
}
