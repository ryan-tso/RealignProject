import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {

  if (req.method === 'POST') {
    try {
      const urlParams = req.body;

      // Filter url params to only UTMs and truncate to match database fields
      let utms = {}
      for (const [param, value] of Object.entries(urlParams)) {
        if (param.startsWith("utm_")) {
          utms[param.split("_")[1]] = value;
        }
      }

      // Convert utms object into proper json
      utms = JSON.parse(JSON.stringify(utms));

      await prisma.uTM.create({data: utms})

      await prisma.$disconnect()
      return res.status(200).json(utms);

    } catch (e) {
      await prisma.$disconnect()
      return res.status(400).json({err: `Error occurred with ${JSON.stringify(e)}`})
    }
  }

}