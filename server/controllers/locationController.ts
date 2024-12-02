import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addLocation = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const location = await prisma.location.create({
            data: {
                latitude,
                longitude,
                userId,
            },
        });
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getLocations = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const locations = await prisma.location.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};