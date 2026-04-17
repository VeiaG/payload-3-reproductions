'use client'

import { Button } from '@payloadcms/ui'
import React from 'react'

export default function GridViewButton() {
  return (
    <Button el="link" to="/admin/collections/media/grid" buttonStyle="secondary" size="small" margin={false}>
      Grid View
    </Button>
  )
}
