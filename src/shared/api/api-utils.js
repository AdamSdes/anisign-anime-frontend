export const authorize = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    if (response.status !== 200) {
      throw new Error('Ошибка авторизации')
    }
    const result = await response.json()
    return result
  } catch (error) {
    return error
  }
}

export const setJWT = (jwt) => {
  document.cookie = `jwt=${jwt}`
  localStorage.setItem('jwt', jwt)
}

export const getJWT = () => {
  if (document.cookie === '') {
    return localStorage.getItem('jwt')
  }
  const jwt = document.cookie.split(';').find((item) => item.includes('jwt'))
  return jwt ? jwt.split('=')[1] : null
}

export const removeJWT = () => {
  document.cookie = 'jwt=;'
  localStorage.removeItem('jwt')
}

export const getMe = async (url, jwt) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwt}`},
    })
    if (response.status !== 200) {
      throw new Error('Ошибка получения данных')
    }
    const result = await response.json()
    return result
  } catch (error) {
    return error
  }
}
