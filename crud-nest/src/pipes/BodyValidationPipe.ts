import { BadRequestException, ValidationPipe, type ArgumentMetadata } from "@nestjs/common";

export class BodyValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && (value === undefined || value === null)) {
      throw new BadRequestException('Request body is required');
    }
    return super.transform(value, metadata);
  }
}