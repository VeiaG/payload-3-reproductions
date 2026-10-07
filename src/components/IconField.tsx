'use client'

import type { TextFieldClientComponent } from 'payload'

import { FieldLabel, useField } from '@payloadcms/ui'

export const IconField: TextFieldClientComponent = ({ field, path }) => {
  const { setValue, value } = useField<string>({ path })

  return (
    <div className="field-type text" style={{ marginBottom: 20 }}>
      <FieldLabel label={field.label} path={path} />
      <input
        className="field-type__input"
        onChange={(e) => setValue(e.target.value)}
        placeholder="icon name"
        value={value || ''}
      />
    </div>
  )
}
