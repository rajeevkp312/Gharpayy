import { useEffect, useMemo, useState } from 'react'

import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'

export default function Messages({ openSidebar }) {
  const [threads, setThreads] = useState([])
  const [leads, setLeads] = useState([])
  const [selectedThreadId, setSelectedThreadId] = useState('')
  const [messages, setMessages] = useState([])

  const [leadSelectId, setLeadSelectId] = useState('')
  const [loadingThreads, setLoadingThreads] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const selectedThread = useMemo(
    () => threads.find((t) => t._id === selectedThreadId) || null,
    [threads, selectedThreadId],
  )

  async function loadThreads() {
    const res = await axiosClient.get('/api/messages/threads')
    setThreads(res.data || [])
  }

  async function loadLeads() {
    const res = await axiosClient.get('/api/leads')
    setLeads(res.data || [])
  }

  async function loadMessages(threadId) {
    if (!threadId) return
    const res = await axiosClient.get(`/api/messages/threads/${threadId}/messages`)
    setMessages(res.data || [])
  }

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        setLoadingThreads(true)
        setError('')
        await Promise.all([loadThreads(), loadLeads()])
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message)
      } finally {
        if (mounted) setLoadingThreads(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function run() {
      if (!selectedThreadId) {
        setMessages([])
        return
      }

      try {
        setLoadingMessages(true)
        setError('')
        await loadMessages(selectedThreadId)
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message)
      } finally {
        if (mounted) setLoadingMessages(false)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [selectedThreadId])

  async function onCreateThread() {
    if (!leadSelectId) return

    try {
      setError('')
      const res = await axiosClient.post('/api/messages/threads', {
        leadId: leadSelectId,
      })

      await loadThreads()
      setSelectedThreadId(res.data?._id || '')
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  async function onSend() {
    if (!selectedThreadId || !text.trim()) return

    try {
      setSending(true)
      setError('')
      const res = await axiosClient.post(
        `/api/messages/threads/${selectedThreadId}/messages`,
        { text: text.trim(), senderType: 'agent' },
      )

      setMessages((prev) => [...prev, res.data])
      setText('')
      await loadThreads()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <Topbar title="Messages" subtitle="Lead-wise communication threads" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="border-b border-black/10 p-4">
                <div className="text-sm font-semibold">Inbox</div>
                <div className="mt-3 flex gap-2">
                  <select
                    value={leadSelectId}
                    onChange={(e) => setLeadSelectId(e.target.value)}
                    className="h-10 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none"
                  >
                    <option value="">Start a thread…</option>
                    {leads.map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="gold"
                    size="md"
                    onClick={onCreateThread}
                    disabled={!leadSelectId}
                  >
                    Start
                  </Button>
                </div>
              </div>

              <div className="max-h-[68vh] overflow-y-auto p-2">
                {loadingThreads ? (
                  <div className="p-3 text-sm text-black/60">Loading…</div>
                ) : threads.length ? (
                  <div className="space-y-1">
                    {threads.map((t) => {
                      const active = t._id === selectedThreadId
                      return (
                        <button
                          type="button"
                          key={t._id}
                          onClick={() => setSelectedThreadId(t._id)}
                          className={`w-full rounded-xl px-3 py-3 text-left transition ${
                            active
                              ? 'bg-black/[0.04]'
                              : 'hover:bg-black/[0.02]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-black/80">
                                {t.lead?.name || 'Lead'}
                              </div>
                              <div className="mt-1 truncate text-xs text-black/50">
                                {t.lastMessage?.text || 'No messages yet'}
                              </div>
                            </div>
                            <div className="text-xs text-black/40">
                              {t.lastMessageAt
                                ? new Date(t.lastMessageAt).toLocaleDateString()
                                : ''}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-3 text-sm text-black/60">
                    No threads yet. Start one from a lead.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="flex h-[78vh] flex-col rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="border-b border-black/10 p-4">
                <div className="text-sm font-semibold">
                  {selectedThread?.lead?.name || 'Select a conversation'}
                </div>
                <div className="mt-1 text-xs text-black/50">
                  {selectedThread?.lead?.phone || ''}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="text-sm text-black/60">Loading messages…</div>
                ) : selectedThreadId ? (
                  <div className="space-y-3">
                    {messages.map((m) => {
                      const mine = m.senderType === 'agent'
                      return (
                        <div
                          key={m._id}
                          className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                              mine
                                ? 'bg-[rgb(var(--gh-accent))] text-white'
                                : 'border border-black/10 bg-white text-black/80'
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {m.text}
                            </div>
                            <div
                              className={`mt-1 text-[10px] ${
                                mine ? 'text-white/70' : 'text-black/40'
                              }`}
                            >
                              {m.timestamp
                                ? new Date(m.timestamp).toLocaleString()
                                : ''}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-black/60">
                    Choose a thread from the inbox to start.
                  </div>
                )}
              </div>

              <div className="border-t border-black/10 p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={
                      selectedThreadId
                        ? 'Type a message…'
                        : 'Select a conversation first…'
                    }
                    disabled={!selectedThreadId || sending}
                    className="min-h-[44px] max-h-28 flex-1 resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none disabled:bg-black/[0.02]"
                  />
                  <Button
                    variant="gold"
                    size="md"
                    disabled={!selectedThreadId || sending || !text.trim()}
                    onClick={onSend}
                  >
                    {sending ? 'Sending…' : 'Send'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
