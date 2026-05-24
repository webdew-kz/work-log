import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateWorkTypeDto, UpdateWorkTypeDto } from "./dto";
import {
  WorkTypeNotFoundException,
  WorkTypeExistsException,
  WorkTypeInUseException,
} from "../common/exceptions/work-type.exceptions";

@Injectable()
export class WorkTypesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.workType.findMany({ orderBy: { name: "asc" } });
  }

  findById(id: string) {
    return this.prisma.workType.findUnique({ where: { id } });
  }

  findByName(name: string) {
    return this.prisma.workType.findUnique({ where: { name } });
  }

  private async checkUniqueName(name: string, excludeId?: string) {
    const existing = await this.prisma.workType.findFirst({
      where: { name, id: excludeId ? { not: excludeId } : undefined },
    });
    if (existing) {
      throw new WorkTypeExistsException(name);
    }
  }

  async create(dto: CreateWorkTypeDto) {
    await this.checkUniqueName(dto.name);
    return this.prisma.workType.create({ data: dto });
  }

  async update(id: string, dto: UpdateWorkTypeDto) {
    const current = await this.findById(id);
    if (!current) throw new WorkTypeNotFoundException(id);
    await this.checkUniqueName(dto.name, id);
    return this.prisma.workType.update({ where: { id }, data: dto });
  }

  private async hasLogs(id: string) {
    const count = await this.prisma.workLog.count({ where: { workTypeId: id } });
    return count > 0;
  }

  async remove(id: string) {
    const current = await this.findById(id);
    if (!current) throw new WorkTypeNotFoundException(id);
    const hasLogs = await this.hasLogs(id);
    if (hasLogs) {
      throw new WorkTypeInUseException();
    }
    return this.prisma.workType.delete({ where: { id } });
  }
}