import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const pessoa = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash: createPessoaDto.password,
      };

      const novaPessoa = this.pessoaRepository.create(pessoa);
      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Email já cadastrado no sistema');
      }
      throw new Error('Error ao criar pessoa: ' + error.message);
    }
  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const pessoa = {
      nome: updatePessoaDto?.nome,
      passwordHash: updatePessoaDto?.password,
    };

    const pessoaAtualizada = await this.pessoaRepository.preload({
      id,
      ...pessoa,
    });

    if (!pessoaAtualizada) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return this.pessoaRepository.save(pessoaAtualizada);
  }

  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return this.pessoaRepository.remove(pessoa);
  }
}
