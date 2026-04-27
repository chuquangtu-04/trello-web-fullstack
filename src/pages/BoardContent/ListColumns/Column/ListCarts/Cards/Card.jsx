import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import { Button, Typography } from '@mui/material'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateCardDetailAPI } from '~/apis'
import { socketIoInstance } from '~/socketClient'
import LabelBadge from '~/components/Modal/ActiveCard/Labels/LabelBadge'

function Card({ card }) {
  const dispatch = useDispatch()
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const boardLabels = activeBoard?.labels || []
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? '0.5' : undefined,
    border: isDragging ? '1px solid #74b9ff' : undefined
  }

  const shouldShowCardAction = () => {
    return !!card.memberIds?.length || !!card.comments?.length || !!card.attachments?.length
  }

  const setActiveCard = () => {
    // Cập nhật data cho cái activeCard trong redux
    dispatch(updateCurrentActiveCard(card))
    // Hiện modal Active Card
    dispatch(showModalActiveCard())
  }

  const handleToggleComplete = async (e) => {
    e.stopPropagation()
    // Optimistic Update
    const updatedCard = { ...card, completed: !card.completed }
    dispatch(updateCardInBoard(updatedCard))

    // Gọi API update (không dùng await ở đây để UI không bị block)
    updateCardDetailAPI(card._id, { completed: !card.completed }).catch(() => {
      // Handle error (ví dụ revert state nếu cần thiết)
    })

    // Emit Socket để những user khác trong cùng board nhận được data
    socketIoInstance.emit('FE_CARD_COMPLETED_TOGGLED', updatedCard)
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyle}
      {...attributes}
      {...listeners}
      sx={
        {
          cursor: 'pointer',
          overflow: 'unset',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          display: card.FE_placeholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          opacity: card.completed ? 0.75 : 1,
          position: 'relative',
          '&:hover': { borderColor: (theme) => theme.palette.primary.main },
          '&:hover .card-checkbox': { opacity: 1, maxWidth: '32px', mr: 1 }
        }
      }>

      {card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover} title={card.title} />}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 }, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Label badges (compact) */}
        {card?.labelIds?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.25 }}>
            {card.labelIds.map(lid => {
              const label = boardLabels.find(l => l.id === lid)
              return label ? <LabelBadge key={lid} label={label} compact /> : null
            })}
          </Box>
        )}

        {/* Checkbox + Title row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Checkbox ẩn/hiện và đẩy text khi hover */}
        <Box
          className="card-checkbox"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: card.completed ? 1 : 0,
            maxWidth: card.completed ? '32px' : '0px', // Đóng mở chiều rộng để tạo hiệu ứng đẩy
            overflow: 'hidden',
            transition: 'all 0.25s ease-in-out',
            mr: card.completed ? 1 : 0,
            mt: -0.5,
            ml: -0.5
          }}
          onClick={(e) => e.stopPropagation()} // Tránh bấm vào checkbox bị trigger luôn click của thẻ nếu cần
        >
          <Checkbox
            checked={!!card.completed}
            onChange={handleToggleComplete}
            icon={<CheckCircleOutlineIcon />}
            checkedIcon={<CheckCircleIcon color="success" />}
            size="small"
            sx={{ p: 0.5 }}
          />
        </Box>

        <Typography sx={{ textDecoration: card.completed ? 'line-through' : 'none', mt: 0.2, wordBreak: 'break-word', transition: 'all 0.25s ease-in-out' }}>
          {card.title}
        </Typography>
        </Box>
      </CardContent>

      {
        shouldShowCardAction() &&
        <CardActions sx={{ p: '0 4px 8px 4px', display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!!card.memberIds?.length && <Button startIcon={<GroupIcon />} size="small">{card.memberIds.length}</Button>}
            {!!card.comments?.length && <Button startIcon={<CommentIcon />} size="small">{card.comments.length}</Button>}
            {!!card.attachments?.length && <Button startIcon={<AttachmentIcon />} size="small">{card.attachments.length}</Button>}
          </Box>
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card