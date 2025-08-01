import Box from '@mui/material/Box'
function BoardContent() {
  return (
    <Box sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#1976d2' : '#34495e'),
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
        Board Content
    </Box>
  )
}

export default BoardContent
