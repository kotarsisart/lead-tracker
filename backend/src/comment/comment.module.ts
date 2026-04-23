import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { LeadService } from 'src/lead/lead.service';
import { LeadModule } from 'src/lead/lead.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [LeadModule, PrismaModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
