import axios from 'axios'
import { API_ROOT } from './constants'
const request = axios.create({
  baseURL: `${API_ROOT}/v1/`,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
})

// Method get
export const get = async (path, option= {}) => {
  const response = await request.get(path, option)
  return response
}

// Method post
export const post = async (path, option= {}) => {
  const response = await request.post(path, option)
  return response
}
// Method put
export const put = async (path, option= {}) => {
  const response = await request.put(path, option)
  return response
}

// Method patch
export const patch = async (path, option= {}) => {
  const response = await request.patch(path, option)
  return response
}