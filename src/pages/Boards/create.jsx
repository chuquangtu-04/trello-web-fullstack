import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CancelIcon from '@mui/icons-material/Cancel'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CircularProgress from '@mui/material/CircularProgress'
import { createNewBoard, uploadBoardBackgroundAPI } from '~/apis'
import { DEFAULT_BOARD_BACKGROUND, BOARD_BACKGROUNDS } from '~/data/boardBackgrounds'
import { useDispatch } from 'react-redux'
import { setBoardCreationDraft } from '~/redux/activeBoard/activeBoardSlice'

import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

// BOARD_TYPES tương tự bên model phía Back-end (nếu cần dùng nhiều nơi thì hãy đưa ra file constants, không thì cứ để ở đây)
const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

/**
 * Bản chất của cái component SidebarCreateBoardModal này chúng ta sẽ trả về một cái SidebarItem để hiển thị ở màn Board List cho phù hợp giao diện bên đó, đồng thời nó cũng chứa thêm một cái Modal để xử lý riêng form create board nhé.
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function SidebarCreateBoardModal({ afterCreateNewBoard }) {
  const dispatch = useDispatch()
  const { control, register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      type: BOARD_TYPES.PUBLIC,
      background: DEFAULT_BOARD_BACKGROUND
    }
  })

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [bgTab, setBgTab] = useState(0)
  const [isUploadingBackground, setIsUploadingBackground] = useState(false)
  const selectedBackground = watch('background')
  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
    setStep(1)
    setBgTab(0)
    // Reset lại toàn bộ form khi đóng Modal
    reset()
  }

  const handleSelectBackground = (backgroundUrl) => {
    setValue('background', backgroundUrl, { shouldDirty: true })
  }

  const handleRemoveBackground = () => {
    setValue('background', DEFAULT_BOARD_BACKGROUND, { shouldDirty: true })
  }

  const handleUploadBackground = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Only jpg, png, webp files are supported.')
      event.target.value = null
      return
    }
    const localPreviewUrl = URL.createObjectURL(file)
    setValue('background', localPreviewUrl, { shouldDirty: true })
    setIsUploadingBackground(true)
    try {
      const uploadResult = await uploadBoardBackgroundAPI(file)
      if (uploadResult?.url) {
        setValue('background', uploadResult.url, { shouldDirty: true })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setValue('background', DEFAULT_BOARD_BACKGROUND, { shouldDirty: true })
      toast.error(error?.response?.data?.message || 'Upload background failed.')
    } finally {
      URL.revokeObjectURL(localPreviewUrl)
      setIsUploadingBackground(false)
    }
    event.target.value = null
  }

  const submitCreateNewBoard = async (data) => {
    const { title, description, type, background } = data
    dispatch(setBoardCreationDraft({ title, description, type, background }))
    toast.promise(createNewBoard({ title, description, type, background }), {
      pending: 'Creating a new board...'
    })
      .then(res => {
        if (!res.error) afterCreateNewBoard()
      })
      .finally(() => {
        handleCloseModal()
      })
  }

  // <>...</> nhắc lại cho bạn anof chưa biết hoặc quên nhé: nó là React Fragment, dùng để bọc các phần tử lại mà không cần chỉ định DOM Node cụ thể nào cả.
  return (
    <>
      <SidebarItem onClick={handleOpenModal}>
        <LibraryAddIcon fontSize="small" />
        Create a new board
      </SidebarItem>

      <Modal
        open={isOpen}
        // onClose={handleCloseModal} // chỉ sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', sm: 600 },
          maxHeight: '90vh',
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleCloseModal} />
          </Box>
          <Box id="modal-modal-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LibraryAddIcon />
            <Typography variant="h6" component="h2"> Create a new board</Typography>
          </Box>
          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateNewBoard)}>
              <input type="hidden" {...register('background')} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {step === 1 && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Step 1: Choose background
                    </Typography>
                    <Tabs
                      value={bgTab}
                      onChange={(_, nextTab) => setBgTab(nextTab)}
                      variant="fullWidth"
                    >
                      <Tab label="Default Backgrounds" />
                      <Tab label="Upload from Computer" />
                    </Tabs>

                    {bgTab === 0 && (
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 1.5
                      }}>
                        {BOARD_BACKGROUNDS.map(background => {
                          const isSelected = selectedBackground === background.url
                          return (
                            <Box
                              key={background.id}
                              onClick={() => handleSelectBackground(background.url)}
                              sx={{
                                height: 72,
                                borderRadius: 1.5,
                                cursor: 'pointer',
                                border: '2px solid',
                                borderColor: isSelected ? 'primary.main' : 'transparent',
                                backgroundImage: `url(${background.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                          )
                        })}
                      </Box>
                    )}

                    {bgTab === 1 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Button variant="outlined" component="label">
                          Upload image (jpg, png, webp)
                          <input
                            hidden
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleUploadBackground}
                          />
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                          The image is previewed right away, then uploaded to server for board background URL.
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        position: 'relative',
                        height: 120,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundImage: `url(${selectedBackground || DEFAULT_BOARD_BACKGROUND})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {isUploadingBackground && (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0,0,0,0.35)'
                          }}
                        >
                          <CircularProgress size={26} sx={{ color: 'white' }} />
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                      <Button color="error" onClick={handleRemoveBackground}>
                        Remove background
                      </Button>
                      <Button variant="contained" onClick={() => setStep(2)}>
                        Continue
                      </Button>
                    </Box>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Step 2: Board information
                    </Typography>

                    <Box>
                      <TextField
                        fullWidth
                        label="Title"
                        type="text"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AbcIcon fontSize="small" />
                            </InputAdornment>
                          )
                        }}
                        {...register('title', {
                          required: FIELD_REQUIRED_MESSAGE,
                          minLength: { value: 3, message: 'Min Length is 3 characters' },
                          maxLength: { value: 50, message: 'Max Length is 50 characters' }
                        })}
                        error={!!errors['title']}
                      />
                      <FieldErrorAlert errors={errors} fieldName={'title'} />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="Description"
                        type="text"
                        variant="outlined"
                        multiline
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          )
                        }}
                        {...register('description', {
                          required: FIELD_REQUIRED_MESSAGE,
                          minLength: { value: 3, message: 'Min Length is 3 characters' },
                          maxLength: { value: 255, message: 'Max Length is 255 characters' }
                        })}
                        error={!!errors['description']}
                      />
                      <FieldErrorAlert errors={errors} fieldName={'description'} />
                    </Box>

                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          onChange={(event, value) => field.onChange(value)}
                          value={field.value}
                        >
                          <FormControlLabel
                            value={BOARD_TYPES.PUBLIC}
                            control={<Radio size="small" />}
                            label="Public"
                            labelPlacement="start"
                          />
                          <FormControlLabel
                            value={BOARD_TYPES.PRIVATE}
                            control={<Radio size="small" />}
                            label="Private"
                            labelPlacement="start"
                          />
                        </RadioGroup>
                      )}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="outlined" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isUploadingBackground}
                      >
                        Create
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default SidebarCreateBoardModal
