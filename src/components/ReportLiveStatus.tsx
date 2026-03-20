'use client'

import { useEffect, useRef, useState } from 'react'
import { useDocumentInfo, useForm, useFormFields, useServerFunctions } from '@payloadcms/ui'

const STOP_STATUSES = ['completed', 'failed']
const INTERVAL_MS = 1000

type LogEntry = {
  time: string
  message: string
}

const log = (entries: LogEntry[], message: string): LogEntry[] => [
  { time: new Date().toLocaleTimeString(), message },
  ...entries.slice(0, 9), // keep last 10
]

const ReportLiveStatus = () => {
  const { id, collectionSlug, docPermissions, getDocPreferences } = useDocumentInfo()
  const { getFormState } = useServerFunctions()
  const { dispatchFields } = useForm()
  const initialStatus = useFormFields(([fields]) => fields?.status?.value as string | undefined)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastUpdatedAtRef = useRef<string | null>(null)
  const isRunningRef = useRef(false)

  const alreadyDone = !!initialStatus && STOP_STATUSES.includes(initialStatus)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isStopped, setIsStopped] = useState(alreadyDone)

  useEffect(() => {
    if (!id || !collectionSlug || alreadyDone) return

    const tick = async () => {
      if (isRunningRef.current) return
      isRunningRef.current = true

      try {
        setLogs((prev) => log(prev, 'Checking updatedAt...'))

        const res = await fetch(
          `/api/${collectionSlug}/${id}?depth=0&select[updatedAt]=true&select[status]=true`,
        )
        if (!res.ok) {
          setLogs((prev) => log(prev, `Check failed: ${res.status}`))
          return
        }

        const { updatedAt, status } = (await res.json()) as { updatedAt: string; status: string }

        if (updatedAt === lastUpdatedAtRef.current) {
          setLogs((prev) => log(prev, 'No changes'))
          return
        }

        setLogs((prev) => log(prev, `Change detected! Fetching full doc... (status: ${status})`))
        lastUpdatedAtRef.current = updatedAt

        const fullRes = await fetch(`/api/${collectionSlug}/${id}`)
        if (!fullRes.ok) {
          setLogs((prev) => log(prev, `Full fetch failed: ${fullRes.status}`))
          return
        }
        const freshData = (await fullRes.json()) as Record<string, unknown>

        setLogs((prev) => log(prev, 'Building form state...'))
        const docPreferences = await getDocPreferences()
        const result = await getFormState({
          id,
          collectionSlug,
          data: freshData,
          docPermissions,
          docPreferences,
          operation: 'update',
          renderAllFields: false,
          schemaPath: collectionSlug,
        })

        if (!result?.state) {
          setLogs((prev) => log(prev, 'getFormState returned no state'))
          return
        }

        dispatchFields({ type: 'REPLACE_STATE', state: result.state, optimize: true })
        setLogs((prev) => log(prev, `Form state updated (status: ${status})`))

        if (STOP_STATUSES.includes(status)) {
          clearInterval(intervalRef.current!)
          setIsStopped(true)
          setLogs((prev) => log(prev, `Polling stopped — final status: ${status}`))
        }
      } finally {
        isRunningRef.current = false
      }
    }

    intervalRef.current = setInterval(tick, INTERVAL_MS)

    return () => clearInterval(intervalRef.current!)
  }, [id, collectionSlug])

  if (!id) return null

  return (
    <div
      style={{
        fontFamily: 'monospace',
        fontSize: 11,
        background: '#0f0f0f',
        color: '#a0f0a0',
        border: '1px solid #2a2a2a',
        borderRadius: 4,
        padding: '8px 10px',
        marginBottom: 12,
      }}
    >
      <div style={{ color: '#888', marginBottom: 4 }}>
        {isStopped ? '⏹ polling stopped' : `⟳ polling every ${INTERVAL_MS / 1000}s`}
      </div>
      {logs.map((entry, i) => (
        <div key={i} style={{ color: i === 0 ? '#e0ffe0' : '#555' }}>
          <span style={{ color: '#444' }}>{entry.time} </span>
          {entry.message}
        </div>
      ))}
    </div>
  )
}

export default ReportLiveStatus
