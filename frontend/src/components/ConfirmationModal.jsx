import { useEffect } from 'react'

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de querer realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button
            className="btn btn-danger"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-confirmation"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal;