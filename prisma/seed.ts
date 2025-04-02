import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const users = [
  {
    name: 'Hugrún Jónsdóttir',
    email: 'hugrun@fake.is',
    phone: '6901234',
    ssn: '1208998765',
    gender: 'kvk',
    password: 'password123',
    field: 'Computer Science'
  },
  {
    name: 'Jón Bjarni Sigurðsson',
    email: 'jonb@fake.is',
    phone: '6905678',
    ssn: '0101998766',
    gender: 'kk',
    password: 'password123',
    field: 'Software Engineering'
  },
  {
    name: 'Sara Kristín Ólafsdóttir',
    email: 'sarak@fake.is',
    phone: '6954321',
    ssn: '0202991234',
    gender: 'kvk',
    password: 'secret456',
    field: 'Computer Science'
  },
  {
    name: 'Aron Már',
    email: 'aronmar@fake.is',
    phone: '7801234',
    ssn: '1203989988',
    gender: 'kk',
    password: 'pass456',
    field: 'Software Engineering'
  },
  {
    name: 'Elín Björk',
    email: 'elin@fake.is',
    phone: '7700000',
    ssn: '1002004444',
    gender: 'kvk',
    password: '123456',
    field: 'Computer Science'
  },
  {
    name: 'Baldur Þór',
    email: 'baldur@fake.is',
    phone: '6999999',
    ssn: '1011991111',
    gender: 'kk',
    password: 'abcdef',
    field: 'Software Engineering'
  },
  {
    name: 'Ása Rut',
    email: 'asarut@fake.is',
    phone: '7888888',
    ssn: '0505992222',
    gender: 'kvk',
    password: 'secret789',
    field: 'Computer Science'
  },
  {
    name: 'Einar Logi',
    email: 'einar@fake.is',
    phone: '7123456',
    ssn: '1111003333',
    gender: 'kk',
    password: 'secure789',
    field: 'Software Engineering'
  },
  {
    name: 'Kristín Eva',
    email: 'kristineva@fake.is',
    phone: '7800000',
    ssn: '0909985555',
    gender: 'kvk',
    password: 'password321',
    field: 'Computer Science'
  },
  {
    name: 'Sigurður Örn',
    email: 'siggi@fake.is',
    phone: '7654321',
    ssn: '0606991111',
    gender: 'kk',
    password: 'asdfgh',
    field: 'Software Engineering'
  }
]

function getRandomSalary() {
  return {
    amount: Math.floor(Math.random() * 300_000) + 400_000,
    experience: Math.floor(Math.random() * 24),
  }
}

async function main() {
  await prisma.salary.deleteMany()
  await prisma.user.deleteMany()

  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user })

    const salary = getRandomSalary()
    await prisma.salary.create({
      data: {
        ...salary,
        userId: createdUser.id
      }
    })
  }

  console.log(`Seeded ${users.length} users with salary.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
