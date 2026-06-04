import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/Hero'
import { ContentBlock } from '../blocks/Content'

export const PagesColLp: CollectionConfig = {
  slug: 'pages-col-lp',
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => (data.slug ? `/col-lp/${data.slug}` : ''),
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, admin: { position: 'sidebar' } },
    { name: 'layout', type: 'blocks', blocks: [HeroBlock, ContentBlock] },
  ],
}
