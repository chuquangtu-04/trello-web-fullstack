import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ArchiveIcon from '@mui/icons-material/Archive'
import SettingsIcon from '@mui/icons-material/Settings'
import HistoryIcon from '@mui/icons-material/History'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

function BoardMenuModal({ isOpen, onClose, onOpenArchived, anchorEl }) {
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
      <Box sx={{ p: 2, width: 300 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Board Menu</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <Button
          fullWidth
          startIcon={<ArchiveIcon />}
          endIcon={<ChevronRightIcon sx={{ ml: 'auto' }} />}
          onClick={onOpenArchived}
          sx={{ 
            justifyContent: 'flex-start', 
            py: 1.2, 
            color: 'text.primary', 
            textTransform: 'none',
            '&:hover': { bgcolor: 'action.hover' } 
          }}
        >
          Mục đã lưu trữ
        </Button>

        <Button
          fullWidth
          startIcon={<SettingsIcon />}
          sx={{ 
            justifyContent: 'flex-start', 
            py: 1.2, 
            color: 'text.primary', 
            textTransform: 'none',
            '&:hover': { bgcolor: 'action.hover' } 
          }}
          disabled
        >
          Cài đặt (Sắp có)
        </Button>

        <Button
          fullWidth
          startIcon={<HistoryIcon />}
          sx={{ 
            justifyContent: 'flex-start', 
            py: 1.2, 
            color: 'text.primary', 
            textTransform: 'none',
            '&:hover': { bgcolor: 'action.hover' } 
          }}
          disabled
        >
          Hoạt động (Sắp có)
        </Button>
      </Box>
    </Popover>
  )
}

export default BoardMenuModal
