import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { useForm, Controller } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { BOARD_TEMPLATES } from '~/data/boardTemplates'
import { createNewBoard, createNewColumnAPI } from '~/apis'
import { toast } from 'react-toastify'

const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

// ─── Form Modal: hiện sau khi chọn template ────────────────────────────────
function TemplateFormModal({ template, onClose, afterCreateNewBoard }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: { type: BOARD_TYPES.PUBLIC }
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    try {
      const newBoardRes = await toast.promise(
        createNewBoard({
          title: data.title,
          description: data.description,
          type: data.type,
          background: template.background
        }),
        { pending: `Creating board from "${template.name}"...` }
      )

      if (newBoardRes?._id) {
        for (const columnTitle of template.columns) {
          await createNewColumnAPI({ title: columnTitle, boardId: newBoardRes._id })
        }
        toast.success(`Board created with ${template.columns.length} columns!`)
        afterCreateNewBoard()
      }
    } catch {
      // handled by axios interceptor
    } finally {
      handleClose()
    }
  }

  return (
    <Modal open={!!template} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '92vw', sm: 520 },
        maxHeight: '92vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '12px',
        outline: 0,
        p: '24px 28px',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
      }}>
        {/* Close */}
        <Box sx={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer' }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleClose} />
        </Box>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography fontSize="1.4rem">{template.icon}</Typography>
          <Typography variant="h6" fontWeight="700">{template.name}</Typography>
          <Chip
            label="Template"
            size="small"
            sx={{
              ml: 0.5, fontSize: '0.72rem',
              backgroundColor: `${template.color}18`,
              color: template.color, fontWeight: 700
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {template.description}
        </Typography>

        {/* Background preview */}
        <Box sx={{
          height: 110, borderRadius: '10px', mb: 2, position: 'relative',
          backgroundImage: `url(${template.background})`,
          backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)'
          }} />
          <Typography sx={{ position: 'absolute', bottom: 10, left: 14, fontSize: '1.6rem' }}>
            {template.icon}
          </Typography>
          <Typography sx={{
            position: 'absolute', bottom: 12, left: 58,
            color: 'white', fontWeight: 700, fontSize: '1rem',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            {template.name}
          </Typography>
        </Box>

        {/* Columns preview banner */}
        <Box sx={{
          background: template.gradient, borderRadius: '8px',
          p: 1.5, mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'
        }}>
          <CheckCircleOutlineIcon sx={{ color: 'white', fontSize: '1rem' }} />
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mr: 0.5 }}>
            Auto-created columns:
          </Typography>
          {template.columns.map((col, idx) => (
            <Box key={col} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={col} size="small"
                sx={{
                  fontSize: '0.72rem', height: 22,
                  bgcolor: 'rgba(255,255,255,0.25)',
                  color: 'white', fontWeight: 700, backdropFilter: 'blur(4px)'
                }}
              />
              {idx < template.columns.length - 1 && (
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>→</Typography>
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                fullWidth autoFocus label="Board Title" type="text" variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><AbcIcon fontSize="small" /></InputAdornment>
                  )
                }}
                {...register('title', {
                  required: FIELD_REQUIRED_MESSAGE,
                  minLength: { value: 3, message: 'Min 3 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' }
                })}
                error={!!errors['title']}
              />
              <FieldErrorAlert errors={errors} fieldName="title" />
            </Box>

            <Box>
              <TextField
                fullWidth label="Description" type="text" variant="outlined" multiline rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><DescriptionOutlinedIcon fontSize="small" /></InputAdornment>
                  )
                }}
                {...register('description', {
                  required: FIELD_REQUIRED_MESSAGE,
                  minLength: { value: 3, message: 'Min 3 characters' },
                  maxLength: { value: 255, message: 'Max 255 characters' }
                })}
                error={!!errors['description']}
              />
              <FieldErrorAlert errors={errors} fieldName="description" />
            </Box>

            <Controller
              name="type" control={control}
              render={({ field }) => (
                <RadioGroup {...field} row onChange={(e, v) => field.onChange(v)} value={field.value}>
                  <FormControlLabel value={BOARD_TYPES.PUBLIC} control={<Radio size="small" />} label="Public" labelPlacement="start" />
                  <FormControlLabel value={BOARD_TYPES.PRIVATE} control={<Radio size="small" />} label="Private" labelPlacement="start" />
                </RadioGroup>
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="interceptor-loading"
                type="submit" variant="contained"
                sx={{ background: template.gradient, '&:hover': { opacity: 0.9, background: template.gradient } }}
              >
                Create Board
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

// ─── TemplatesView: hiển thị inline trong main area ───────────────────────
export function TemplatesView({ afterCreateNewBoard }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const handleAfterCreate = () => {
    setSelectedTemplate(null)
    afterCreateNewBoard()
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Templates</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start fast with a pre-built board. Columns will be created automatically.
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        gap: 2
      }}>
        {BOARD_TEMPLATES.map((template) => (
          <Box
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            sx={{
              borderRadius: '10px',
              border: '1.5px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              '&:hover': {
                borderColor: template.color,
                transform: 'translateY(-3px)',
                boxShadow: `0 6px 20px ${template.color}33`
              }
            }}
          >
            {/* Thumbnail ảnh background + gradient overlay */}
            <Box sx={{
              height: 90,
              position: 'relative',
              backgroundImage: `url(${template.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `${template.gradient.replace('135deg', '180deg')}99`
              }
            }}>
              <Typography sx={{
                position: 'absolute', bottom: 8, left: 10, zIndex: 1,
                fontSize: '1.5rem', lineHeight: 1
              }}>
                {template.icon}
              </Typography>
            </Box>

            {/* Info */}
            <Box sx={{ p: 1.5 }}>
              <Typography fontWeight="700" fontSize="0.9rem" sx={{ mb: 0.5 }}>
                {template.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize="0.78rem" sx={{ mb: 1, lineHeight: 1.4 }}>
                {template.description}
              </Typography>
              {/* Column chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {template.columns.map((col) => (
                  <Chip
                    key={col} label={col} size="small"
                    sx={{
                      fontSize: '0.68rem', height: 20,
                      backgroundColor: `${template.color}18`,
                      color: template.color, fontWeight: 600
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Form modal khi chọn template */}
      {selectedTemplate && (
        <TemplateFormModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          afterCreateNewBoard={handleAfterCreate}
        />
      )}
    </Box>
  )
}

export default TemplatesView
