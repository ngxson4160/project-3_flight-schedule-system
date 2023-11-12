import { SetMetadata, applyDecorators } from '@nestjs/common';

export const Permission = (...permissions: string[]) =>
  applyDecorators(SetMetadata('permissions', permissions));
