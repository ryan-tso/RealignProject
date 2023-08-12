import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {

  if (req.method === 'POST') {
    try {
      const {email, checkedProducts} = req.body;
      const phone = req.body.phone ?? '';

      const user = await prisma.user.findUnique({
        where: {email: email}
      })

      console.log(`user is ${JSON.stringify(user)}`);

      if (!user) {
        console.log('creating user...')
        const createdUser = await prisma.user.create({data:{email: email, phone: phone}});
        console.log(`created user ${JSON.stringify(createdUser)}`);
      }

      let successfullySubscribed = []

      for (const [productId, checked] of Object.entries(checkedProducts)) {
        const subscription = await prisma.subscription.findFirst({
          where: {
            AND: [
              {productId: productId},
              {userId: user.id}
            ]
          }
        });

        if (checked && !subscription) {
          const newSubscription = await prisma.subscription.create({
            active: true,
            status: 'Pending',
            productId: productId,
            userId: user.id
          })
          successfullySubscribed.push(productId);
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

      // return value -> [{...subscription, product: {name: string}, user: {email: string}}]

      return res.status(200).json(subscriptions);

    } catch (e) {
      return res.status(400).json({err: `Error occurred with ${JSON.stringify(e)}`})
    }
  }
}