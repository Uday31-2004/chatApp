import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    async create(data: Partial<User>): Promise<User> {
        const user = new this.userModel(data);
        return user.save();
    }

    async update(id: string, data: Partial<User>) {
        return this.userModel.findByIdAndUpdate(id, data, { new: true });
    }

    async findOne(id: string): Promise<User | null> {
        return this.userModel.findById(id);
    }
}
