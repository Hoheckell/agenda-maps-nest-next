import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasController } from './controllers';
import { PessoasService } from './services';
import { Pessoa } from './entities/Pessoa';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  controllers: [PessoasController],
  providers: [PessoasService, MailService],
})
export class PessoasModule {}
