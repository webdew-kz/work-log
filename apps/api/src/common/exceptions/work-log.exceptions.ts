import { BadRequestException, NotFoundException } from "@nestjs/common";

export class WorkLogNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(id ? `Запись с ID ${id} не найдена` : "Запись не найдена");
  }
}

export class InvalidWorkTypeException extends BadRequestException {
  constructor(id: string) {
    super(`Вид работ с ID ${id} не существует`);
  }
}