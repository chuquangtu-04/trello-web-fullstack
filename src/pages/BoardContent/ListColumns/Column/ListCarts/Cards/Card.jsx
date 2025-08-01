import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import { Button, Typography } from '@mui/material'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'

function Card() {
  return (
    <MuiCard sx={
      {
        cursor: 'pointer',
        overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
      }
    }>
      <CardMedia
        sx={{ height: 140 }}
        image="https://images.pexels.com/photos/1670413/pexels-photo-1670413.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>Chu Quang Tú Dev</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button startIcon={<GroupIcon/>} size="small">20</Button>
        <Button startIcon={<CommentIcon/>} size="small">16</Button>
        <Button startIcon={<AttachmentIcon/>} size="small">7</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card