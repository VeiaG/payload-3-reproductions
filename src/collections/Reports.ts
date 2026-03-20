import type { CollectionConfig } from 'payload'

/**

 * Simulate a background job: update the progress with pauses.
 * Do not await in beforeChange — fire and forget.
 */
const simulateJob = async (id: string | number, payload: any) => {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  try {
    await sleep(1500)
    await payload.update({
      collection: 'reports',
      id,
      data: { status: 'processing', progress: 10, 'metadata.startedAt': new Date().toISOString() },
    })

    await sleep(1500)
    await payload.update({ collection: 'reports', id, data: { progress: 25 } })

    await sleep(1500)
    await payload.update({ collection: 'reports', id, data: { progress: 40 } })

    await sleep(1500)
    await payload.update({ collection: 'reports', id, data: { progress: 55 } })

    await sleep(1500)
    await payload.update({ collection: 'reports', id, data: { progress: 70 } })

    await sleep(1500)
    await payload.update({ collection: 'reports', id, data: { progress: 85 } })

    await sleep(1500)
    await payload.update({
      collection: 'reports',
      id,
      data: {
        status: 'completed',
        progress: 100,
        'metadata.completedAt': new Date().toISOString(),
        result: {
          summary: 'Report generated successfully',
          recordsProcessed: Math.floor(Math.random() * 500) + 50,
          errors: [],
        },
      },
    })
  } catch (err) {
    // If something went wrong, set the status to failed
    try {
      await payload.update({
        collection: 'reports',
        id,
        data: {
          status: 'failed',
          result: {
            summary: 'Job failed with error',
            recordsProcessed: 0,
            errors: [{ message: String(err) }],
          },
        },
      })
    } catch (_) {
      // ignore error
    }
  }
}

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        return data
      },
    ],
    afterChange: [
      ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Start the job without await — fire and forget
          simulateJob(doc.id, req.payload)
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {                                                                                                                                                                           
        name: 'liveStatus',                                                                                                                                                       
        type: 'ui',                                                                                                                                                               
        admin: {                                                                                                                                                                  
          components: {                                                                                                                                                           
            Field: '@/components/ReportLiveStatus',                                                                                                                            
          },                                                                                                                                                                      
        },                                                                                                                                                                        
      },  
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'progress',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100,
      admin: {
        position: 'sidebar',
        description: 'Progress in percent (0–100)',
        // Hidden until status is pending
        condition: (data) => data?.status !== 'pending',
      },
    },

    // --- Result (hidden until completed/failed) ---
    {
      name: 'result',
      type: 'group',
      admin: {
        condition: (data) => data?.status === 'completed' || data?.status === 'failed',
      },
      fields: [
        {
          name: 'summary',
          type: 'textarea',
          admin: { readOnly: true },
        },
        {
          name: 'recordsProcessed',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'errors',
          type: 'array',
          admin: {
            // Hidden if there are no errors or status is not failed
            condition: (data) => data?.status === 'failed',
          },
          fields: [
            {
              name: 'message',
              type: 'text',
              admin: { readOnly: true },
            },
          ],
        },
      ],
    },

    // --- Metadata (always visible) ---
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'requestedBy',
          type: 'text',
          defaultValue: 'system',
          admin: { readOnly: true },
        },
        {
          name: 'startedAt',
          type: 'date',
          admin: {
            readOnly: true,
            // Hidden until started
            condition: (data) => data?.status !== 'pending',
            date: { displayFormat: 'dd MMM yyyy, HH:mm:ss' },
          },
        },
        {
          name: 'completedAt',
          type: 'date',
          admin: {
            readOnly: true,
            condition: (data) => data?.status === 'completed' || data?.status === 'failed',
            date: { displayFormat: 'dd MMM yyyy, HH:mm:ss' },
          },
        },
      ],
    },
  ],
}
