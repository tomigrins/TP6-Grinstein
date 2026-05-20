import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import SearchBar from './componentes/SearchBar/Index'
import MovieList from './componentes/MovieList/Index'
import MovieDetail from './componentes/MovieDetail/Index'
import Loader from './componentes/Loader/Index'
import ErrorMessage from './componentes/ErrorMessage/Index'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'thewdb'
const API_URL = 'https://www.omdbapi.com/'
const CONSULTA_POR_DEFECTO = 'a'
const RESULTADOS_POR_PAGINA = 12
const MAXIMO_PELICULAS = 30
function App() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [tipoBusqueda, setTipoBusqueda] = useState('')
  const [peliculas, setPeliculas] = useState([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [favoritos, setFavoritos] = useState([])
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false)
  const [modoOscuro, setModoOscuro] = useState(false)
  const [idPeliculaSeleccionada, setIdPeliculaSeleccionada] = useState(null)
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const [detalleCargando, setDetalleCargando] = useState(false)
  const [detalleError, setDetalleError] = useState('')

  const alternarFavorito = (pelicula) => {
    setFavoritos((prevFavoritos) => {
      const existe = prevFavoritos.some((item) => item.imdbID === pelicula.imdbID)
      const nuevosFavoritos = existe
        ? prevFavoritos.filter((item) => item.imdbID !== pelicula.imdbID)
        : [pelicula, ...prevFavoritos]
      localStorage.setItem('favoritosPeliculas', JSON.stringify(nuevosFavoritos))
      return nuevosFavoritos
    })
  }

  const esFavorito = (imdbID) => favoritos.some((item) => item.imdbID === imdbID)

  const cargarPeliculas = async (termino, tipo, paginaNueva, reiniciar = false) => {
    const terminoConsulta = termino?.trim() || CONSULTA_POR_DEFECTO

    if (reiniciar) {
      setCargando(true)
      setError('')
      setMensaje('')
    } else {
      setCargandoMas(true)
    }

    try {
      const resultadosTotales = []
      let paginaAPI = 1
      let totalResultsAPI = null
      let respuesta = null

      while (resultadosTotales.length < MAXIMO_PELICULAS) {
        const params = {
          apikey: API_KEY,
          s: terminoConsulta,
          page: paginaAPI,
        }
        if (tipo) {
          params.type = tipo
        }

        respuesta = await axios.get(API_URL, { params })

        if (respuesta.data?.Response !== 'True' || !Array.isArray(respuesta.data.Search)) {
          break
        }

        if (totalResultsAPI === null) {
          totalResultsAPI = Number(respuesta.data.totalResults) || 0
        }

        resultadosTotales.push(...respuesta.data.Search)

        if (resultadosTotales.length >= Math.min(totalResultsAPI || MAXIMO_PELICULAS, MAXIMO_PELICULAS)) {
          break
        }

        paginaAPI += 1
        if (paginaAPI > 3) {
          break
        }
      }

      const totalDisponible = Math.min(totalResultsAPI ?? resultadosTotales.length, MAXIMO_PELICULAS)

      if (resultadosTotales.length > 0) {
        const paginasTotales = Math.max(1, Math.ceil(totalDisponible / RESULTADOS_POR_PAGINA))

        setPeliculas(resultadosTotales.slice(0, totalDisponible))
        setTotalPaginas(paginasTotales)
        setCargando(false)
        setMensaje(totalDisponible > 0 ? '' : 'No se encontraron resultados.')
      } else {
        setPeliculas([])
        setTotalPaginas(1)
        const errorRespuesta = respuesta?.data?.Error || 'No se encontraron resultados.'
        setMensaje(errorRespuesta === 'Too many results.' ? '' : errorRespuesta)
      }
    } catch (errorPeticion) {
      if (reiniciar) {
        setError('No se pudo conectar con la API. Intenta nuevamente más tarde.')
        setPeliculas([])
        setTotalPaginas(1)
      }
    } finally {
      if (reiniciar) {
        setCargando(false)
      } else {
        setCargandoMas(false)
      }
    }
  }

  const limpiarBusqueda = () => {
    setTerminoBusqueda('')
    setTipoBusqueda('')
    setPagina(1)
    setPeliculas([])
    setTotalPaginas(1)
    setError('')
    setMensaje('')
    setIdPeliculaSeleccionada(null)
    setPeliculaSeleccionada(null)
    setMostrarFavoritos(false)
  }

  const manejarBusqueda = async (termino, tipo = tipoBusqueda) => {
    const terminoLimpio = termino?.trim() || ''
    setTerminoBusqueda(terminoLimpio)
    setTipoBusqueda(tipo)
    setPagina(1)
    setIdPeliculaSeleccionada(null)
    setPeliculaSeleccionada(null)
    setMostrarFavoritos(false)
    await cargarPeliculas(terminoLimpio, tipo, 1, true)
  }

  useEffect(() => {
    const datosModo = localStorage.getItem('modoOscuro')
    const favoritosGuardados = localStorage.getItem('favoritosPeliculas')

    if (datosModo === '1') {
      setModoOscuro(true)
    }

    if (favoritosGuardados) {
      setFavoritos(JSON.parse(favoritosGuardados))
    }

    const cargarInicial = async () => {
      await cargarPeliculas('', '', 1, true)
    }

    cargarInicial()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modo-oscuro', modoOscuro)
    localStorage.setItem('modoOscuro', modoOscuro ? '1' : '0')
  }, [modoOscuro])

  useEffect(() => {
    if (!idPeliculaSeleccionada) {
      return
    }

    const cargarDetalle = async () => {
      setDetalleCargando(true)
      setDetalleError('')

      try {
        const respuesta = await axios.get(API_URL, {
          params: {
            apikey: API_KEY,
            i: idPeliculaSeleccionada,
            plot: 'full',
          },
          signal: controller.signal,
        })

        if (respuesta.data?.Response === 'True') {
          setPeliculaSeleccionada(respuesta.data)
        } else {
          setPeliculaSeleccionada(null)
          setDetalleError(respuesta.data?.Error || 'No se encontró el detalle del elemento seleccionado.')
        }
      } catch (errorDetalle) {
        if (errorDetalle.name !== 'AbortError') {
          setPeliculaSeleccionada(null)
          setDetalleError('Error al cargar los datos del detalle.')
        }
      } finally {
        setDetalleCargando(false)
      }
    }

    cargarDetalle()
    return () => controller.abort()
  }, [idPeliculaSeleccionada])

  const peliculasPaginadas = peliculas.slice((pagina - 1) * RESULTADOS_POR_PAGINA, pagina * RESULTADOS_POR_PAGINA)
  const peliculasAMostrar = mostrarFavoritos ? favoritos : peliculasPaginadas

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Buscador de películas y series</p>
          <h1>Encuentra tu próxima historia</h1>
          <p className="subtitle">Busca por título y visualiza el detalle de cada resultado.</p>
        </div>
        <button className="dark-toggle" type="button" onClick={() => setModoOscuro((prev) => !prev)}>
          {modoOscuro ? 'Modo oscuro' : 'Modo claro'}
        </button>
      </header>

      <SearchBar
        valorBusqueda={terminoBusqueda}
        onTermChange={(value) => setTerminoBusqueda(value)}
        onSearch={manejarBusqueda}
        onClear={limpiarBusqueda}
        tipoSeleccionado={tipoBusqueda}
        onTipoChange={(value) => setTipoBusqueda(value)}
      />

      <div className="meta-panel">
        <p>Favoritos guardados: {favoritos.length}</p>
        <button type="button" className="secondary-button" onClick={() => setMostrarFavoritos((prev) => !prev)}>
          {mostrarFavoritos ? 'Volver a resultados' : 'Ver favoritos'}
        </button>
      </div>

      {cargando && <Loader text="Buscando resultados..." />}
      {error && <ErrorMessage message={error} />}
      {!cargando && mensaje && <p className="app-message">{mensaje}</p>}

      <section className="content-grid">
        <div className="list-panel">
          <MovieList
            movies={peliculasAMostrar}
            onMovieSelect={(pelicula) => setIdPeliculaSeleccionada(pelicula.imdbID)}
            onToggleFavorito={alternarFavorito}
            esFavorito={esFavorito}
          />
          {!mostrarFavoritos && (
            <div className="pagination-controls">
              <button type="button" disabled={pagina <= 1} onClick={() => setPagina((prev) => Math.max(1, prev - 1))}>
                Anterior
              </button>
              <span>
                Página {pagina} de {totalPaginas}
              </span>
              <button type="button" disabled={pagina >= totalPaginas} onClick={() => setPagina((prev) => Math.min(totalPaginas, prev + 1))}>
                Siguiente
              </button>
            </div>
          )}
          {cargandoMas && !mostrarFavoritos && <Loader text="Cargando página..." />}
          {mostrarFavoritos && favoritos.length === 0 && <p className="app-message">No tienes favoritos guardados.</p>}
        </div>

        <aside className="detail-panel">
          {detalleCargando && <Loader text="Cargando detalle..." />}
          {detalleError && <ErrorMessage message={detalleError} />}
          {peliculaSeleccionada && !detalleCargando && !detalleError && <MovieDetail movie={peliculaSeleccionada} />}
          {!peliculaSeleccionada && !detalleCargando && !detalleError && (
            <div className="detail-empty">
              <p>Selecciona una película o serie para ver el detalle completo.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}

export default App
