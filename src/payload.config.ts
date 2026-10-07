// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { SettingsCollection } from './collections/Settings'
import { SettingsGlobal } from './globals/Settings'

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
  collections: [Users, Media, Pages, SettingsCollection],
  globals: [SettingsGlobal],
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, fr },
    translations: {
      en: {
        repro: { icon: 'Icon', prefix: 'Prefix', stepTitle: 'Step title', title: 'Title' },
      },
      fr: {
        repro: { icon: 'Icône', prefix: 'Préfixe', stepTitle: "Titre de l'étape", title: 'Titre' },
      },
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // `pnpm dev` uses SQLite, `pnpm dev:mongo` an in-memory MongoDB
  db: process.env.DATABASE_URI?.startsWith('mongodb')
    ? mongooseAdapter({ url: process.env.DATABASE_URI })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || '',
        },
        idType: 'uuid',
      }),
  onInit: async (payload) => {
    const { totalDocs } = await payload.count({ collection: 'users' })
    if (totalDocs > 0) return
    await payload.create({
      collection: 'users',
      data: { email: 'dev@payloadcms.com', password: 'password' },
    })
    await payload.create({
      collection: 'settings',
      data: { collectionOnly: 'collection value', title: 'Collection doc' },
    })
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
