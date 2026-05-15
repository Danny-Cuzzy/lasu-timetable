function ConfirmModal({ isOpen, title, message, confirmText, confirmStyle, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop — blur instead of black */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center
          mx-auto mb-4 ${
          confirmStyle === 'danger' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          {confirmStyle === 'danger' ? (
            <svg className="w-6 h-6 text-red-600" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82
                18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2
                2 0 00-3.42 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-600" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10
                10 0 100 20A10 10 0 0012 2z" />
            </svg>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700
              bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white
              rounded-lg ${
              confirmStyle === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal