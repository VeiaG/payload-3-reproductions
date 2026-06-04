// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { betterEditor } from 'payload-better-editor'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PagesRefs } from './collections/PagesRefs'
import { PagesDirect } from './collections/PagesDirect'
import { PagesColLp } from './collections/PagesColLp'
import { PagesColP } from './collections/PagesColP'
import { PagesConfigLp } from './collections/PagesConfigLp'
import { HeroBlock } from './blocks/Hero'
import { ContentBlock } from './blocks/Content'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: { email: 'dev@payloadcms.com', password: 'password' },
    livePreview: {
      collections: ['pages-refs', 'pages-direct', 'pages-config-lp'],
      url({ data, collectionConfig }) {
        if (collectionConfig?.slug === 'pages-refs') return data.slug ? `/refs/${data.slug}` : ''
        if (collectionConfig?.slug === 'pages-direct') return data.slug ? `/direct/${data.slug}` : ''
        if (collectionConfig?.slug === 'pages-config-lp') return data.slug ? `/config-lp/${data.slug}` : ''
        return ''
      },
    },
  },
  collections: [Users, Media, PagesRefs, PagesDirect, PagesColLp, PagesColP, PagesConfigLp],
  // global blocks registry — used by blockReferences in PagesRefs
  blocks: [HeroBlock, ContentBlock],
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
    betterEditor({
      collections: ['pages-refs', 'pages-direct', 'pages-col-lp', 'pages-col-p', 'pages-config-lp'],
    }),
    // storage-adapter-placeholder
  ],
})
