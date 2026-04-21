# Payload 3 Reproductions

> \[!IMPORTANT\]
>
> Please make sure that you do not modify the .env.example's DATABASE_URI

This repository uses SQLite and pushes the file `payload.db` to github, with the first user created for `autoLogin` and any initial data necessary for respective branch reproductions.

---

## Bug: Fields with `admin.condition` are silently hidden in bulk edit

**Reproduction collection:** `bulk-edit-condition`

### What happens

When a field has `admin.condition` defined, it appears in the **Edit** dropdown inside the bulk edit drawer — but after selecting it, the field is not rendered. No error or warning is shown. From the user's perspective, bulk edit simply doesn't work for that field.

### Root cause

`EditManyDrawerContent` initializes `DocumentInfoProvider` with `initialData: {}`, so when `getFormState` builds the form state, `siblingData` is always `{}`.

In `iterateFields.ts`, the condition is evaluated as:

```ts
passesCondition = Boolean(
  field.admin.condition(fullData || {}, data || {}, { ... })
)
```

Since `siblingData` is `{}`, any condition that checks sibling field values evaluates to `false` → `passesCondition = false` → the field is not rendered.

`reduceFieldOptions` (which populates the FieldSelect dropdown) does **not** check `admin.condition`, so the field still appears in the dropdown — making the issue invisible until you actually try to use it.

### Workarounds

It is technically possible to work around this for individual fields by explicitly handling the `undefined` case:

**For a required select/type field:**
```ts
// instead of:
condition: (_, siblingData) => siblingData?.type === 'show'

// use:
condition: (_, siblingData) => !siblingData?.type || siblingData?.type === 'show'
```
Works because `type` is always explicitly set in real documents, so `!siblingData?.type` is only ever `true` in the bulk edit context.

**For a boolean/checkbox field:**
```ts
// instead of:
condition: (_, siblingData) => siblingData?.isEnabled === true

// use:
condition: (_, siblingData) => !(siblingData?.isEnabled === false)
```
Works because `!(undefined === false)` → `true` in bulk edit, while still correctly evaluating `false` when `isEnabled` is explicitly unchecked.

These workarounds become increasingly fragile as conditions grow in complexity. A condition combining multiple fields:

```ts
condition: (_, siblingData) =>
  siblingData?.type === 'premium' &&
  siblingData?.isEnabled === true &&
  siblingData?.tier !== 'basic'
```

...requires handling `undefined` for every operand separately, in a way that passes in bulk edit but doesn't break normal form behavior. The result is obscure code that leaks an internal implementation detail (`siblingData = {}` in bulk edit) into application-level field definitions — something developers shouldn't need to know about.

### Expected behavior

`admin.condition` has no meaningful value in bulk edit context — there is no single document, so sibling field values don't exist. Conditions should be skipped entirely when building form state for bulk edit.

The minimal fix would be to pass `skipConditionChecks: true` in both `getFormState` calls inside `EditManyDrawerContent` (`onChange` and `onFieldSelect`). This would require:

1. Exposing `skipConditionChecks` in `BuildFormStateArgs` (`packages/payload/src/admin/forms/Form.ts`)
2. Passing it through `buildFormState` → `iterateFields`
3. Setting it in both `getFormState` calls in `packages/ui/src/elements/EditMany/DrawerContent.tsx`
