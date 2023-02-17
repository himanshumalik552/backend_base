import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity()
export class Status {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column()
    key: string;

    @Column({ nullable: true })
    remarks: string;

    @OneToMany(() => User, e => e.status)
    Users: User[];

}