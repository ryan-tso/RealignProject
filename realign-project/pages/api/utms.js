import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {

  if (req.method === 'POST') {
    try {
      await prisma.utm.create(req.body)
      await prisma.$disconnect()
      return res.status(200).json(req.body);
    } catch (e) {
      await prisma.$disconnect()
      return res.status(400).json({err: `Error occurred with ${JSON.stringify(e)}`})
    }
  }

}