/* eslint-disable no-console */
import axios from 'axios'
import { API_ROOT } from './constants'
const request = axios.create({
  baseURL: `${API_ROOT}/v1/`
})

export const get = async (path, option= {}) => {
  try {
    const response = await request.get(path, option)
    return response.data
  } catch (error) {
    console.log(error.status)
  }
}
export const post = async (path, option= {}) => {
  const response = await request.post(path, option)
  return response.data
}
export const put = async (path, option= {}) => {
  const response = await request.put(path, option)
  return response.data
}
export const pull = async (path, option= {}) => {
  const response = await request.pull(path, option)
  return response.data
}