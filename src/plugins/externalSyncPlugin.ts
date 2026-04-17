import type { Field } from 'payload'
import { definePlugin } from 'payload'

export type ExternalSyncPluginOptions = {
  collections: string[]
}

export const externalSyncPlugin = definePlugin<ExternalSyncPluginOptions>({
  slug: 'external-sync',
  order: 100,
  plugin: ({ config, plugins, collections }) => {
    const multiTenantCollections = plugins['multi-tenant']?.options?.collections ?? []

    const updatedCollections = (config.collections ?? []).map((col) => {
      if (!collections.includes(col.slug)) return col

      const extraFields: Field[] = [
        {
          name: 'externalID',
          type: 'text',
          admin: { description: 'ID in the external system' },
        },
      ]

      // If multi-tenant is installed and this collection is tenanted,
      // also add a tenant-scoped external ID
      if (multiTenantCollections.includes(col.slug)) {
        extraFields.push({
          name: 'tenantExternalID',
          type: 'text',
          admin: { description: 'External ID scoped to this tenant' },
        })
      }

      return { ...col, fields: [...col.fields, ...extraFields] }
    })

    return { ...config, collections: updatedCollections }
  },
})

declare module 'payload' {
  interface RegisteredPlugins {
    'external-sync': ExternalSyncPluginOptions
  }
}
