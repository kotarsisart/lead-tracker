import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadModule } from './lead/lead.module';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule, LeadModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, CommentService],
})
export class AppModule {}
