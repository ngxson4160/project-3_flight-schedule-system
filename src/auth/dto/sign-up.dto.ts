import { GENDER, ROLE } from "@prisma/client";

export class SignUpDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: GENDER;
  role: ROLE;
}
