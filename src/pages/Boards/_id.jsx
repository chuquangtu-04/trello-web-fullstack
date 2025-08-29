import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../BoardBar/BoardBar'
import BoardContent from '../BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, CreateNewColumn, CreateNewCard } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)
  const boardId = '68ac27f35c4a26368438d2c5'
  // Call Api
  useEffect(() => {
    ( async () => {
      const result = await fetchBoardDetailsAPI(boardId)
      setBoard(result)
    })()
  }, [])
  //   * Gọi lên props function createNewColumn nằm ở component cha cao nhất (boards/_id.jsx)
  // * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ
  //   đưa dữ liệu Board ra ngoài Redux Global Store,
  // * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những
  //   component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
  // * – Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.

  // Fn này có nhiệm vụ gọi Api tạo mới column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createNewColumn = await CreateNewColumn({
      ...newColumnData,
      boardId: board._id
    })
    // Cập nhật lại board
  }
  const createNewCard = async (createNewCard) => {
    const CreatedNewCard = await CreateNewCard({ ...createNewCard, boardId: board._id })
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        board={board}/>
    </Container>
  )
}

export default Board
