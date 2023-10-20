import { PartialType } from '@nestjs/swagger';
import { EmpresaDto } from './empresa.dto';

export class UpdateEmpresaDto extends PartialType(EmpresaDto) {}
