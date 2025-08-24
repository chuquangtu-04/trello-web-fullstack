import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../BoardBar/BoardBar'
import BoardContent from '../BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)
  const boardId = '68a96c05a922c404019fc790'
  // Call Api
  useEffect(() => {
    ( async () => {
      const result = await fetchBoardDetailsAPI(boardId)
      setBoard(result)
    })()
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  )
}

export default Board
