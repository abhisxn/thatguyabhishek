'use client'

import { useState } from 'react'

function preview(block) {
  const t = block.type
  const data = block[t]
  if (!data) return ''
  const rt = data.rich_text ?? data.title ?? []
  const text = rt.map((r) => r.plain_text).join('').slice(0, 60)
  if (!text && rt.length === 0) return '(empty)'
  return text || ''
}

function BlockRow({ block, depth = 0, childrenMap }) {
  const children = childrenMap?.[block.id] ?? []
  const [open, setOpen] = useState(false)
  const hasKids = children.length > 0
  const text = preview(block)
  const isEmpty = block.type === 'paragraph' && !block.paragraph?.rich_text?.length

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div
        onClick={() => hasKids && setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'baseline', gap: 8,
          padding: '2px 4px', borderRadius: 4, cursor: hasKids ? 'pointer' : 'default',
          background: isEmpty ? 'rgba(255,200,0,0.15)' : 'transparent',
        }}
      >
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#818cf8', flexShrink: 0 }}>
          {block.type}
        </span>
        {isEmpty && (
          <span style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'monospace' }}>← empty ¶</span>
        )}
        {text && !isEmpty && (
          <span style={{ fontSize: 11, color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text}
          </span>
        )}
        {hasKids && (
          <span style={{ fontSize: 10, color: '#525252', marginLeft: 'auto', flexShrink: 0 }}>
            {open ? '▾' : '▸'} {children.length}
          </span>
        )}
      </div>
      {open && hasKids && children.map((child) => (
        <BlockRow key={child.id} block={child} depth={depth + 1} childrenMap={childrenMap} />
      ))}
    </div>
  )
}

export default function DevBlockMap({ blocks = [], childrenMap = {} }) {
  const [open, setOpen] = useState(false)

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
      fontFamily: 'monospace', fontSize: 12,
    }}>
      {open ? (
        <div style={{
          width: 360, maxHeight: '70vh', display: 'flex', flexDirection: 'column',
          background: '#0a0a0f', border: '1px solid #27272a', borderRadius: 12,
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', borderBottom: '1px solid #27272a', flexShrink: 0,
          }}>
            <span style={{ color: '#fafafa', fontSize: 11, fontWeight: 600 }}>
              Block Map — {blocks.length} top-level
            </span>
            <button onClick={() => setOpen(false)} style={{ color: '#525252', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
          <div style={{ overflowY: 'auto', padding: '6px 8px', flex: 1 }}>
            {blocks.map((b) => (
              <BlockRow key={b.id} block={b} childrenMap={childrenMap} />
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: '#0a0a0f', border: '1px solid #27272a', color: '#818cf8',
            borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 600,
          }}
        >
          Block Map ({blocks.length})
        </button>
      )}
    </div>
  )
}
