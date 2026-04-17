import type { CollectionConfig, CollectionSlug, Field } from 'payload'
import { definePlugin } from 'payload'
// side-effect type import — activates 'external-sync' RegisteredPlugins augmentation
import type {} from './externalSyncPlugin'

export type MultiTenantPluginOptions = {
  collections: string[]
}

export const multiTenantPlugin = definePlugin<MultiTenantPluginOptions>({
  slug: 'multi-tenant',
  order: 5,
  plugin: ({ config, plugins, collections }) => {
    // Cross-plugin mutation: push our collections into externalSync before it runs
    const externalSync = plugins['external-sync']
    if (externalSync?.options) {
      externalSync.options.collections.push(...collections)
    }

    const tenantsCollection: CollectionConfig = {
      slug: 'tenants',
      admin: { useAsTitle: 'name' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'domain', type: 'text' },
      ],
    }

    const tenantField: Field = {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants' as CollectionSlug,
      required: true,
    }

    const updatedCollections = (config.collections ?? []).map((col) => {
      if (!collections.includes(col.slug)) return col
      return { ...col, fields: [...col.fields, tenantField] }
    })

    return {
      ...config,
      collections: [...updatedCollections, tenantsCollection],
    }
  },
})

declare module 'payload' {
  interface RegisteredPlugins {
    'multi-tenant': MultiTenantPluginOptions
  }
}
