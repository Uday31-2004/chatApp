import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { ConversationsModule } from './conversations/conversations.module';
// import { MessagesModule } from './messages/messages.module';
// import { ChatModule } from './chat/chat.module';
// import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017', {
      dbName: process.env.DB_NAME || 'chat-app',
    }),

    // Feature Modules
    AuthModule,
    // UsersModule,
    // ConversationsModule,
    // MessagesModule,
    // ChatModule,
    // UploadModule,
  ],
})
export class AppModule { }
