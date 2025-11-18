import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: '' })
    username: string;

    @Column({ nullable: true })
    avatarUrl: string; // For chat profile image

    @Column({ default: false })
    isOnline: boolean;
}
