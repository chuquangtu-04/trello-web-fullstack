import authorizedAxiosInstance from './authorizeAxios'
// Method get
export const get = async (path, option= {}) => {
  const response = await authorizedAxiosInstance.get(path, option)
  return response
}

// Method post
export const post = async (path, option= {}) => {
  const response = await authorizedAxiosInstance.post(path, option)
  return response
}
// Method put
export const put = async (path, option= {}) => {
  const response = await authorizedAxiosInstance.put(path, option)
  return response
}

// Method patch
export const patch = async (path, option= {}) => {
  const response = await authorizedAxiosInstance.patch(path, option)
  return response
}

// Method delete
export const deleted = async (path) => {
  const response = await authorizedAxiosInstance.delete(path)
  return response
}