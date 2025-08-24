/* eslint-disable no-console */
import { get } from '~/utils/httpRequest'
export const fetchBoardDetailsAPI = async (id) => {
  const res = await get(`boards/${id}`)
  return res
}