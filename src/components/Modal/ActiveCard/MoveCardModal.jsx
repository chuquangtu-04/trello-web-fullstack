import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { fetchBoardsAPI, updateBoardDetailsAPI } from '~/apis'
import { get } from '~/utils/httpRequest'

function MoveCardModal({ isOpen, onClose, anchorEl, card, onMove }) {
  const currentBoard = useSelector(selectCurrentActiveBoard)
  const [boards, setBoards] = useState([])
  const [targetBoardId, setTargetBoardId] = useState('')
  const [targetColumnId, setTargetColumnId] = useState('')
  const [targetPosition, setTargetPosition] = useState(0)
  const [columns, setColumns] = useState([])
  const [isLoadingBoards, setIsLoadingBoards] = useState(false)
  const [isLoadingColumns, setIsLoadingColumns] = useState(false)

  // 1. Fetch danh sách boards của user
  useEffect(() => {
    if (isOpen) {
      setIsLoadingBoards(true)
      fetchBoardsAPI('?itemsPerPage=100').then(res => {
        setBoards(res.boards || [])
        setIsLoadingBoards(false)
      }).catch(() => setIsLoadingBoards(false))
    }
  }, [isOpen])

  // 2. Khởi tạo giá trị mặc định khi mở modal
  useEffect(() => {
    if (card && currentBoard) {
      setTargetBoardId(currentBoard._id)
      setTargetColumnId(card.columnId?.toString() || '')
      setColumns(currentBoard.columns || [])
    }
  }, [card?._id, currentBoard?._id, isOpen])

  // 3. Khi targetBoardId thay đổi, fetch danh sách column của board đó
  useEffect(() => {
    if (targetBoardId && targetBoardId !== currentBoard?._id) {
      setIsLoadingColumns(true)
      // Gọi trực tiếp API lấy chi tiết board để lấy list columns
      get(`boards/${targetBoardId}`).then(res => {
        setColumns(res.data?.columns || [])
        if (res.data?.columns?.length > 0) {
          setTargetColumnId(res.data.columns[0]._id)
        } else {
          setTargetColumnId('')
        }
        setIsLoadingColumns(false)
      }).catch(() => setIsLoadingColumns(false))
    } else if (targetBoardId === currentBoard?._id) {
      setColumns(currentBoard.columns || [])
      setTargetColumnId(card?.columnId?.toString() || '')
    }
  }, [targetBoardId])

  // 4. Tính toán position khi targetColumnId thay đổi
  const selectedColumn = columns.find(c => c._id === targetColumnId)
  const availableCards = selectedColumn?.cards?.filter(c => !c.FE_placeholderCard) || []
  const isSameColumn = targetBoardId === currentBoard?._id && targetColumnId === card?.columnId?.toString()
  const positionsCount = isSameColumn ? availableCards.length : availableCards.length + 1
  const positions = Array.from({ length: positionsCount }, (_, i) => i + 1)

  useEffect(() => {
    if (selectedColumn) {
      const currentIdx = availableCards.findIndex(c => c._id === card?._id)
      setTargetPosition(currentIdx !== -1 ? currentIdx : availableCards.length)
    }
  }, [targetColumnId, card?._id, availableCards.length])

  const handleMove = () => {
    onMove({
      cardId: card._id,
      boardId: currentBoard._id,
      columnId: card.columnId?.toString(),
      targetBoardId,
      targetColumnId,
      position: targetPosition
    })
    onClose()
  }

  if (!card) return null

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
      sx={{ '& .MuiPopover-paper': { borderRadius: '8px', mt: 1, p: 2, width: 300 } }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center', mb: 1 }}>
          Di chuyển thẻ
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', top: -5, right: -5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Chọn Board */}
        <FormControl fullWidth size="small">
          <InputLabel>Bảng</InputLabel>
          <Select
            value={targetBoardId}
            label="Bảng"
            onChange={(e) => setTargetBoardId(e.target.value)}
            disabled={isLoadingBoards}
          >
            {boards.map(b => (
              <MenuItem key={b._id} value={b._id}>
                {b.title} {b._id === currentBoard?._id ? '(Hiện tại)' : ''}
              </MenuItem>
            ))}
          </Select>
          {isLoadingBoards && <CircularProgress size={20} sx={{ position: 'absolute', right: 30, top: 10 }} />}
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Chọn Danh sách (Column) */}
          <FormControl fullWidth size="small" sx={{ flex: 2 }}>
            <InputLabel>Danh sách</InputLabel>
            <Select
              value={targetColumnId}
              label="Danh sách"
              onChange={(e) => setTargetColumnId(e.target.value)}
              disabled={isLoadingColumns || columns.length === 0}
            >
              {columns.map(col => (
                <MenuItem key={col._id} value={col._id}>{col.title}</MenuItem>
              ))}
            </Select>
            {isLoadingColumns && <CircularProgress size={20} sx={{ position: 'absolute', right: 30, top: 10 }} />}
          </FormControl>

          {/* Chọn Vị trí */}
          <FormControl fullWidth size="small" sx={{ flex: 1 }}>
            <InputLabel>Vị trí</InputLabel>
            <Select
              value={targetPosition}
              label="Vị trí"
              onChange={(e) => setTargetPosition(e.target.value)}
              disabled={isLoadingColumns || !targetColumnId}
            >
              {positions.map(pos => (
                <MenuItem key={pos} value={pos - 1}>{pos}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleMove}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
          disabled={isLoadingColumns || !targetColumnId}
        >
          Di chuyển
        </Button>
      </Box>
    </Popover>
  )
}

export default MoveCardModal
