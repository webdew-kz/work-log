import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";

export class WorkTypeNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(id ? `Вид работ с ID ${id} не найден` : "Вид работ не найден");
  }
}

export class WorkTypeExistsException extends ConflictException {
  constructor(name: string) {
    super(`Вид работ с названием "${name}" уже существует`);
  }
}

export class WorkTypeInUseException extends BadRequestException {
  constructor() {
    super("Нельзя удалить вид работ, используемый в журнале");
  }
}