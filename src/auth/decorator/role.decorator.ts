import { SetMetadata, applyDecorators } from '@nestjs/common';

// export const Permission = (...permissions: string[]) =>
//   applyDecorators(SetMetadata('permissions', permissions));

export const Role = (...role: string[]) =>
  applyDecorators(SetMetadata('role', role));
