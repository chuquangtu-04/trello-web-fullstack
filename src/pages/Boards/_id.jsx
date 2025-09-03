import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../BoardBar/BoardBar'
import BoardContent from '../BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import CircularProgress from '@mui/material/CircularProgress'

// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, CreateNewColumn, CreateNewCard, updateBoardDetailsAPI, updateCardInColumn, updateCardOutColumn } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep, isEmpty } from 'lodash'
import { Box, Typography } from '@mui/material'

function Board() {
  const [board, setBoard] = useState(null)
  const boardId = '68b177305ae24b6d3851be0d'
  // Call Api
  useEffect(() => {
    ( async () => {
      const board = await fetchBoardDetailsAPI(boardId)

      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)],
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
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

  // Fn này có nhiệm vụ gọi Api và xử lý khi kéo thả Column xong xuôi
  const moveColumn = async (dndOrderedColumn) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnIds = dndOrderedColumn.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumn
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    //Gọi Api update Board
    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnIds })
  }
  // Fn này có nhiệm vụ gọi Api và xử lý khi kéo thả Card trong column xong xuôi
  const moveCardInColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    setBoard(newBoard)
    newBoard.columns.forEach(column => {
      if (column._id === columnId) {
        column.cardOrderIds = dndOrderedCardsIds
        column.cards = dndOrderedCards
      }
    })
    setBoard(newBoard)

    // Gọi Api update CardInColumn
    updateCardInColumn(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  const moveCardOutColumn = (activeColumnId, overColumnId, CardActiveData, CardOverData, activeDraggingCardId) => {
    const newBoard = { ...board }
    setBoard(newBoard)
    // Active Card
    newBoard.columns.forEach(column => {
      if (column._id === activeColumnId) {
        column.cardOrderIds = CardActiveData.cardOrderIds
        column.cards = CardActiveData.cards
      }
    })
    // Over Card
    newBoard.columns.forEach(column => {
      if (column._id === overColumnId) {
        column.cardOrderIds = CardOverData.cardOrderIds
        column.cards = CardOverData.cards
      }
    })
    setBoard(newBoard)

    const cloneCardActiveData = cloneDeep(CardActiveData)

    if (cloneCardActiveData.cardOrderIds.includes(`${cloneCardActiveData._id}-placeholder-card`)) {
      cloneCardActiveData.cardOrderIds = []
      cloneCardActiveData.cards = []
    }

    const newColumnData = {
      activeColumnId: activeColumnId,
      overColumnId: overColumnId,
      activeCardId: activeDraggingCardId,
      columnActiveOrderIds: { cardOrderIds: cloneCardActiveData.cardOrderIds },
      columnOverOrderIds: { cardOrderIds: CardOverData.cardOrderIds }
    }

    updateCardOutColumn(newColumnData)
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
        moveCardInColumn={moveCardInColumn}
        moveCardOutColumn={moveCardOutColumn}
        board={board}/>
    </Container>
  )
}

export default Board