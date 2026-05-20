import { useEffect, useState } from 'react'
import './SearchBar.css'

const opcionesTipo = [
  { value: '', label: 'Todos' },
  { value: 'movie', label: 'Película' },
  { value: 'series', label: 'Serie' },
  { value: 'episode', label: 'Episodio' },
]

const SearchBar = ({ valorBusqueda, onTermChange, onSearch, onClear, tipoSeleccionado, onTipoChange }) => {
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    const datosGuardados = localStorage.getItem('historialBusqueda')
    if (datosGuardados) {
      try {
        setHistorial(JSON.parse(datosGuardados))
      } catch (error) {
        setHistorial([])
      }
    }
  }, [])

  const guardarHistorial = (termino) => {
    const texto = termino?.trim()
    if (!texto) {
      return
    }

    setHistorial((prevHistorial) => {
      const valoresUnicos = [texto, ...prevHistorial.filter((item) => item !== texto)]
      const nuevoHistorial = valoresUnicos.slice(0, 5)
      localStorage.setItem('historialBusqueda', JSON.stringify(nuevoHistorial))
      return nuevoHistorial
    })
  }

  const ejecutarBusqueda = (termino) => {
    const texto = termino?.trim() || ''
    onSearch?.(texto, tipoSeleccionado)
    if (texto) {
      guardarHistorial(texto)
    }
  }

  const manejarClickHistorial = (termino) => {
    onTermChange?.(termino)
    ejecutarBusqueda(termino)
  }

  return (
    <div className="search-bar-background">
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Busca una película o serie..."
          value={valorBusqueda}
          onChange={(event) => onTermChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              ejecutarBusqueda(valorBusqueda)
            }
          }}
          className="search-bar"
        />
        <div className="search-controls">
          <select
            value={tipoSeleccionado}
            onChange={(event) => onTipoChange(event.target.value)}
            className="search-filter"
          >
            {opcionesTipo.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
          <button type="button" className="search-primary-button" onClick={() => ejecutarBusqueda(valorBusqueda)}>
            Buscar
          </button>
          <button
            type="button"
            className="search-secondary-button"
            onClick={() => {
              onClear?.()
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="search-history-panel">
        <p className="search-history-title">Historial de búsqueda</p>
        <div className="search-history-list">
          {historial.length > 0 ? (
            historial.map((item) => (
              <button key={item} type="button" onClick={() => manejarClickHistorial(item)}>
                {item}
              </button>
            ))
          ) : (
            <p className="search-history-empty">No hay búsquedas recientes.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar