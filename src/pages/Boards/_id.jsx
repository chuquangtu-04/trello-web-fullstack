import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../BoardBar/BoardBar'
import BoardContent from '../BoardContent/BoardContent'

import { Box, Typography } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateBoardDetailsAPI,
  updateCardInColumnAPI,
  updateCardOutColumnAPI
} from '~/apis'
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useParams } from 'react-router-dom'

function Board() {
  // Không dùng State của component nữa mà chuyển qua dùng State của Redux
  // const [board, setBoard] = useState(null)
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  // Lấy boardId thông qua useParams() trên url
  const { boardId } = useParams()
  useEffect(() => {
    // Call Api
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Cập nhật state board
  // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
  // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là api tạo Column hay Card đi chăng nữa. => Lúc này FE sẽ nhàn hơn.

  // Fn này có nhiệm vụ gọi Api và xử lý khi kéo thả Column xong xuôi
  const moveColumn = async (dndOrderedColumn) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnIds = dndOrderedColumn.map(c => c._id)
    /**
 * Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên
 * làm thay đổi trực tiếp biểu mô rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds
 * bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi :))
 */

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumn
    newBoard.columnOrderIds = dndOrderedColumnIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))


    //Gọi Api update Board
    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnIds })
  }
  // Fn này có nhiệm vụ gọi Api và xử lý khi kéo thả Card trong column xong xuôi
  const moveCardInColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board
    // const newBoard = { ...board }

    // * Cannot assign to read only property 'cards' of object
    // * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only – (nested object – can thiệp sâu dữ liệu)

    const newBoard = cloneDeep(board)

    newBoard.columns.forEach(column => {
      if (column._id === columnId) {
        column.cardOrderIds = dndOrderedCardsIds
        column.cards = dndOrderedCards
      }
    })
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))


    // Gọi Api update CardInColumn
    updateCardInColumnAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  const moveCardOutColumn = (activeColumnId, overColumnId, CardActiveData, CardOverData, activeDraggingCardId) => {
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
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
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))


    const cloneCardActiveData = cloneDeep(CardActiveData)
    // Xử lý vấn đề khi kéo card cuối cùng ra khỏi column, Column rỗng sẽ có placeholder-card cần xóa nó đi
    // trước khi gửi dữ liệu lên cho phía backend
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

    updateCardOutColumnAPI(newColumnData)
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
        moveColumn={moveColumn}
        moveCardInColumn={moveCardInColumn}
        moveCardOutColumn={moveCardOutColumn}
        board={board}/>
    </Container>
  )
}

export default Board