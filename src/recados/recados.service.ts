import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoaService } from 'src/pessoa/pessoa.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoaService: PessoaService,
  ) {}

  throwNotFound() {
    throw new NotFoundException('Recado não encontrado');
  }

  async getRecados(paginationDto?: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto ?? {};

    const [recados, total] = await this.recadoRepository.findAndCount({
      take: limit,
      skip: offset,
      // relations: ['de', 'para'],
      order: {
        createdAt: 'DESC',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    return { data: recados, total };
  }

  async getById(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: { id },
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (!recado) {
      this.throwNotFound();
    }
    return recado;
  }

  async create(payload: CreateRecadoDto) {
    const { deId, paraId } = payload;

    const de = await this.pessoaService.findOne(deId);
    const para = await this.pessoaService.findOne(paraId);

    const recado = {
      texto: payload.texto,
      de,
      para,
      lido: false,
    };

    const novoReacdo = this.recadoRepository.create(recado);
    await this.recadoRepository.save(novoReacdo);

    return {
      ...novoReacdo,
      de: {
        id: de.id,
        nome: de.nome,
      },
      para: {
        id: para.id,
        nome: para.nome,
      },
    };
  }

  async update(id: number, payload: UpdateRecadoDto) {
    const recado = await this.getById(id);

    if (!recado) return this.throwNotFound();

    recado.texto = payload?.texto ?? recado.texto;
    recado.lido = payload?.lido ?? recado.lido;
    return this.recadoRepository.save(recado);
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({ id });

    if (!recado) return this.throwNotFound();

    return this.recadoRepository.remove(recado);
  }
}
