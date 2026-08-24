import { PartialType } from '@nestjs/swagger';
import { CreateSafeContactDto } from './create-safe-contact.dto';

export class UpdateSafeContactDto extends PartialType(CreateSafeContactDto) {}
