import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

import BackToListButton from '@/components/BackToListButton'

import type { Media } from '@/payload-types'

export default async function GridView({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  const { payload } = req

  const { docs } = await payload.find({
    collection: 'media',
    limit: 100,
    overrideAccess: false,
    req,
  })

  return (
    <Gutter>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1>Media Grid</h1>
        <BackToListButton />
      </div>

        {docs.length === 0 && (
          <p style={{ color: 'var(--theme-elevation-450)' }}>No media uploaded yet.</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {(docs as Media[]).filter((doc) => doc.url).map((doc) => (
            <div
              key={doc.id}
              style={{
                background: 'var(--theme-elevation-100)',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={(doc.thumbnailURL ?? doc.url)!}
                alt={doc.alt}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '0.5rem' }}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '0.25rem',
                  }}
                >
                  {doc.filename}
                </p>
                {doc.width && doc.height && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-450)' }}>
                    {doc.width} × {doc.height}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
    </Gutter>
  )
}
