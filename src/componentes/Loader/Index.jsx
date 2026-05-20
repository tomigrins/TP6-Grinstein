import './Loader.css'

const Loader = ({ text = 'Cargando...' }) => {
  return (
    <div className="loader">
      <div className="spinner" aria-hidden="true"></div>
      <span>{text}</span>
    </div>
  )
}

export default Loader;