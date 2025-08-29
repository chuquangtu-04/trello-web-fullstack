import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../BoardBar/BoardBar'
import BoardContent from '../BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, CreateNewColumn, CreateNewCard } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)
  const boardId = '68b177305ae24b6d3851be0d'
  // Call Api
  useEffect(() => {
    ( async () => {
      const result = await fetchBoardDetailsAPI(boardId)
      result.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)],
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
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
  // Cập nhật state board
  // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
  // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là api tạo Column hay Card đi chăng nữa. => Lúc này FE sẽ nhàn hơn.

  const createNewColumn = async (newColumnData) => {
    const createNewColumn = await CreateNewColumn({
      ...newColumnData,
      boardId: board._id
    })
    createNewColumn.cards = [generatePlaceholderCard(createNewColumn)],
    createNewColumn.cardOrderIds = [generatePlaceholderCard(createNewColumn)._id]
    // Cập nhật lại board
    const newBoard = { ...board }
    newBoard.columns.push(createNewColumn)
    newBoard.columnOrderIds.push(createNewColumn._id)
    setBoard(newBoard)
  }
  // Cập nhật state board
  // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
  // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là api tạo Column hay Card đi chăng nữa. => Lúc này FE sẽ nhàn hơn.

  const createNewCard = async (createNewCard) => {
    const createdNewCard = await CreateNewCard({ ...createNewCard, boardId: board._id })
    const newBoard = { ...board }
    newBoard.columns.forEach(column => {
      if (column._id === createdNewCard.columnId) {
        column.cards.push(createdNewCard)
        column.cardOrderIds.push(createdNewCard._id)
      }
    })
    // const columnToUpdate = newBoard.columns.find(column => column._id === createNewCard.columnId)
    // if (columnToUpdate) {
    //   columnToUpdate.cards.push(createdNewCard)
    //   columnToUpdate.cardOrderIds.push(createNewCard._id)
    // }
    setBoard(newBoard)
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