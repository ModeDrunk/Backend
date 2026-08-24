import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';

export class CreateSafeContactDto {
  @ApiProperty({ example: 'María González' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '+521234567890' })
  @IsPhoneNumber()
  phone!: string;

  @ApiPropertyOptional({ example: 'maria@ejemplo.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 0, description: '0 = highest priority' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  priority?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
