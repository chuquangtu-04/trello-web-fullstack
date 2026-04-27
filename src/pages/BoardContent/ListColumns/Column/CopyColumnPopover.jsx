import { useState, useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

function CopyColumnPopover({ anchorEl, isOpen, onClose, columnTitle, onCopy }) {
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (isOpen) {
      setTitle(`${columnTitle} (copy)`)
    }
  }, [isOpen, columnTitle])

  const handleCopy = () => {
    if (!title.trim()) return
    onCopy(title.trim())
  }

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: { width: 300, p: 2, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1, textAlign: 'center', color: 'text.primary' }}>
          Sao chép danh sách
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, color: 'text.primary' }}>
        Tên
      </Typography>
      <TextField
        size="small"
        fullWidth
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" fullWidth onClick={handleCopy} disableElevation>
          Tạo danh sách
        </Button>
      </Box>
    </Popover>
  )
}

export default CopyColumnPopover
