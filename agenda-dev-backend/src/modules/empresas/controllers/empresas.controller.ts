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
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EmpresasService } from '../services';
import { EmpresaDto } from '../dto/empresa.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaginatedResultDto } from 'src/modules/empresas/dto/paginated-result.dto';
import { ApiPaginatedResponse } from 'src/modules/swagger/api-paginated-response.decorator';
import { PaginatedEmpresaDto } from '../dto/paginated-empresa.dto';
import { UpdateEmpresaDto } from '../dto/update-empresa.dto';
import { NewEmpresaDto } from '../dto/new-empresa.dto';
import { CreateEmpresaDto } from '../dto/create-empresa.dto';
import { isString } from '@nestjs/class-validator';

@ApiTags('empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresaService: EmpresasService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ description: 'Obter Empresas' })
  @ApiPaginatedResponse({ status: 200, isArray: true }, EmpresaDto)
  async index(
    @Query() paginateEmpresaDto: PaginatedEmpresaDto,
  ): Promise<PaginatedResultDto<EmpresaDto>> {
    return await this.empresaService.getAll(paginateEmpresaDto);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
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
  @ApiOperation({ description: 'Cadastrar empresa' })
  @ApiOkResponse({ type: EmpresaDto })
  @ApiBody({ type: NewEmpresaDto })
  async store(
    @Body() data: NewEmpresaDto,
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
    logo: Express.Multer.File,
  ): Promise<EmpresaDto> {
    let newEmpresa: CreateEmpresaDto;
    if (isString(data.empresa)) {
      newEmpresa = JSON.parse(data.empresa);
    }

    const created = await this.empresaService.create(newEmpresa, logo);
    if (!created) {
      throw new HttpException('Dados Inválidos', HttpStatus.BAD_REQUEST);
    }
    return created;
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ description: 'Obter uma empresa' })
  @ApiOkResponse({ type: EmpresaDto })
  async show(@Param('id') id: number): Promise<EmpresaDto> {
    return await this.empresaService.getBytId(id);
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({ description: 'Atualizar uma empresa' })
  @ApiOkResponse({ type: EmpresaDto })
  @ApiParam({ type: 'number', name: 'id' })
  async update(
    @Param('id') id: number,
    @Body() empresa: UpdateEmpresaDto,
  ): Promise<EmpresaDto> {
    return await this.empresaService.update(id, empresa);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({ description: 'Excluir uma empresa' })
  @ApiOkResponse()
  async delete(@Param('id') id: number) {
    return await this.empresaService.delete(id);
  }

  @Post('/add/logo/:id')
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
  @ApiOperation({ description: 'Adicionar a logo de uma empresa' })
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
  ): Promise<EmpresaDto> {
    return await this.empresaService.addLogo(id, file);
  }

  @Put('/remove/logo/:id')
  @HttpCode(200)
  @ApiOperation({ description: 'Excluir a foto de uma pessoa' })
  @ApiOkResponse()
  async removeLogo(@Param('id') id: number) {
    return await this.empresaService.removeLogo(id);
  }
}
