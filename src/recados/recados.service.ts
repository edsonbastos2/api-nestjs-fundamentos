import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Exemplo de recado',
      de: 'usuário1',
      para: 'usuário2',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFound() {
    throw new NotFoundException('Recado não encontrado');
  }

  getReacdos() {
    return this.recados;
  }

  getById(id: string) {
    const recado = this.recados.find((r) => r.id === +id);
    if (!recado) {
      this.throwNotFound();
    }
    return recado;
  }

  create(payload: CreateRecadoDto) {
    const recado = {
      id: ++this.lastId,
      ...payload,
      lido: false,
      data: new Date(),
    };

    this.recados.push(recado);

    return recado;
  }

  update(id: string, payload: UpdateRecadoDto) {
    const index = this.recados.findIndex((r) => r.id === +id);

    if (index < 0) {
      this.throwNotFound();
    }

    if (index >= 0) {
      const recadoExistente = this.recados[index];
      this.recados[index] = {
        ...recadoExistente,
        ...payload,
      };

      return this.recados[index];
    }
  }

  remove(id: string) {
    const index = this.recados.findIndex((r) => r.id === +id);
    if (index < 0) {
      this.throwNotFound();
    }
    if (index >= 0) {
      this.recados.splice(index, 1);
    }
  }
}
