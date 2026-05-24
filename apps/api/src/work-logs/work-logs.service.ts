import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateWorkLogDto, UpdateWorkLogDto } from "./dto";
import { Prisma } from "@prisma/client";
import { WorkLogNotFoundException, InvalidWorkTypeException } from "../common/exceptions/work-log.exceptions";

type SortField = "date" | "volume" | "executor" | "workType" | "createdAt";

interface FindAllParams {
  search?: string;
  workTypeId?: string;
  executor?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class WorkLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(params: FindAllParams): Prisma.WorkLogWhereInput {
    const where: Prisma.WorkLogWhereInput = {};

    if (params.search) {
      where.OR = [
        { volume: { contains: params.search, mode: "insensitive" } },
        { executor: { contains: params.search, mode: "insensitive" } },
        { workType: { name: { contains: params.search, mode: "insensitive" } } },
      ];
    }
    if (params.workTypeId) {
      where.workTypeId = params.workTypeId;
    }
    if (params.executor) {
      where.executor = { contains: params.executor, mode: "insensitive" };
    }
    if (params.dateFrom || params.dateTo) {
      where.date = {};
      if (params.dateFrom && !isNaN(Date.parse(params.dateFrom))) {
        (where.date as Prisma.DateTimeFilter).gte = new Date(params.dateFrom);
      }
      if (params.dateTo && !isNaN(Date.parse(params.dateTo))) {
        (where.date as Prisma.DateTimeFilter).lte = new Date(params.dateTo);
      }
    }

    return where;
  }

  private buildOrderBy(params: FindAllParams): Prisma.WorkLogOrderByWithRelationInput {
    const allowedSort: SortField[] = ["date", "volume", "executor", "workType", "createdAt"];
    const sort: SortField = allowedSort.includes(params.sort as SortField)
      ? (params.sort as SortField)
      : "date";
    const order = params.order === "asc" ? "asc" : "desc";

    if (sort === "workType") {
      return { workType: { name: order } };
    }
    return { [sort]: order };
  }

  async findAllPaginated(params: FindAllParams): Promise<PaginatedResult<any>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 50));
    const skip = (page - 1) * limit;

    const where = this.buildWhere(params);
    const orderBy = this.buildOrderBy(params);

    const [items, total] = await Promise.all([
      this.prisma.workLog.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { workType: true },
      }),
      this.prisma.workLog.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(params: FindAllParams) {
    const where = this.buildWhere(params);
    const orderBy = this.buildOrderBy(params);
    return this.prisma.workLog.findMany({
      where,
      orderBy,
      include: { workType: true },
    });
  }

  async findById(id: string) {
    return this.prisma.workLog.findUnique({ where: { id }, include: { workType: true } });
  }

  private async validateWorkTypeId(workTypeId: string) {
    const exists = await this.prisma.workType.findUnique({ where: { id: workTypeId } });
    if (!exists) {
      throw new InvalidWorkTypeException(workTypeId);
    }
  }

  async create(dto: CreateWorkLogDto) {
    await this.validateWorkTypeId(dto.workTypeId);
    return this.prisma.workLog.create({
      data: {
        date: new Date(dto.date),
        workTypeId: dto.workTypeId,
        volume: dto.volume,
        executor: dto.executor,
      },
      include: { workType: true },
    });
  }

  async update(id: string, dto: UpdateWorkLogDto) {
    const current = await this.findById(id);
    if (!current) throw new WorkLogNotFoundException(id);
    await this.validateWorkTypeId(dto.workTypeId);
    return this.prisma.workLog.update({
      where: { id },
      data: {
        date: new Date(dto.date),
        workTypeId: dto.workTypeId,
        volume: dto.volume,
        executor: dto.executor,
      },
      include: { workType: true },
    });
  }

  async remove(id: string) {
    const current = await this.findById(id);
    if (!current) throw new WorkLogNotFoundException(id);
    return this.prisma.workLog.delete({ where: { id } });
  }
}