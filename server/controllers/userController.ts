import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const user = await prisma.user.findUnique({
            where: {id},
            select: {id: true, name:true, email: true, createdAt: true}
        });
        if(user){
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

export const createUser = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {name, email, password: hashedPassword},
            select: {id: true, name: true, email: true},
        });
        res.status(201).json(user);
    } catch (error){
        res.status(500).json({message: 'Server error'})
    }
};