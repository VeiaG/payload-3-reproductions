import type { CollectionConfig } from 'payload'

/**
 * Every label below is a LabelFunction, so it is translated on the server when the
 * client field is created. Plain fields render from the per-language client config,
 * richText and fields with a custom Field component render from the server-side
 * client field schema map, which is cached per collection without the language.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      // @ts-expect-error custom translation key
      label: ({ t }) => t('repro:title'),
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        {
          slug: 'timeline',
          fields: [
            {
              name: 'prefix',
              type: 'richText',
              // @ts-expect-error custom translation key
              label: ({ t }) => t('repro:prefix'),
            },
            {
              name: 'steps',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  // @ts-expect-error custom translation key
                  label: ({ t }) => t('repro:icon'),
                  admin: {
                    components: {
                      Field: '/components/IconField#IconField',
                    },
                  },
                },
                {
                  name: 'stepTitle',
                  type: 'text',
                  // @ts-expect-error custom translation key
                  label: ({ t }) => t('repro:stepTitle'),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
