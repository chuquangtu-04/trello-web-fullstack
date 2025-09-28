import { get, post, put, patch, deleted } from '~/utils/httpRequest'
import { toast } from 'react-toastify'
// Board
// Đã move vào redux
// export const fetchBoardDetailsAPI = async (id) => {
//   const res = await get(`boards/${id}`)
//   return res.data
// }
export const createNewBoard = async (data) => {
  const res = await post('/boards/', data)
  toast.success('Create a new board successfully')
  return res.data
}

export const fetchBoardDetailsSoftColumnAPI = async (id) => {
  const res = await get(`boards/boards-soft-column/${id}`)
  return res.data
}

export const updateBoardDetailsAPI = async (boardId, data) => {
  const res = await put(`boards/${boardId}`, data)
  return res.data
}
// lấy ra một list board thuộc về user đang đăng nhập
export const fetchBoardsAPI = async (searchPath) => {
  const res = await get(`boards/${searchPath}`)
  return res.data
}

// Column
export const createNewColumnAPI = async (newColumnData) => {
  const res = await post('columns', newColumnData)
  return res.data
}

export const updateColumnDetailAPI = async (columnId, data) => {
  const res = await put(`columns/${columnId}`, data)
  return res.data
}

// Xóa mềm Column
export const deleteColumnAPI = async (deleteColumnData) => {
  const res = await patch('columns/soft-delete', deleteColumnData)
  return res.data
}
// Khôi phục Column
export const restoreColumnsAPI = async (columnId) => {
  const res = await patch(`columns/restore-columns/${columnId}`, { _destroy: false })
  return res.data
}

// Xóa Vĩnh viễn Column và Card trong Column
export const hardDeleteColumnAPI = async (columnId) => {
  const res = await deleted(`columns/hard-delete/${columnId}`)
  return res.data
}


// Card
export const createNewCardAPI = async (newCardData) => {
  const res = await post('cards', newCardData)
  return res.data
}
export const updateCardInColumnAPI = async (columnId, newColumnData) => {
  const res = await put(`columns/${columnId}`, newColumnData)
  return res.data
}
export const updateCardOutColumnAPI = async (newColumnData) => {
  const res = await put('columns/moving_card', newColumnData)
  return res.data
}
export const updateCardDetailAPI = async (cardId, data) => {
  const res = await put(`cards/${cardId}`, data)
  return res.data
}

/** Users */
export const registerUserAPI = async (data) => {
  const response = await post(
    'users/register',
    data
  )
  toast.success(
    'Account created successfully! Please check and verify your account before logging in!',
    { theme: 'colored' }
  )
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await put(
    'users/verify',
    data
  )
  toast.success(
    'Account verified successfully! Now you can login to enjoy our services! Have a good day!',
    { theme: 'colored' }
  )
  return response.data
}
export const refreshTokenAPI = async () => {
  const response = await get('users/refresh_token')
  return response.data
}


