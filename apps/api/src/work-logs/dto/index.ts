import { IsString, IsNotEmpty, MinLength, MaxLength, IsDateString, IsOptional, IsNumberString } from "class-validator";

class BaseWorkLogDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  workTypeId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  volume: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  executor: string;
}

export class CreateWorkLogDto extends BaseWorkLogDto {}
export class UpdateWorkLogDto extends BaseWorkLogDto {}

export class WorkLogListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  workTypeId?: string;

  @IsOptional()
  @IsString()
  executor?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: "asc" | "desc";

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class WorkLogResponseDto {
  id: string;
  date: string;
  volume: string;
  executor: string;
  workTypeId: string;
  workType: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class PaginatedWorkLogResponseDto {
  items: WorkLogResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}