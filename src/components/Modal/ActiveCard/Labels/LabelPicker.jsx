import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import { LABEL_COLORS } from '~/utils/constants'
import { toast } from 'react-toastify'

const VIEW = { LIST: 'list', CREATE: 'create', EDIT: 'edit' }

// ============================================================
// CreateLabelForm – tạo hoặc edit label
// ============================================================
function CreateLabelForm({ boardLabels, editingLabel, onSave, onBack }) {
  const [name, setName] = useState(editingLabel?.name || '')
  const [selectedColor, setSelectedColor] = useState(editingLabel?.color || LABEL_COLORS[0].id)

  const handleSubmit = () => {
    // Validate: không trùng tên + màu (khi tạo mới)
    if (!editingLabel) {
      const dup = boardLabels.find(l => l.name === name.trim() && l.color === selectedColor)
      if (dup) {
        toast.error('Label with the same name and color already exists!')
        return
      }
    }
    onSave({ name: name.trim(), color: selectedColor })
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <IconButton size="small" onClick={onBack} sx={{ mr: 0.5 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>
          {editingLabel ? 'Edit label' : 'Create label'}
        </Typography>
      </Box>

      {/* Preview */}
      <Box
        sx={{
          width: '100%',
          height: '32px',
          borderRadius: '4px',
          bgcolor: LABEL_COLORS.find(c => c.id === selectedColor)?.value || selectedColor,
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          transition: 'background-color 0.2s'
        }}
      >
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '12px' }}>
          {name || ''}
        </Typography>
      </Box>

      {/* Name input */}
      <TextField
        label="Title"
        value={name}
        onChange={e => setName(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1.5 }}
        placeholder="Label name (optional)"
      />

      {/* Color picker */}
      <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
        Select a color
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
        {LABEL_COLORS.map(c => (
          <Tooltip key={c.id} title={c.name} arrow>
            <Box
              onClick={() => setSelectedColor(c.id)}
              sx={{
                width: 32,
                height: 24,
                borderRadius: '3px',
                bgcolor: c.value,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: selectedColor === c.id ? '2px solid #000' : '2px solid transparent',
                transition: 'border 0.15s, transform 0.15s',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              {selectedColor === c.id && <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />}
            </Box>
          </Tooltip>
        ))}
      </Box>

      <Button variant="contained" size="small" fullWidth onClick={handleSubmit} disableElevation>
        {editingLabel ? 'Save' : 'Create'}
      </Button>
    </Box>
  )
}

// ============================================================
// LabelPicker – dropdown chọn / bỏ chọn / tạo / edit / xóa label
// ============================================================
function LabelPicker({ anchorEl, isOpen, onClose, boardLabels, cardLabelIds, onToggle, onCreateLabel, onUpdateLabel, onDeleteLabel }) {
  const [view, setView] = useState(VIEW.LIST)
  const [editingLabel, setEditingLabel] = useState(null)
  const [search, setSearch] = useState('')

  const filteredLabels = useMemo(() => {
    if (!search.trim()) return boardLabels
    return (boardLabels || []).filter(l => l.name?.toLowerCase().includes(search.toLowerCase()))
  }, [boardLabels, search])

  const handleSave = (data) => {
    if (view === VIEW.CREATE) {
      onCreateLabel(data)
    } else if (view === VIEW.EDIT && editingLabel) {
      onUpdateLabel(editingLabel.id, data)
    }
    setView(VIEW.LIST)
    setEditingLabel(null)
  }

  const handleEdit = (e, label) => {
    e.stopPropagation()
    setEditingLabel(label)
    setView(VIEW.EDIT)
  }

  const handleDelete = (e, label) => {
    e.stopPropagation()
    if (window.confirm(`Delete label "${label.name || label.color}"? It will be removed from all cards.`)) {
      onDeleteLabel(label.id)
    }
  }

  const handleClose = () => {
    setView(VIEW.LIST)
    setEditingLabel(null)
    setSearch('')
    onClose()
  }

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: { width: 260, p: 1.5, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>
          Labels
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {view === VIEW.LIST && (
        <>
          {/* Search */}
          <TextField
            size="small"
            fullWidth
            placeholder="Search labels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mb: 1 }}
          />

          {/* Label list */}
          <Box sx={{ maxHeight: 220, overflowY: 'auto', mb: 1 }}>
            {filteredLabels.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                No labels found
              </Typography>
            )}
            {filteredLabels.map(label => {
              const colorDef = LABEL_COLORS.find(c => c.id === label.color || c.value === label.color)
              const bgColor = colorDef ? colorDef.value : label.color
              const isChecked = (cardLabelIds || []).includes(label.id)
              return (
                <Box
                  key={label.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 0.5,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    onChange={() => onToggle(label.id)}
                    sx={{ p: 0.5 }}
                  />
                  <Box
                    onClick={() => onToggle(label.id)}
                    sx={{
                      flex: 1,
                      height: 28,
                      borderRadius: '3px',
                      bgcolor: bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      cursor: 'pointer',
                      transition: 'filter 0.15s',
                      '&:hover': { filter: 'brightness(1.1)' }
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                      {label.name || ''}
                    </Typography>
                  </Box>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={e => handleEdit(e, label)}>
                      <EditOutlinedIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={e => handleDelete(e, label)} color="error">
                      <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            })}
          </Box>

          <Divider sx={{ mb: 1 }} />
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => { setEditingLabel(null); setView(VIEW.CREATE) }}
          >
            + Create a new label
          </Button>
        </>
      )}

      {(view === VIEW.CREATE || view === VIEW.EDIT) && (
        <CreateLabelForm
          boardLabels={boardLabels}
          editingLabel={editingLabel}
          onSave={handleSave}
          onBack={() => { setView(VIEW.LIST); setEditingLabel(null) }}
        />
      )}
    </Popover>
  )
}

export default LabelPicker
