import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedEmpresaDto {
  @ApiProperty()
  @IsOptional()
  offset?: number;

  @ApiProperty()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  razao_social?: string;

  @ApiProperty()
  @IsOptional()
  nome_fantasia?: string;

  @ApiProperty()
  @IsOptional()
  cnpj?: string;

  @ApiProperty()
  @IsOptional()
  endereco?: string;
}
