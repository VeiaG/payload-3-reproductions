import type { CollectionConfig } from 'payload'

/**
 * Reproduces: bulk edit silently hides fields that have admin.condition
 *
 * Root cause: EditMany calls getFormState with initialData: {}, so siblingData is always {}.
 * Any condition that depends on sibling field values evaluates to false → passesCondition = false
 * → field is not rendered, even though it appears in the FieldSelect dropdown.
 *
 * --- Per-field workarounds exist, but they are a leaky abstraction ---
 *
 * For a required select field:
 *   condition: (_, siblingData) => !siblingData?.type || siblingData?.type === 'show'
 *
 * For a boolean field:
 *   condition: (_, siblingData) => !(siblingData?.isEnabled === false)
 *
 * Both work by explicitly handling the undefined case (siblingData = {} in bulk edit).
 * But this forces every developer to be aware of an internal Payload implementation detail
 * and encode it manually into every condition. As conditions grow more complex,
 * the workaround becomes increasingly hard to read and easy to get wrong.
 *
 * --- Correct fix (Payload side) ---
 *
 * Pass skipConditionChecks: true in getFormState calls inside EditManyDrawerContent.
 * Conditions have no meaningful value in bulk edit context (no single document).
 */
export const BulkEditCondition: CollectionConfig = {
  slug: 'bulk-edit-condition',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'isEnabled'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },

    // --- Case 1: required select/type field ---
    // Workaround: check !siblingData?.type as a fallback for the bulk edit context.
    // Safe because `type` is always explicitly set in real documents.
    {
      name: 'type',
      type: 'select',
      defaultValue: 'show',
      options: [
        { label: 'Show', value: 'show' },
        { label: 'Hide', value: 'hide' },
      ],
    },
    {
      name: 'conditionalOnType',
      label: 'Conditional on type (BUG: hidden in bulk edit)',
      type: 'text',
      admin: {
        description: 'Only shown when type = "show". In bulk edit this field is silently hidden.',
        // BUG: siblingData is {} in bulk edit → undefined === 'show' → false
        condition: (_, siblingData) => siblingData?.type === 'show',
      },
    },
    {
      name: 'conditionalOnTypeFixed',
      label: 'Conditional on type (WORKAROUND: works for required select fields)',
      type: 'text',
      admin: {
        description:
          '!siblingData?.type is only true in bulk edit context. In real documents type is always set, so no side effect.',
        // WORKAROUND: safe only because type is always set in real documents
        condition: (_, siblingData) => !siblingData?.type || siblingData?.type === 'show',
      },
    },

    // --- Case 2: boolean/checkbox field ---
    // Workaround: check !(siblingData?.isEnabled === false) instead of siblingData?.isEnabled === true.
    // - bulk edit (undefined): !(undefined === false) → true ✅
    // - isEnabled = true:       !(true === false)      → true ✅
    // - isEnabled = false:      !(false === false)     → false ✅
    //
    // It works, but requires every developer to understand WHY this unusual pattern is needed.
    {
      name: 'isEnabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'conditionalOnBoolean',
      label: 'Conditional on boolean (BUG: hidden in bulk edit)',
      type: 'text',
      admin: {
        description: 'Only shown when isEnabled = true. In bulk edit this field is silently hidden.',
        // BUG: Boolean(undefined) → false
        condition: (_, siblingData) => Boolean(siblingData?.isEnabled),
      },
    },
    {
      name: 'conditionalOnBooleanWorkaround',
      label: 'Conditional on boolean (WORKAROUND: non-obvious, leaky abstraction)',
      type: 'text',
      admin: {
        description:
          'Uses !(isEnabled === false) to handle the undefined case in bulk edit. Works correctly, but only because the developer knows siblingData is {} in bulk edit context.',
        // WORKAROUND: !(undefined === false) → true in bulk edit
        // The logic is correct but the intent is obscured by the implementation detail of bulk edit.
        condition: (_, siblingData) => !(siblingData?.isEnabled === false),
      },
    },
  ],
}
