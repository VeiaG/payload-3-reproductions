// Boots an in-memory MongoDB and runs `next dev` against it. Data is gone on exit.
import { spawn } from 'node:child_process'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
const uri = replSet.getUri('payload')

console.log(`[dev:mongo] MongoDB in memory at ${uri}`)

const next = spawn('pnpm', ['next', 'dev', ...process.argv.slice(2)], {
  env: { ...process.env, DATABASE_URI: uri, NODE_OPTIONS: '--no-deprecation' },
  shell: true,
  stdio: 'inherit',
})

const shutdown = async () => {
  next.kill()
  await replSet.stop()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
next.on('exit', async (code) => {
  await replSet.stop()
  process.exit(code ?? 0)
})
