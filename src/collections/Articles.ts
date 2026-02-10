import { CollectionConfig, TextFieldSingleValidation } from 'payload'

const testValidate: TextFieldSingleValidation = (value) => {
  if ((value?.length || 0) < 5) {
    return 'Title must be at least 5 characters long. Looooooooooooooooong loooooooooooooooooooooooooooooooooooooong'
  }
  return true
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      validate: testValidate,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'tooltip',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: '@/components/index.tsx',
          },
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
