import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import { Button, Typography } from '@mui/material'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'

function Card({ card }) {
  const shouldShowCardAction = () => {
    return !!card.memberIds?.length || !!card.comments?.length || !!card.attachments?.length
  }
  return (
    <MuiCard sx={
      {
        cursor: 'pointer',
        overflow: 'unset',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
      }
    }>
      { card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover} title={card.title}/> }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card.title}</Typography>
      </CardContent>
      {
        shouldShowCardAction() &&
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        {!!card.memberIds?.length && <Button startIcon={<GroupIcon/>} size="small">{card.memberIds.length}</Button> }
        {!!card.comments?.length && <Button startIcon={<CommentIcon/>} size="small">{card.comments.length}</Button> }
        {!!card.attachments?.length && <Button startIcon={<AttachmentIcon/>} size="small">{card.attachments.length}</Button> }
      </CardActions>
      }
    </MuiCard>
  )
}

export default Card