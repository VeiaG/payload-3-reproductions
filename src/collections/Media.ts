import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
  admin: {
    components: {
      beforeListTable: ['@/components/GridViewButton#default'],
      views: {
        grid: {
          Component: '@/components/GridView#default',
          path: '/grid',
        },
      },
    },
  },
}
