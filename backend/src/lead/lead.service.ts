import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadStatus } from '@prisma/client';
import { GetLeadsDto } from './dto/get-leads.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: GetLeadsDto) {
    const { page, limit, q, status, sort, order } = query;

    const safeLimit = Math.min(limit, 50);
    const safePage = Math.max(page, 1);
    const skip = (safePage - 1) * safeLimit;

    const where = {
      ...(q && {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { company: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: sort ? { [sort]: order } : { createdAt: 'desc' },
        include: { comments: true },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getOne(id: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async create(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        status: dto.status ?? (LeadStatus.NEW as LeadStatus),
      },
    });
  }

  async update(id: number, data: UpdateLeadDto) {
    try {
      return await this.prisma.lead.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Lead not found');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.lead.delete({
        where: { id },
      });

      return { message: 'Lead deleted' };
    } catch {
      throw new NotFoundException('Lead not found');
    }
  }
}
