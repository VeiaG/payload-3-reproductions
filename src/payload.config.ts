// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { multiTenantPlugin } from './plugins/multiTenantPlugin'
import { externalSyncPlugin } from './plugins/externalSyncPlugin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: { email: 'dev@payloadcms.com', password: 'password' },
  },
  collections: [
    Users,
    Media,
    {
      slug: 'posts',
      admin: { useAsTitle: 'title' },
      fields: [{ name: 'title', type: 'text', required: true }],
    },
    {
      slug: 'pages',
      admin: { useAsTitle: 'title' },
      fields: [{ name: 'title', type: 'text', required: true }],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
    idType: 'uuid',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder

    // order: 5 — runs first, adds tenants collection + tenant field to posts,
    // and mutates externalSync.options.collections so user doesn't repeat the list
    multiTenantPlugin({ collections: ['posts'] }),

    // order: 100 — runs last, collections list already populated by multiTenantPlugin;
    // detects multi-tenant and adds tenantExternalID alongside externalID on tenanted collections
    // 'pages' is explicitly synced; 'posts' will be added by multiTenantPlugin mutation
    externalSyncPlugin({ collections: ['pages'] }),
  ],
})
