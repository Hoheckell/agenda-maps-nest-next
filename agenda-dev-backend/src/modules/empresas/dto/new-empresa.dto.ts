import { ApiProperty } from '@nestjs/swagger';
import { EmpresaDto } from './empresa.dto';

export class NewEmpresaDto {
  @ApiProperty()
  empresa: EmpresaDto;
}
