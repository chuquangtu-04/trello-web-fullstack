import { get, post } from '~/utils/httpRequest'
// Board
export const fetchBoardDetailsAPI = async (id) => {
  const res = await get(`boards/${id}`)
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