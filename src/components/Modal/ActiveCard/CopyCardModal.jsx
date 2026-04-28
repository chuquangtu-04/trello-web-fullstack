import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function CopyCardModal({ isOpen, onClose, anchorEl, card, onCopy }) {
  const board = useSelector(selectCurrentActiveBoard)
  const columns = board?.columns || []

  const [title, setTitle] = useState('')
  const [targetColumnId, setTargetColumnId] = useState('')
  const [targetPosition, setTargetPosition] = useState(0)
  
  const [options, setOptions] = useState({
    copyLabels: true,
    copyMembers: true,
    copyDates: true,
    copyAttachments: true
  })

  useEffect(() => {
    if (card) {
      setTitle(`${card.title} (copy)`)
      setTargetColumnId(card.columnId?.toString() || '')
    }
  }, [card?._id, isOpen])

  const selectedColumn = columns.find(c => c._id === targetColumnId)
  const availableCards = selectedColumn?.cards?.filter(c => !c.FE_placeholderCard) || []
  
  // Khi copy, số lượng vị trí luôn là count + 1
  const positionsCount = availableCards.length + 1
  const positions = Array.from({ length: positionsCount }, (_, i) => i + 1)

  useEffect(() => {
    if (selectedColumn) {
      // Mặc định chọn vị trí ngay sau thẻ hiện tại nếu cùng column, hoặc vị trí cuối nếu khác column
      const currentIdx = availableCards.findIndex(c => c._id === card?._id)
      setTargetPosition(currentIdx !== -1 ? currentIdx + 1 : availableCards.length)
    }
  }, [targetColumnId, card?._id, isOpen, availableCards.length])

  const handleOptionChange = (name) => (event) => {
    setOptions({ ...options, [name]: event.target.checked })
  }

  const handleCopy = () => {
    onCopy({
      title,
      columnId: targetColumnId,
      position: targetPosition,
      options
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
          Sao chép thẻ
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
        <TextField
          label="Tiêu đề"
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: '600' }}>Sao chép bao gồm...</Typography>
          <FormControlLabel
            control={<Checkbox size="small" checked={options.copyLabels} onChange={handleOptionChange('copyLabels')} />}
            label={<Typography variant="body2">Nhãn (Labels)</Typography>}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={options.copyMembers} onChange={handleOptionChange('copyMembers')} />}
            label={<Typography variant="body2">Thành viên (Members)</Typography>}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={options.copyDates} onChange={handleOptionChange('copyDates')} />}
            label={<Typography variant="body2">Ngày (Dates)</Typography>}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={options.copyAttachments} onChange={handleOptionChange('copyAttachments')} />}
            label={<Typography variant="body2">Tệp đính kèm (Attachments)</Typography>}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl fullWidth size="small" sx={{ flex: 2 }}>
            <InputLabel>Danh sách</InputLabel>
            <Select
              value={targetColumnId}
              label="Danh sách"
              onChange={(e) => setTargetColumnId(e.target.value)}
            >
              {columns.map(col => (
                <MenuItem key={col._id} value={col._id}>{col.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ flex: 1 }}>
            <InputLabel>Vị trí</InputLabel>
            <Select
              value={targetPosition}
              label="Vị trí"
              onChange={(e) => setTargetPosition(e.target.value)}
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
          onClick={handleCopy}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          Tạo thẻ mới
        </Button>
      </Box>
    </Popover>
  )
}

export default CopyCardModal
