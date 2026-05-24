import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { ParseCuidPipe } from "../common/parse-uuid.pipe";
import { WorkLogsService } from "./work-logs.service";
import {
  CreateWorkLogDto,
  UpdateWorkLogDto,
  WorkLogListQueryDto,
  WorkLogResponseDto,
  PaginatedWorkLogResponseDto,
} from "./dto";

function mapToResponse(workLog: any): WorkLogResponseDto {
  return {
    id: workLog.id,
    date: workLog.date,
    volume: workLog.volume,
    executor: workLog.executor,
    workTypeId: workLog.workTypeId,
    workType: {
      id: workLog.workType.id,
      name: workLog.workType.name,
    },
    createdAt: workLog.createdAt,
    updatedAt: workLog.updatedAt,
  };
}

@Controller("work-logs")
export class WorkLogsController {
  constructor(private readonly service: WorkLogsService) {}

  @Get()
  async findAll(
    @Query() query: WorkLogListQueryDto,
  ): Promise<WorkLogResponseDto[] | PaginatedWorkLogResponseDto> {
    const page = query.page ? parseInt(query.page, 10) : undefined;
    const limit = query.limit ? parseInt(query.limit, 10) : undefined;

    if (page || limit) {
      const result = await this.service.findAllPaginated({
        search: query.search,
        workTypeId: query.workTypeId,
        executor: query.executor,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        sort: query.sort,
        order: query.order,
        page,
        limit,
      });
      return {
        items: result.items.map(mapToResponse),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    }

    const items = await this.service.findAll({
      search: query.search,
      workTypeId: query.workTypeId,
      executor: query.executor,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      sort: query.sort,
      order: query.order,
    });
    return items.map(mapToResponse);
  }

  @Post()
  async create(@Body() dto: CreateWorkLogDto): Promise<WorkLogResponseDto> {
    const item = await this.service.create(dto);
    return mapToResponse(item);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseCuidPipe) id: string,
    @Body() dto: UpdateWorkLogDto,
  ): Promise<WorkLogResponseDto> {
    const item = await this.service.update(id, dto);
    return mapToResponse(item);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseCuidPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}