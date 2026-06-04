import type { CollectionConfig } from 'payload'

export const PagesRefs: CollectionConfig = {
  slug: 'pages-refs',
  admin: {
    useAsTitle: 'title',
    preview: (data) => (data.slug ? `/refs/${data.slug}` : ''),
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
      // empty blocks array + blockReferences — this is the case from the issue
      blocks: [],
      blockReferences: ['hero', 'content'],
    },
  ],
}
