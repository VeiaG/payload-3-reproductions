import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero'
import { ContentBlock } from '../blocks/Content'

export const PagesConfigLp: CollectionConfig = {
  slug: 'pages-config-lp',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, admin: { position: 'sidebar' } },
    { name: 'layout', type: 'blocks', blocks: [HeroBlock, ContentBlock] },
  ],
}
