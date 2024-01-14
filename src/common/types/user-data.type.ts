import { ROLE } from '@prisma/client';

export class UserDataType {
  id: number;
  email: string;
  role: ROLE;
}
