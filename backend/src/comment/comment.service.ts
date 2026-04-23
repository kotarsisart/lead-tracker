import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './comment.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LeadService } from 'src/lead/lead.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getByLeadId(leadId: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.comment.findMany({
      where: { leadId },
    });
  }

  async create(leadId: number, dto: CreateCommentDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.comment.create({
      data: {
        leadId,
        text: dto.text,
      },
    });
  }
}
