import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PessoaDto {
  @ApiProperty()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDate()
  data_nascimento: Date;

  @ApiProperty()
  @IsString()
  sexo: string;

  @ApiProperty()
  @IsString()
  empresa: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  whatsapp?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  celular?: string | null;

  @ApiProperty()
  @IsString()
  endereco: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  foto?: string | null;
}
