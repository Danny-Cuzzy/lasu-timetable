import { useEffect, useState } from 'react'
import axios from 'axios'
import ConfirmModal from '../../components/ConfirmModal'
import ExpandableCard from '../../components/ExpandableCard'
import API from '../../config'

// const API = 'http://localhost:5000/api'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFaculty, setActiveFaculty] = useState('')
  const [activeDept, setActiveDept] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [editId, setEditId] = useState(null)
  const [editEmail, setEditEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState([])
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    confirmStyle: 'danger',
    onConfirm: () => {}
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const openModal = (config) => setModal({ ...config, isOpen: true })
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }))

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/admin/students`, { headers })
      setStudents(res.data)
      if (res.data.length > 0) {
        const firstFaculty = [...new Set(res.data.map(s => s.faculty))].sort()[0]
        setActiveFaculty(firstFaculty)
        const firstDept = [...new Set(
          res.data.filter(s => s.faculty === firstFaculty).map(s => s.department)
        )].sort()[0]
        setActiveDept(firstDept)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const faculties = [...new Set(students.map(s => s.faculty))].sort()
  const departments = [...new Set(
    students.filter(s => s.faculty === activeFaculty).map(s => s.department)
  )].sort()

  const filteredStudents = students.filter(s => {
    const facMatch = activeFaculty ? s.faculty === activeFaculty : true
    const deptMatch = activeDept ? s.department === activeDept : true
    const levelMatch = filterLevel ? s.level.toString() === filterLevel : true
    const searchMatch = searchQuery
        ? s.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    return facMatch && deptMatch && levelMatch && searchMatch
  })

  const handleFacultyClick = (faculty) => {
    setActiveFaculty(faculty)
    setFilterLevel('')
    setSelected([])
    const depts = [...new Set(
      students.filter(s => s.faculty === faculty).map(s => s.department)
    )].sort()
    setActiveDept(depts[0] || '')
  }

  const handleDeptClick = (dept) => {
    setActiveDept(dept)
    setFilterLevel('')
    setSelected([])
  }

  const handleEditSave = async (id) => {
    setSaving(true)
    setMessage('')
    try {
      await axios.patch(`${API}/admin/students/${id}/email`,
        { email: editEmail }, { headers })
      setMessage('Email updated successfully')
      setEditId(null)
      fetchStudents()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (id, name) => {
    openModal({
      title: 'Delete Student',
      message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      confirmText: 'Delete',
      confirmStyle: 'danger',
      onConfirm: async () => {
        closeModal()
        try {
          await axios.delete(`${API}/admin/students/${id}`, { headers })
          setMessage('Student deleted successfully')
          fetchStudents()
        } catch (err) {
          setMessage(err.response?.data?.message || 'Delete failed')
        }
      }
    })
  }

  const confirmBulkDelete = () => {
    openModal({
      title: 'Delete Selected Students',
      message: `Are you sure you want to delete ${selected.length} selected student(s)? This action cannot be undone.`,
      confirmText: `Delete ${selected.length} Student(s)`,
      confirmStyle: 'danger',
      onConfirm: async () => {
        closeModal()
        setDeleting(true)
        try {
          await axios.post(`${API}/admin/students/bulk-delete`,
            { ids: selected }, { headers })
          setMessage(`${selected.length} student(s) deleted`)
          setSelected([])
          fetchStudents()
        } catch (err) {
          setMessage(err.response?.data?.message || 'Bulk delete failed')
        } finally {
          setDeleting(false)
        }
      }
    })
  }

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelected(prev =>
      prev.length === filteredStudents.length
        ? [] : filteredStudents.map(s => s.id)
    )
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-gray-500 text-sm">Loading students...</p>
    </div>
  )

  return (
    <div>
      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        confirmStyle={modal.confirmStyle}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">
            {students.length} total · {filteredStudents.length} shown
          </p>
        </div>
        {selected.length > 0 && (
          <button
            onClick={confirmBulkDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded
              hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : `Delete Selected (${selected.length})`}
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

      {/* Faculty Tabs */}
      <div className="border-b border-gray-200 mb-0">
        <div className="flex gap-0 overflow-x-auto">
          {faculties.map(faculty => (
            <button
              key={faculty}
              onClick={() => handleFacultyClick(faculty)}
              className={`px-4 py-3 text-xs font-medium whitespace-nowrap
                border-b-2 transition ${
                activeFaculty === faculty
                  ? 'border-blue-600 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {faculty.replace('Faculty of ', '').replace('School of ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Department Sub-tabs */}
      <div className="bg-gray-50 border-b border-gray-200 px-2 py-2
        flex gap-2 flex-wrap mb-4">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => handleDeptClick(dept)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md
              transition ${
              activeDept === dept
                ? 'text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
            style={activeDept === dept ? { backgroundColor: '#0a1f44' } : {}}
          >
            {dept}
          </button>
        ))}
      </div>


      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
            <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or matric number..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                bg-white pr-8"
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
      </div>

      {/* Level Filter */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Levels</option>
          {['100', '200', '300', '400', '500'].map(l => (
            <option key={l} value={l}>{l} Level</option>
          ))}
        </select>
        {filterLevel && (
          <button
            onClick={() => setFilterLevel('')}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
        <span className="text-sm text-gray-500 ml-auto">
          {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden lg:block bg-white border border-gray-200
        rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#0a1f44' }}>
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox"
                  checked={selected.length === filteredStudents.length
                    && filteredStudents.length > 0}
                  onChange={toggleSelectAll} className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-white font-medium">#</th>
              <th className="px-4 py-3 text-left text-white font-medium">Matric No.</th>
              <th className="px-4 py-3 text-left text-white font-medium">Name</th>
              <th className="px-4 py-3 text-left text-white font-medium">Level</th>
              <th className="px-4 py-3 text-left text-white font-medium">Email</th>
              <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center
                  text-gray-400 text-sm">No students found</td>
              </tr>
            ) : (
              filteredStudents.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(s.id)}
                      onChange={() => toggleSelect(s.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.matricNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
                      {s.level}L
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {editId === s.id ? (
                      <input type="email" value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="border border-blue-400 rounded px-2 py-1
                          text-sm w-48 focus:outline-none focus:ring-2
                          focus:ring-blue-500" />
                    ) : s.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editId === s.id ? (
                        <>
                          <button onClick={() => handleEditSave(s.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-blue-600 text-white text-xs
                              rounded hover:bg-blue-700 disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700
                              text-xs rounded">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditId(s.id); setEditEmail(s.email) }}
                            className="px-3 py-1 text-xs rounded border
                              border-blue-600 text-blue-600 hover:bg-blue-50">
                            Edit Email
                          </button>
                          <button onClick={() => confirmDelete(s.id, s.name)}
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
        {filteredStudents.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6
            text-center text-gray-400 text-sm">
            No students found
          </div>
        ) : (
          filteredStudents.map((s, i) => (
            <ExpandableCard
              key={s.id}
              summary={
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selected.includes(s.id)}
                    onChange={e => { e.stopPropagation(); toggleSelect(s.id) }}
                    className="rounded flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {s.matricNumber}
                    </p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded text-xs
                    font-semibold flex-shrink-0"
                    style={{ backgroundColor: '#e8f0fe', color: '#0a1f44' }}>
                    {s.level}L
                  </span>
                </div>
              }
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Department
                  </p>
                  <p className="text-sm text-gray-700">{s.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Email
                  </p>
                  {editId === s.id ? (
                    <input type="email" value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full border border-blue-400 rounded px-2 py-1.5
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 break-all">{s.email}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-1 flex-wrap">
                  {editId === s.id ? (
                    <>
                      <button onClick={() => handleEditSave(s.id)}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white text-xs
                          rounded hover:bg-blue-700 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700
                          text-xs rounded">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditId(s.id); setEditEmail(s.email) }}
                        className="px-4 py-2 text-xs rounded border
                          border-blue-600 text-blue-600 hover:bg-blue-50">
                        Edit Email
                      </button>
                      <button onClick={() => confirmDelete(s.id, s.name)}
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

export default Students