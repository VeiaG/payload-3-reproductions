import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = await MongoMemoryServer.create()
process.env.DATABASE_URI = mongod.getUri()

const { default: config } = await import('@payload-config')
const { getPayload } = await import('payload')

const payload = await getPayload({ config })

const title = `repro-${Date.now()}`

const post = await payload.create({
  collection: 'posts',
  data: { title },
  locale: 'en',
})
payload.logger.info(`created post ${post.id} with localized title "${title}"`)

const found = await payload.find({
  collection: 'posts',
  where: { title: { equals: title } },
})
payload.logger.info(`find -> totalDocs: ${found.totalDocs} (expected 1)`)

const counted = await payload.count({
  collection: 'posts',
  where: { title: { equals: title } },
})
payload.logger.info(`count -> totalDocs: ${counted.totalDocs} (expected 1)`)

const countedWithLocale = await payload.count({
  collection: 'posts',
  where: { title: { equals: title } },
  locale: 'en',
})
payload.logger.info(
  `count with explicit locale -> totalDocs: ${countedWithLocale.totalDocs} (expected 1)`,
)

await mongod.stop()
process.exit(0)
