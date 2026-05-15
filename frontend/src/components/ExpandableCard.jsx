import { useState } from 'react'

function ExpandableCard({ summary, children }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-2
      overflow-hidden">
      {/* Summary Row */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer
          hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">{summary}</div>
        <button
          className="ml-3 w-7 h-7 rounded-full flex items-center justify-center
            flex-shrink-0 text-white text-lg font-bold transition"
          style={{ backgroundColor: '#0a1f44' }}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}

export default ExpandableCard