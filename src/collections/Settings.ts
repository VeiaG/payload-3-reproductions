import type { CollectionConfig } from 'payload'

/** Shares its slug with the `settings` global — nothing in config validation prevents that. */
export const SettingsCollection: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'collectionOnly',
      type: 'text',
    },
  ],
}
