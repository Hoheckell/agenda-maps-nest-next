import { OmitType } from '@nestjs/swagger';
import { EmpresaDto } from './empresa.dto';

export class CreateEmpresaDto extends OmitType(EmpresaDto, ['id']) {}
