import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../user-roles/entities/user.role.entity';

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column()
    key: string;

    @OneToMany(() => UserRole, u => u.role)
    userRoles: UserRole[];
}