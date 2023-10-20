import { OmitType } from '@nestjs/swagger';
import { PessoaDto } from './pessoa.dto';

export class CreatePessoaDto extends OmitType(PessoaDto, ['id']) {}
