import { ApiProperty } from '@nestjs/swagger';
import { PessoaDto } from './pessoa.dto';

export class NewPessoaDto {
  @ApiProperty()
  pessoa: PessoaDto;
}
