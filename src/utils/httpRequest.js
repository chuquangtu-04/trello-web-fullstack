import authorizedAxiosInstance from './authorizeAxios'
// Method get
export const get = async (path, config = {}) => {
  const response = await authorizedAxiosInstance.get(path, config)
  return response
}

// Method post
export const post = async (path, data = {}, config = {}) => {
  const response = await authorizedAxiosInstance.post(path, data, config)
  return response
}
// Method put
export const put = async (path, data = {}, config = {}) => {
  const response = await authorizedAxiosInstance.put(path, data, config)
  return response
}

// Method patch
export const patch = async (path, data = {}, config = {}) => {
  const response = await authorizedAxiosInstance.patch(path, data, config)
  return response
}

// Method delete
export const deleted = async (path) => {
  const response = await authorizedAxiosInstance.delete(path)
  return response
}