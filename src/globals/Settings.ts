import type { GlobalConfig } from 'payload'

/** Shares its slug with the `settings` collection. */
export const SettingsGlobal: GlobalConfig = {
  slug: 'settings',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'globalOnly',
      type: 'text',
    },
  ],
}
