# Advanced Plugin API — showcase

Two small plugins that demonstrate all three pillars of Payload's new advanced plugin API: `definePlugin`, execution ordering, and cross-plugin communication.

## Plugins

### `multiTenantPlugin` — order 5

Simulates a minimal multi-tenancy setup.

- Adds a `tenants` collection (`name`, `domain`)
- Adds a `tenant` relationship field to every collection listed in `options.collections`
- **Cross-plugin mutation** — before it finishes, it pushes its own `collections` list into `externalSyncPlugin`'s options so the user doesn't have to repeat the same list in both plugins

### `externalSyncPlugin` — order 100

Adds external system IDs to collections.

- Adds an `externalID` field to every collection in `options.collections`
- **Cross-plugin discovery** — reads `plugins['multi-tenant']?.options?.collections` to check which collections are tenanted; for those it also adds a `tenantExternalID` field (an ID scoped to a specific tenant in the external system)

## What each feature looks like in code

| Feature | Where to look |
|---|---|
| `definePlugin` + `slug` + `order` | Top of both plugin files |
| `RegisteredPlugins` augmentation | `declare module 'payload'` block at the bottom of each file |
| Cross-plugin **mutation** (writer→reader) | `multiTenantPlugin.ts` lines 15-18 |
| Cross-plugin **discovery** (typed read) | `externalSyncPlugin.ts` line 12 |
| Side-effect type import to activate augmentation | `multiTenantPlugin.ts` line 4 |

## How it's wired in `payload.config.ts`

```ts
multiTenantPlugin({ collections: ['posts'] }),
// 'pages' is explicitly synced; 'posts' will be added by multiTenantPlugin mutation
externalSyncPlugin({ collections: ['pages'] }),
```

`posts` is not listed in `externalSyncPlugin`'s options, yet it still gets synced. That's the cross-plugin mutation: `multiTenantPlugin` pushes `'posts'` into the array before `externalSyncPlugin` ever runs.

## End result per collection

| Collection | `tenant` | `externalID` | `tenantExternalID` |
|---|---|---|---|
| `posts` | ✅ multiTenantPlugin | ✅ externalSyncPlugin (via mutation) | ✅ externalSyncPlugin (detected multi-tenant) |
| `pages` | — | ✅ externalSyncPlugin (explicit) | — |
