import { get, post, put, patch } from '~/utils/httpRequest'
// Board
export const fetchBoardDetailsAPI = async (id) => {
  const res = await get(`boards/${id}`)
  return res.data
}

export const fetchBoardDetailsSoftColumnAPI = async (id) => {
  const res = await get(`boards/boards-soft-column/${id}`)
  return res.data
}

export const updateBoardDetailsAPI = async (boardId, newCardData) => {
  const res = await put(`boards/${boardId}`, newCardData)
  return res.data
}

// Column
export const createNewColumnAPI = async (newColumnData) => {
  const res = await post('columns', newColumnData)
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
