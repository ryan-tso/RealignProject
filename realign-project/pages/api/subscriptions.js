import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {

  if (req.method === 'POST') {
    console.log(`request body is ${JSON.stringify(req.body)}`)
    try {
      const {email, checkedProducts} = req.body;
      const phone = req.body.phone ?? '';

      const user = await prisma.user.upsert({
        where: {email: email},
        update: {phone: phone},
        create: {email: email, phone: phone},
      })

      let successfullySubscribed = []

      if (user) {
        for (const [productId, checked] of Object.entries(checkedProducts)) {
          if (checked) {
            const subscription = await prisma.subscription.findFirst({
              where: {
                AND: [
                  {productId: parseInt(productId)},
                  {userId: user.id}
                ]
              }
            });
            if (!subscription) {
              const newSubscription = await prisma.subscription.create({
                data: {
                  active: true,
                  status: 'Pending',
                  productId: parseInt(productId),
                  userId: user.id
                }
              })
              successfullySubscribed.push(productId);
            }
          }
        }
        await prisma.$disconnect()
        return res.status(200).json(successfullySubscribed);
      }

    } catch (e) {
      await prisma.$disconnect()
      return res.status(400).json({err: `Error occurred with ${JSON.stringify(e)}`})
    }
  }

  if (req.method === 'GET') {
    try {
      const subscriptions = await prisma.subscription.findMany({
        include: {
          product: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              email: true,
              phone: true
            }
          }
        }
      });

      await prisma.$disconnect()
      return res.status(200).json(subscriptions);   // return value -> [{...subscription, product: {name: string}, user: {email: string, phone: string}}]

    } catch (e) {
      await prisma.$disconnect()
      return res.status(400).json({err: `Error occurred with ${JSON.stringify(e)}`})
    }
  }
}