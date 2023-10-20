import { HttpException, Injectable } from '@nestjs/common';
import { Pessoa } from '../entities/Pessoa';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeleteResult,
  Like,
  Repository,
  UpdateResult,
  getConnection,
  getManager,
} from 'typeorm';
import { PessoaDto } from '../dto/pessoa.dto';
import { UpdatePessoaDto } from '../dto/update-pessoa.dto';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';
import { PaginatedPessoaDto } from '../dto/paginated-pessoa.dto';
import { PaginatedResultDto } from '../dto/paginated-result.dto';
import { unlink } from 'fs';
import * as moment from 'moment';
import { plainToClass } from '@nestjs/class-transformer';
import { AniversariantesDto } from '../dto/aniversariantes.dto';
import { EmailData } from '../../../modules/mail/dto/email-data.dto';
import { MailService } from '../../../modules/mail/mail.service';
import { EmailResponse } from 'src/modules/mail/dto/email-response.dto';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private mailService: MailService,
  ) {}

  async create(
    pessoa: CreatePessoaDto,
    file: Express.Multer.File,
  ): Promise<PessoaDto> {
    if (file) {
      pessoa.foto = file.filename;
    }
    const emailExists = await this.pessoaRepository.findOneBy({
      email: pessoa.email,
    });
    if (!emailExists) {
      return await this.pessoaRepository.save(pessoa);
    }
  }

  async getAll(
    paginate: PaginatedPessoaDto,
  ): Promise<PaginatedResultDto<PessoaDto>> {
    const pessoas = await this.pessoaRepository.find({
      where: {
        ...(paginate?.nome ? { nome: Like(`%${paginate.nome}%`) } : {}),
        ...(paginate?.email ? { email: Like(`%${paginate.email}%`) } : {}),
        ...(paginate?.endereco ? { email: Like(`%${paginate.email}%`) } : {}),
        ...(paginate?.empresa
          ? { empresa: Like(`%${paginate.empresa}%`) }
          : {}),
      },
      take: paginate?.limit,
      skip: paginate?.offset,
    });
    return { results: pessoas, count: pessoas.length };
  }

  async getBytId(id: number): Promise<PessoaDto> {
    return await this.pessoaRepository.findOneBy({ id });
  }

  async update(id: number, pessoa: UpdatePessoaDto): Promise<PessoaDto> {
    await this.pessoaRepository.update(id, pessoa);
    return await this.pessoaRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    try {
      const pessoa = await this.pessoaRepository.findOneBy({ id });
      if (pessoa) {
        unlink(`./uploads/${pessoa.foto}`, (err) => {
          if (err) throw err;
        });
        await this.pessoaRepository.delete(id);
      } else {
        throw new HttpException('Pessoa não encontrada', 404);
      }
    } catch (e) {
      throw e;
    }
  }

  async removePhoto(id: number): Promise<PessoaDto> {
    try {
      const pessoa = await this.pessoaRepository.findOneBy({ id });
      if (pessoa) {
        unlink(`./uploads/${pessoa.foto}`, (err) => {
          if (err) throw err;
        });
        pessoa.foto = null;
        const updated = await this.pessoaRepository.update(id, pessoa);
        if (updated.affected > 0) {
          return pessoa;
        }
      } else {
        throw new HttpException('Foto não encontrada', 404);
      }
    } catch (e) {
      throw e;
    }
  }

  async addPhoto(id: number, file: Express.Multer.File) {
    if (file) {
      const pessoa = await this.pessoaRepository.findOneBy({ id });
      pessoa.foto = file.filename;
      return await this.pessoaRepository.save(pessoa);
    } else {
      throw new HttpException('Foto inválida', 404);
    }
  }

  async getAniversariantes(): Promise<AniversariantesDto> {
    const aniversariantes = await this.pessoaRepository
      .createQueryBuilder()
      .where('EXTRACT(month FROM data_nascimento) = :month', {
        month: moment().toDate().getMonth() + 1,
      })
      .getMany();

    const aniversariantesDto: AniversariantesDto = { days: [], pessoas: [] };

    if (aniversariantes?.length > 0) {
      aniversariantes.map((a) => {
        if (
          !aniversariantesDto.days.includes(
            moment(a.data_nascimento).toDate().getDate(),
          )
        ) {
          aniversariantesDto.days.push(
            moment(a.data_nascimento).toDate().getDate(),
          );
        }
        aniversariantesDto.pessoas.push(plainToClass(PessoaDto, a));
      });
    }
    return aniversariantesDto;
  }

  async sendBirthdayMessage(data: EmailData): Promise<EmailResponse> {
    return await this.mailService.sendBirthdayMessage(data);
  }
}
