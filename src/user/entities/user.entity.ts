import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../../lookup/entities/status.entity';
import { UserRole } from '../../user-roles/entities/user.role.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column({
        nullable: false,
        unique: true
    })
    email: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ name: "phone_number" })
    phoneNumber: string;

    @Column({ name: "company_name" })
    companyName: string;

    @Column({ name: "hashed_password" })
    @Exclude({ toPlainOnly: true })
    hashedPassword: string;

    @JoinColumn({ name: "status_id" })
    @ManyToOne(() => Status, e => e.Users)
    status: Status;

    @OneToMany(() => UserRole, u => u.user)
    userRoles: UserRole[];

}