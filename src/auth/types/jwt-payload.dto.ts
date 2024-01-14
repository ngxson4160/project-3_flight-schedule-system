import { ROLE } from '@prisma/client';

export type JwtPayload = {
  username: string;
  email: string;
  role: ROLE;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
