import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

interface TokenPayload {
  userId: string;
}

export function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
}

