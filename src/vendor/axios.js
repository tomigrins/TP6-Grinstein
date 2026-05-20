const buildUrl = (url, params = {}) => {
  const searchParams = new URLSearchParams(params)
  const queryString = searchParams.toString()
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url
}

const get = async (url, config = {}) => {
  const fullUrl = buildUrl(url, config.params)
  const response = await fetch(fullUrl, {
    signal: config.signal,
    headers: config.headers,
  })

  const data = await response.json()
  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: {},
  }
}

const axios = {
  get,
  create: () => axios,
}

export default axios
