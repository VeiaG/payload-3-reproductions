'use client'

import { Button } from '@payloadcms/ui'
import React from 'react'

export default function BackToListButton() {
  return (
    <Button el="link" to="/admin/collections/media" buttonStyle="secondary" size="small">
      ← List View
    </Button>
  )
}
