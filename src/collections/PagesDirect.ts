import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero'
import { ContentBlock } from '../blocks/Content'

export const PagesDirect: CollectionConfig = {
  slug: 'pages-direct',
  admin: {
    useAsTitle: 'title',
    preview: (data) => (data.slug ? `/direct/${data.slug}` : ''),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, ContentBlock],
    },
  ],
}
