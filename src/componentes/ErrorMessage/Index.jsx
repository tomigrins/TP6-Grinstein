import './ErorrMessage.css'

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message" role="alert">
      <p>{message || 'Ocurrió un error inesperado.'}</p>
    </div>
  )
}

export default ErrorMessage;