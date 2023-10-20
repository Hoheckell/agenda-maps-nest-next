import { Column, Entity, Index } from 'typeorm';

@Index('Pessoas_pkey', ['id'], { unique: true })
@Entity('Pessoas', { schema: 'public' })
export class Pessoa {
  @Column('bigint', { primary: true, name: 'id', unique: true })
  id: number;

  @Column('character varying', { name: 'nome' })
  nome: string;

  @Column('character varying', { name: 'email', unique: true })
  email: string;

  @Column('date', { name: 'data_nascimento' })
  data_nascimento: Date;

  @Column('character varying', { name: 'sexo' })
  sexo: string;

  @Column('character varying', { name: 'empresa' })
  empresa: string;

  @Column('character varying', { name: 'whatsapp', nullable: true })
  whatsapp: string;

  @Column('character varying', { name: 'celular', nullable: true })
  celular: string;

  @Column('character varying', { name: 'endereco' })
  endereco: string;

  @Column('character varying', { name: 'foto', nullable: true })
  foto: string;
}
