import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero'
import { ContentBlock } from '../blocks/Content'

export const PagesColP: CollectionConfig = {
  slug: 'pages-col-p',
  admin: {
    useAsTitle: 'title',
    preview: (data) => (data.slug ? `/col-p/${data.slug}` : ''),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, admin: { position: 'sidebar' } },
    { name: 'layout', type: 'blocks', blocks: [HeroBlock, ContentBlock] },
  ],
}
