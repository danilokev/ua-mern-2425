import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAccount } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import ConfirmationModal from '../components/ConfirmationModal'

function DeleteAccount() {
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowModal(true)
  }

  const handleDelete = () => {
    setShowModal(false)
    dispatch(deleteAccount(password))
      .unwrap()
      .then(() => {
        toast.success('Cuenta eliminada exitosamente')
        navigate('/login')
      })
      .catch((error) => {
        toast.error(error || 'Error al eliminar la cuenta')
      })
  }

  return (
    <div className="container-account">
      <h1>Eliminar cuenta permanentemente</h1>

      <div className='container-da'>
        <p className="text-danger">
          <strong>¡Advertencia!</strong> Esta acción eliminará todos tus datos y no se puede deshacer.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='texto-pwd'>Contraseña actual:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger btn-2"
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Eliminar cuenta'}
          </button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación de cuenta"
        message="¿Estás seguro de querer eliminar permanentemente tu cuenta y todos tus datos?"
        confirmText="Sí, eliminar cuenta"
      />
    </div>
  )
}

export default DeleteAccount;