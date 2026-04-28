import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { cloneDeep, isEmpty } from 'lodash'

import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { 
  fetchBoardDetailsSoftColumnAPI, 
  hardDeleteColumnAPI, 
  restoreColumnsAPI, 
  getArchivedCardsAPI, 
  updateCardDetailAPI, 
  deleteCardAPI 
} from '~/apis'

function ArchivedItemsModal({ isOpen, onClose, onBack, anchorEl }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [columnArchive, setColumnArchive] = useState([])
  const [cardArchive, setCardArchive] = useState([])
  const [showCards, setShowCards] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const confirm = useConfirm()

  useEffect(() => {
    if (isOpen && board?._id) {
      fetchBoardDetailsSoftColumnAPI(board._id).then(res => setColumnArchive(res.columns))
      getArchivedCardsAPI(board._id).then(res => setCardArchive(res))
    }
  }, [isOpen, board?._id])

  const handleRestoreColumn = (column) => {
    const oldBoard = JSON.parse(localStorage.getItem('oldBoard'))
    const oldColumnIndex = oldBoard?.columns.findIndex(col => col._id === column._id) || 0

    const newBoard = cloneDeep(board)
    if (isEmpty(column.cardOrderIds)) {
      column.cardOrderIds = [`${column._id}-placeholder-card`]
      column.cards = [{ _id: `${column._id}-placeholder-card`, boardId: board._id, columnId: column._id, FE_placeholderCard: true }]
    }

    newBoard.columns.splice(oldColumnIndex, 0, column)
    dispatch(updateCurrentActiveBoard(newBoard))
    
    restoreColumnsAPI(column._id).then((res) => {
      toast.success(res.message)
      setColumnArchive(prev => prev.filter(c => c._id !== column._id))
    })
  }

  const handleDeleteColumn = (columnId) => {
    confirm({
      title: 'Xóa vĩnh viễn cột?',
      description: 'Hành động này không thể hoàn tác!'
    }).then(() => {
      hardDeleteColumnAPI(columnId).then((res) => {
        toast.success(res.message)
        setColumnArchive(prev => prev.filter(c => c._id !== columnId))
      })
    })
  }

  const handleRestoreCard = async (card) => {
    const restoredCard = await updateCardDetailAPI(card._id, { isArchived: false, archivedAt: null })
    setCardArchive(prev => prev.filter(c => c._id !== card._id))

    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(col => col._id === restoredCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(c => c.FE_placeholderCard)) {
        columnToUpdate.cards = [restoredCard]
        columnToUpdate.cardOrderIds = [restoredCard._id]
      } else {
        columnToUpdate.cards.push(restoredCard)
        columnToUpdate.cardOrderIds.push(restoredCard._id)
      }
      dispatch(updateCurrentActiveBoard(newBoard))
    }
    toast.success('Đã khôi phục thẻ thành công')
  }

  const handleDeleteCard = (cardId) => {
    confirm({
      title: 'Xóa vĩnh viễn thẻ?',
      description: 'Hành động này không thể hoàn tác!'
    }).then(() => {
      deleteCardAPI(cardId).then(() => {
        setCardArchive(prev => prev.filter(c => c._id !== cardId))
        toast.success('Đã xóa thẻ vĩnh viễn')
      })
    })
  }

  const filteredCards = cardArchive.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredColumns = columnArchive.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      sx={{ '& .MuiPopover-paper': { borderRadius: '8px', mt: 1 } }}
    >
      <Box sx={{ p: 2, width: 400, maxHeight: 500, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={onBack} size="small" sx={{ mr: 1 }}>
            <ArrowBackIosIcon sx={{ fontSize: '14px', ml: '5px' }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '16px', flex: 1 }}>Mục đã lưu trữ</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Tìm kiếm lưu trữ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="contained" 
            size="small"
            onClick={() => setShowCards(!showCards)}
            sx={{ minWidth: '100px', textTransform: 'none' }}
          >
            {showCards ? 'Xem Cột' : 'Xem Thẻ'}
          </Button>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
          {showCards ? (
            filteredCards.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Không có thẻ nào</Typography>
              </Box>
            ) : (
              filteredCards.map(card => (
                <Box key={card._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, mb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{card.title}</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton size="small" color="primary" onClick={() => handleRestoreCard(card)} title="Khôi phục"><RestartAltIcon fontSize="small"/></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteCard(card._id)} title="Xóa vĩnh viễn"><DeleteSweepIcon fontSize="small"/></IconButton>
                  </Box>
                </Box>
              ))
            )
          ) : (
            filteredColumns.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Không có cột nào</Typography>
              </Box>
            ) : (
              filteredColumns.map(col => (
                <Box key={col._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, mb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{col.title}</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton size="small" color="primary" onClick={() => handleRestoreColumn(col)} title="Khôi phục"><RestartAltIcon fontSize="small"/></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteColumn(col._id)} title="Xóa vĩnh viễn"><DeleteSweepIcon fontSize="small"/></IconButton>
                  </Box>
                </Box>
              ))
            )
          )}
        </Box>
      </Box>
    </Popover>
  )
}

export default ArchivedItemsModal
