import { Column, Entity, Index } from 'typeorm';

@Index('Empresas_pkey', ['id'], { unique: true })
@Entity('Empresas', { schema: 'public' })
export class Empresa {
  @Column('bigint', { primary: true, name: 'id', unique: true })
  id: number;

  @Column('character varying', { name: 'razao_social' })
  razao_social: string;

  @Column('character varying', { name: 'nome_fantasia' })
  nome_fantasia: string;

  @Column('character varying', { name: 'email', unique: true })
  email: string;

  @Column('character varying', { name: 'cnpj', unique: true })
  cnpj: string;

  @Column('character varying', { name: 'responsavel' })
  responsavel: string;

  @Column('character varying', { name: 'whatsapp' })
  whatsapp: string;

  @Column('character varying', { name: 'celular' })
  celular: string;

  @Column('character varying', { name: 'telefone' })
  telefone: string;

  @Column('character varying', { name: 'endereco' })
  endereco: string;

  @Column('character varying', { name: 'logo' })
  logo: string;
}
