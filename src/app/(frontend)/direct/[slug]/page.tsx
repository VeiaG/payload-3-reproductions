import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '../../../../components/RenderBlocks'
import { LivePreviewRefresh } from '../../../../components/LivePreviewRefresh'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages-direct',
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const page = docs[0]

  if (!page) {
    return <div style={{ padding: '2rem' }}>Page not found: <code>{slug}</code></div>
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <LivePreviewRefresh />
      <h1 style={{ marginBottom: '2rem' }}>{page.title}</h1>
      <RenderBlocks blocks={(page.layout ?? []) as any} />
    </main>
  )
}
