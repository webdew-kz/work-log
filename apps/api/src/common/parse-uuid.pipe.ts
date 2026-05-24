import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

function isCuid(value: string): boolean {
  return /^c[\w]{24}$/.test(value);
}

@Injectable()
export class ParseCuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isCuid(value)) {
      throw new BadRequestException(`Invalid ID format: ${value}`);
    }
    return value;
  }
}