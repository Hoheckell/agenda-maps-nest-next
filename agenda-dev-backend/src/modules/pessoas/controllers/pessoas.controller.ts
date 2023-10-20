import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PessoasService } from '../services';
import { ApiPaginatedResponse } from 'src/modules/swagger/api-paginated-response.decorator';
import { PaginatedResultDto } from '../dto/paginated-result.dto';
import { PaginatedPessoaDto } from '../dto/paginated-pessoa.dto';
import { UpdatePessoaDto } from '../dto/update-pessoa.dto';
import { PessoaDto } from '../dto/pessoa.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NewPessoaDto } from '../dto/new-pessoa.dto';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';
import { isString } from '@nestjs/class-validator';
import { AniversariantesDto } from '../dto/aniversariantes.dto';
import { EmailData } from '../../../modules/mail/dto/email-data.dto';
import { EmailResponse } from 'src/modules/mail/dto/email-response.dto';

@ApiTags('pessoas')
@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoaService: PessoasService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ description: 'Obter Pessoas' })
  @ApiPaginatedResponse({ status: 200, isArray: true }, PessoaDto)
  async index(
    @Query() paginatePessoaDto: PaginatedPessoaDto,
  ): Promise<PaginatedResultDto<PessoaDto>> {
    return await this.pessoaService.getAll(paginatePessoaDto);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @HttpCode(201)
  @ApiOperation({ description: 'Cadastrar pessoa' })
  @ApiOkResponse({ type: PessoaDto })
  async store(
    @Body() data: NewPessoaDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<PessoaDto> {
    let newPessoa: CreatePessoaDto;
    if (isString(data.pessoa)) {
      newPessoa = JSON.parse(data.pessoa);
    }
    const created = await this.pessoaService.create(newPessoa, file);
    if (!created) {
      throw new HttpException('Dados Inválidos', HttpStatus.BAD_REQUEST);
    }
    return created;
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ description: 'Obter uma pessoa' })
  @ApiOkResponse({ type: PessoaDto })
  async show(@Param('id') id: number): Promise<PessoaDto> {
    return await this.pessoaService.getBytId(id);
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({ description: 'Atualizar uma pessoa' })
  @ApiOkResponse({ type: PessoaDto })
  async update(
    @Param('id') id: number,
    @Body() pessoa: UpdatePessoaDto,
  ): Promise<PessoaDto> {
    return await this.pessoaService.update(id, pessoa);
  }

  @Post('/add/photo/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @HttpCode(200)
  @ApiOperation({ description: 'Adicionar a foto de uma pessoa' })
  @ApiOkResponse()
  async addPhoto(
    @Param('id') id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<PessoaDto> {
    return await this.pessoaService.addPhoto(id, file);
  }

  @Put('/remove/photo/:id')
  @HttpCode(200)
  @ApiOperation({ description: 'Excluir a foto de uma pessoa' })
  @ApiOkResponse()
  async removePhoto(@Param('id') id: number) {
    return await this.pessoaService.removePhoto(id);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({ description: 'Excluir uma pessoa' })
  @ApiOkResponse()
  async delete(@Param('id') id: number) {
    return await this.pessoaService.delete(id);
  }

  @Get('/aniversariantes/mes')
  @HttpCode(200)
  @ApiOperation({ description: 'Listar aniversariantes do mês' })
  @ApiOkResponse({ type: PessoaDto, isArray: true })
  async getAniversariantes(): Promise<AniversariantesDto> {
    return await this.pessoaService.getAniversariantes();
  }

  @Post('/mensagem/aniversario')
  @HttpCode(200)
  @ApiOperation({ description: 'Enviar mensagem de aniversário' })
  @ApiOkResponse()
  async sendBirthdayMessage(@Body() data: EmailData): Promise<EmailResponse> {
    return await this.pessoaService.sendBirthdayMessage(data);
  }
}
