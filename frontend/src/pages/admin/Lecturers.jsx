import { useEffect, useState } from 'react'
import axios from 'axios'
import ConfirmModal from '../../components/ConfirmModal'
import ExpandableCard from '../../components/ExpandableCard'
import API from '../../config'

// const API = 'http://localhost:5000/api'

function Lecturers() {
  const [lecturers, setLecturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editEmail, setEditEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState([])
  const [deleting, setDeleting] = useState(false)
  const [filterDept, setFilterDept] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [modal, setModal] = useState({
    isOpen: false, title: '', message: '',
    confirmText: '', confirmStyle: 'danger', onConfirm: () => {}
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const openModal = (config) => setModal({ ...config, isOpen: true })
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }))

  const fetchLecturers = async () => {
    try {
      const res = await axios.get(`${API}/admin/lecturers`, { headers })
      setLecturers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLecturers() }, [])

  const handleEditSave = async (id) => {
    setSaving(true)
    setMessage('')
    try {
      await axios.patch(`${API}/admin/lecturers/${id}/email`,
        { email: editEmail }, { headers })
      setMessage('Email updated successfully')
      setEditId(null)
      fetchLecturers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (id, name) => {
    openModal({
      title: 'Delete Lecturer',
      message: `Are you sure you want to delete ${name}? This cannot be undone.`,
      confirmText: 'Delete', confirmStyle: 'danger',
      onConfirm: async () => {
        closeModal()
        try {
          await axios.delete(`${API}/admin/lecturers/${id}`, { headers })
          setMessage('Lecturer deleted')
          fetchLecturers()
        } catch (err) {
          setMessage(err.response?.data?.message || 'Delete failed')
        }
      }
    })
  }

  const confirmBulkDelete = () => {
    openModal({
      title: 'Delete Selected Lecturers',
      message: `Delete ${selected.length} lecturer(s)? This cannot be undone.`,
      confirmText: `Delete ${selected.length}`, confirmStyle: 'danger',
      onConfirm: async () => {
        closeModal()
        setDeleting(true)
        try {
          await axios.post(`${API}/admin/lecturers/bulk-delete`,
            { ids: selected }, { headers })
          setMessage(`${selected.length} lecturer(s) deleted`)
          setSelected([])
          fetchLecturers()
        } catch (err) {
          setMessage(err.response?.data?.message || 'Bulk delete failed')
        } finally {
          setDeleting(false)
        }
      }
    })
  }

  const toggleSelect = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )

  const toggleSelectAll = () => setSelected(prev =>
    prev.length === filteredLecturers.length
      ? [] : filteredLecturers.map(l => l.id)
  )

  const filteredLecturers = lecturers.filter(l => {
    const deptMatch = filterDept ? l.staffId.includes(filterDept) : true
    const searchMatch = searchQuery
        ? l.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    return deptMatch && searchMatch
  })

  const deptCodes = [...new Set(
    lecturers.map(l => l.staffId.split('/')[1])
  )].sort()

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-gray-500 text-sm">Loading lecturers...</p>
    </div>
  )

  return (
    <div>
      <ConfirmModal
        isOpen={modal.isOpen} title={modal.title}
        message={modal.message} confirmText={modal.confirmText}
        confirmStyle={modal.confirmStyle}
        onConfirm={modal.onConfirm} onCancel={closeModal}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lecturers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {lecturers.length} registered
          </p>
        </div>
        {selected.length > 0 && (
          <button onClick={confirmBulkDelete} disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded
              hover:bg-red-700 disabled:opacity-50">
            {deleting ? 'Deleting...' : `Delete (${selected.length})`}
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 px-4 py-3 rounded text-sm bg-blue-50
          border border-blue-200 text-blue-700">
          {message}
        </div>
      )}

      <div className="relative flex-1 max-w-xs">
        <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or staff ID..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            bg-white"
        />
        {searchQuery && (
            <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 text-xs"
            >
                ✕
            </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Departments</option>
          {deptCodes.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {filterDept && (
          <button onClick={() => setFilterDept('')}
            className="text-xs text-gray-500 hover:text-gray-700">
            Clear
          </button>
        )}
        <span className="text-sm text-gray-500">
          {filteredLecturers.length} of {lecturers.length}
        </span>
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden lg:block bg-white border border-gray-200
        rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#0a1f44' }}>
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox"
                  checked={selected.length === filteredLecturers.length
                    && filteredLecturers.length > 0}
                  onChange={toggleSelectAll} className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-white font-medium">#</th>
              <th className="px-4 py-3 text-left text-white font-medium">Staff ID</th>
              <th className="px-4 py-3 text-left text-white font-medium">Name</th>
              <th className="px-4 py-3 text-left text-white font-medium">Dept</th>
              <th className="px-4 py-3 text-left text-white font-medium">Email</th>
              <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLecturers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center
                  text-gray-400 text-sm">
                  No lecturers found
                </td>
              </tr>
            ) : (
              filteredLecturers.map((l, i) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(l.id)}
                      onChange={() => toggleSelect(l.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.staffId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {l.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
                      {l.staffId.split('/')[1]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {editId === l.id ? (
                      <input type="email" value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="border border-blue-400 rounded px-2 py-1
                          text-sm w-48 focus:outline-none focus:ring-2
                          focus:ring-blue-500" />
                    ) : l.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editId === l.id ? (
                        <>
                          <button onClick={() => handleEditSave(l.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-blue-600 text-white text-xs
                              rounded hover:bg-blue-700 disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700
                              text-xs rounded hover:bg-gray-300">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditId(l.id); setEditEmail(l.email) }}
                            className="px-3 py-1 text-xs rounded border
                              border-blue-600 text-blue-600 hover:bg-blue-50">
                            Edit Email
                          </button>
                          <button onClick={() => confirmDelete(l.id, l.name)}
                            className="px-3 py-1 text-xs rounded border
                              border-red-400 text-red-500 hover:bg-red-50">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE EXPANDABLE CARDS ── */}
      <div className="lg:hidden space-y-2">
        {filteredLecturers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6
            text-center text-gray-400 text-sm">
            No lecturers found
          </div>
        ) : (
          filteredLecturers.map((l, i) => (
            <ExpandableCard
              key={l.id}
              summary={
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selected.includes(l.id)}
                    onChange={e => { e.stopPropagation(); toggleSelect(l.id) }}
                    className="rounded flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {l.name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{l.staffId}</p>
                  </div>
                </div>
              }
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Department
                  </p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
                    {l.staffId.split('/')[1]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Email
                  </p>
                  {editId === l.id ? (
                    <input type="email" value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full border border-blue-400 rounded px-2 py-1.5
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 break-all">{l.email}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-1 flex-wrap">
                  {editId === l.id ? (
                    <>
                      <button onClick={() => handleEditSave(l.id)}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white text-xs
                          rounded hover:bg-blue-700 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700
                          text-xs rounded hover:bg-gray-300">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditId(l.id); setEditEmail(l.email) }}
                        className="px-4 py-2 text-xs rounded border
                          border-blue-600 text-blue-600 hover:bg-blue-50">
                        Edit Email
                      </button>
                      <button onClick={() => confirmDelete(l.id, l.name)}
                        className="px-4 py-2 text-xs rounded border
                          border-red-400 text-red-500 hover:bg-red-50">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </ExpandableCard>
          ))
        )}
      </div>
    </div>
  )
}

export default Lecturers