import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedPessoaDto {
  @ApiProperty()
  @IsOptional()
  offset: number;

  @ApiProperty()
  @IsOptional()
  limit: number;

  @ApiProperty()
  @IsOptional()
  nome: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  endereco: string;

  @ApiProperty()
  @IsOptional()
  empresa: string;
}
