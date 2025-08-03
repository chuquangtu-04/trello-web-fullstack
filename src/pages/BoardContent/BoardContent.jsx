import Box from '@mui/material/Box'
import ListColumns from './ListColumns/listColumns'
import { mapOrder } from '~/utils/sorts'
function BoardContent({ board }) {
  const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#1976d2' : '#34495e'),
      width: '100%',
      height: (theme) => (theme.trello.boardContentHeight),
      p: '10px 0'
    }}>
      <ListColumns columns={orderedColumn}/>
    </Box>
  )
}

export default BoardContent
