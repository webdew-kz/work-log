import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class CreateWorkTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}

export class UpdateWorkTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}

export class WorkTypeResponseDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}