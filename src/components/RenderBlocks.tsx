type HeroBlock = {
  id: string
  blockType: 'hero'
  heading: string
  subheading?: string | null
}

type ContentBlock = {
  id: string
  blockType: 'content'
  body: string
}

type Block = HeroBlock | ContentBlock

export function RenderBlocks({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block) => (
        <div key={block.id} data-better-editor-id={block.id} style={{ marginBottom: '2rem' }}>
          {block.blockType === 'hero' && (
            <div style={{ padding: '3rem 2rem', background: '#f0f4ff', borderRadius: 8 }}>
              <h1 style={{ margin: 0 }}>{block.heading}</h1>
              {block.subheading && (
                <p style={{ margin: '0.5rem 0 0', color: '#555' }}>{block.subheading}</p>
              )}
            </div>
          )}
          {block.blockType === 'content' && (
            <div style={{ padding: '1.5rem 2rem', background: '#fafafa', borderRadius: 8 }}>
              <p style={{ margin: 0 }}>{block.body}</p>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
