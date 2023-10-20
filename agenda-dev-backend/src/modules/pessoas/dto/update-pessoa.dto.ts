import { PartialType } from '@nestjs/swagger';
import { PessoaDto } from './pessoa.dto';

export class UpdatePessoaDto extends PartialType(PessoaDto) {}
