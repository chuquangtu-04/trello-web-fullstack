import Box from '@mui/material/Box'
import Card from './Cards/Card'

function ListCards({ cards }) {
  return (
    <Box sx={
      {
        p: '0 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => (`calc(
                ${theme.trello.boardContentHeight} -
                ${theme.spacing(5)} -
                ${theme.trello.column_header_height} -
                ${theme.trello.column_footer_height}
                )`),
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ced0da',
          borderRadius: '8px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#bfc2cf'
        }
      }
    }>
      {cards.map(card => (<Card card={card} key={card._id}/>))}
    </Box>
  )
}

export default ListCards