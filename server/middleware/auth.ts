import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true }
    });

    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.userId = session.user.id;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};