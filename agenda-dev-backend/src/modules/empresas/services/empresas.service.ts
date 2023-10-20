import { HttpException, Injectable } from '@nestjs/common';
import { Empresa } from '../entities/Empresa';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResultDto } from 'src/modules/pessoas/dto/paginated-result.dto';
import { EmpresaDto } from '../dto/empresa.dto';
import { PaginatedEmpresaDto } from '../dto/paginated-empresa.dto';
import { CreateEmpresaDto } from '../dto/create-empresa.dto';
import { unlink } from 'fs';
import { UpdateEmpresaDto } from '../dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(
    empresa: CreateEmpresaDto,
    logo: Express.Multer.File,
  ): Promise<EmpresaDto> {
    try {
      if (logo) {
        empresa.logo = logo.filename;
      }
      const cnpjExists = await this.empresaRepository.findOneBy({
        cnpj: empresa.cnpj,
      });
      const emailExists = await this.empresaRepository.findOneBy({
        email: empresa.email,
      });
      if (!cnpjExists && !emailExists) {
        return await this.empresaRepository.save(empresa);
      }
    } catch (e) {
      throw e;
    }
  }

  async getAll(
    paginate: PaginatedEmpresaDto,
  ): Promise<PaginatedResultDto<EmpresaDto>> {
    const pessoas = await this.empresaRepository.find({
      where: {
        ...(paginate?.razao_social
          ? { razao_social: Like(`%${paginate.razao_social}%`) }
          : {}),
        ...(paginate?.nome_fantasia
          ? { nome_fantasia: Like(`%${paginate.nome_fantasia}%`) }
          : {}),
        ...(paginate?.cnpj ? { cnpj: Like(`%${paginate.cnpj}%`) } : {}),
        ...(paginate?.email ? { email: Like(`%${paginate.email}%`) } : {}),
        ...(paginate?.endereco
          ? { endereco: Like(`%${paginate.endereco}%`) }
          : {}),
      },
      take: paginate?.limit,
      skip: paginate?.offset,
    });
    return { results: pessoas, count: pessoas.length };
  }

  async getBytId(id: number): Promise<EmpresaDto> {
    return await this.empresaRepository.findOneBy({ id });
  }

  public async update(
    id: number,
    empresa: UpdateEmpresaDto,
  ): Promise<EmpresaDto> {
    await this.empresaRepository.update(id, empresa);
    return await this.empresaRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    const empresa = await this.empresaRepository.findOneBy({ id });
    if (empresa) {
      unlink(`./uploads/${empresa.logo}`, (err) => {
        if (err) throw err;
      });
      await this.empresaRepository.delete(id);
    }
  }

  async addLogo(id: number, file: Express.Multer.File) {
    if (file) {
      const empresa = await this.empresaRepository.findOneBy({ id });
      empresa.logo = file.filename;
      return await this.empresaRepository.save(empresa);
    } else {
      throw new HttpException('Foto inválida', 404);
    }
  }

  async removeLogo(id: number): Promise<EmpresaDto> {
    try {
      const empresa = await this.empresaRepository.findOneBy({ id });
      if (empresa) {
        unlink(`./uploads/${empresa.logo}`, (err) => {
          if (err) throw err;
        });
        empresa.logo = null;
        const updated = await this.empresaRepository.update(id, empresa);
        if (updated.affected > 0) {
          return empresa;
        }
      } else {
        throw new HttpException('Logo não encontrada', 404);
      }
    } catch (e) {
      throw e;
    }
  }
}
