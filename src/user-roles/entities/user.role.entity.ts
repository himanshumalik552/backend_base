import { JoinColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../lookup/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'user_roles' })
export class UserRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @JoinColumn({ name: "role_id" })
    @ManyToOne(() => Role, u => u.userRoles)
    role: Role;

    @JoinColumn({ name: "user_id" })
    @ManyToOne(() => User, u => u.userRoles)
    user: User;
}