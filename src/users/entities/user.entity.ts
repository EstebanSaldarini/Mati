import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';  // Asegúrate de que esta ruta sea correcta
import { IsIn } from 'class-validator'; // Importar class-validator para validación

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 50, unique: true })
    email: string;

    @Column({ length: 100 }) // Aumentamos la longitud para permitir hashes seguros
    password: string;

    @Column('text', { nullable: true })
    address: string;

    @Column('int', { nullable: true })
    phone: number;

    @Column({ length: 50, nullable: true })
    country?: string;

    @Column({ length: 50, nullable: true })
    city?: string;

    @Column({ type: 'varchar', length: 20, default: 'user' })
    @IsIn(['user', 'admin'], {
        message: 'El rol debe ser uno de los siguientes valores: user, admin',
    })
    role: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}

