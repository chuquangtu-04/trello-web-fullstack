import Box from '@mui/material/Box'
import ListColumns from './ListColumns/listColumns'

function BoardContent() {


  return (
    <Box sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#1976d2' : '#34495e'),
      width: '100%',
      height: (theme) => (theme.trello.boardContentHeight),
      p: '10px 0'
    }}>
      <ListColumns/>
    </Box>
  )
}

export default BoardContent
