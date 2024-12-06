import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Método para obtener todos los usuarios (opcionalmente con paginación)
  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    return this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // Método para crear un nuevo usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create({
      ...createUserDto, // Ya no necesitamos convertir phone, ya es un número
    });
    return this.usersRepository.save(newUser);
  }

  // Método para obtener un usuario por ID
  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Método para actualizar un usuario
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, {
      ...updateUserDto, // Ya no necesitamos convertir phone, ya es un número
    });
    return this.findOne(id);
  }

  // Método para eliminar un usuario por ID
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
