import { IsString, IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmpresaDto {
  @ApiProperty()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsString()
  razao_social: string;

  @ApiProperty()
  @IsString()
  nome_fantasia: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  cnpj: string;

  @ApiProperty()
  @IsString()
  responsavel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  celular?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty()
  @IsString()
  endereco: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;
}
