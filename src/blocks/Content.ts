import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content',
  fields: [
    { name: 'body', type: 'textarea', required: true },
  ],
}
