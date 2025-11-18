import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) { }

    findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    create(data: Partial<User>) {
        const user = this.repo.create(data);
        return this.repo.save(user);
    }

    update(id: string, data: Partial<User>) {
        return this.repo.update(id, data);
    }

    findOne(id: string) {
        return this.repo.findOne({ where: { id } });
    }
}
