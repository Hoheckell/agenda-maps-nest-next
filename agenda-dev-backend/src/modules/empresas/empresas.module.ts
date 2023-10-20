import { Module } from '@nestjs/common';
import { EmpresasController } from './controllers';
import { EmpresasService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/Empresa';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  controllers: [EmpresasController],
  providers: [EmpresasService],
})
export class EmpresasModule {}
