import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Para acceder a variables de entorno
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación faltante o mal formado');
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = this.configService.get<string>('JWT_SECRET'); // Obtener la clave secreta desde .env
      if (!secret) {
        throw new Error('La clave secreta JWT no está configurada');
      }

      // Verificar el token
      const payload = this.jwtService.verify(token, { secret });
      request.user = payload; // Adjuntar información del token al request

      // Validar si el usuario es administrador
      if (payload.role !== 'admin') {
        throw new ForbiddenException('Acceso denegado: Se requiere el rol de administrador');
      }

      return true; // Permitir acceso
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}








