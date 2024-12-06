import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Método para registrar usuarios
  async signUp(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Asignar el rol 'user' si no se proporciona un rol válido
    if (!['user', 'admin'].includes(userData.role)) {
      userData.role = 'user';
    }

    // Crear y guardar el usuario (rol por defecto será 'user')
    const user = this.userRepository.create({ ...userData, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);

    // Retornar el usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // Método para iniciar sesión
  async signIn(email: string, password: string): Promise<{ accessToken: string }> {
    // Buscar al usuario por email, seleccionando los campos necesarios
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    // Validar la contraseña hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    // Generar el token de acceso con el rol del usuario
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { accessToken };
  }
}











