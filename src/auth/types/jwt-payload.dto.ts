export type JwtPayload = {
  username: string;
  email: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
