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
} from "@nestjs/common";
import { ParseCuidPipe } from "../common/parse-uuid.pipe";
import { WorkTypesService } from "./work-types.service";
import { CreateWorkTypeDto, UpdateWorkTypeDto, WorkTypeResponseDto } from "./dto";

function mapToResponse(workType: any): WorkTypeResponseDto {
  return {
    id: workType.id,
    name: workType.name,
    createdAt: workType.createdAt,
    updatedAt: workType.updatedAt,
  };
}

@Controller("work-types")
export class WorkTypesController {
  constructor(private readonly service: WorkTypesService) {}

  @Get()
  async findAll(): Promise<WorkTypeResponseDto[]> {
    const items = await this.service.findAll();
    return items.map(mapToResponse);
  }

  @Post()
  async create(@Body() dto: CreateWorkTypeDto): Promise<WorkTypeResponseDto> {
    const item = await this.service.create(dto);
    return mapToResponse(item);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseCuidPipe) id: string,
    @Body() dto: UpdateWorkTypeDto,
  ): Promise<WorkTypeResponseDto> {
    const item = await this.service.update(id, dto);
    return mapToResponse(item);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", ParseCuidPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}