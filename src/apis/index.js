import { get, post, put } from '~/utils/httpRequest'
// Board
export const fetchBoardDetailsAPI = async (id) => {
  const res = await get(`boards/${id}`)
  return res.data
}

export const updateBoardDetailsAPI = async (boardId, newCardData) => {
  const res = await put(`boards/${boardId}`, newCardData)
  return res.data
}
// Column
export const CreateNewColumn = async (newColumnData) => {
  const res = await post('columns', newColumnData)
  return res.data
}

// Card
export const CreateNewCard = async (newCardData) => {
  const res = await post('cards', newCardData)
  return res.data
}
export const updateCardInColumn = async (columnId, newColumnData) => {
  const res = await put(`columns/${columnId}`, newColumnData)
  return res.data
}
export const updateCardOutColumn = async (newColumnData) => {
  const res = await put('columns/moving_card', newColumnData)
  return res.data
}
