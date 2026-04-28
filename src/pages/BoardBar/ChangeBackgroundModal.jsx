import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Grid from '@mui/material/Unstable_Grid2'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateBoardDetailsAPI, uploadBoardBackgroundAPI } from '~/apis'
import { toast } from 'react-toastify'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'

const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=60'
]

const MOCK_COLORS = [
  '#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91',
  'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
  'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
  'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'
]

function ChangeBackgroundModal({ isOpen, onClose, onBack, anchorEl, board }) {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleUpdateBackground = (value) => {
    // Cập nhật ngay lập tức cho mượt (Real-time FE)
    const updatedBoard = { ...board, background: value }
    dispatch(updateCurrentActiveBoard(updatedBoard))

    // Gọi API cập nhật DB
    updateBoardDetailsAPI(board._id, { background: value })
      .catch(() => {
        toast.error('Không thể cập nhật hình nền')
        // Revert nếu lỗi (Optional)
        dispatch(updateCurrentActiveBoard(board))
      })
  }

  const handleUploadImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // B1: Hiển thị preview ngay lập tức (Real-time FE)
    const previewUrl = URL.createObjectURL(file)
    const boardClone = { ...board, background: previewUrl }
    dispatch(updateCurrentActiveBoard(boardClone))

    // B2: Gọi API upload lên server (Cloudinary) thông qua endpoint upload dùng chung
    toast.promise(
      uploadBoardBackgroundAPI(file),
      {
        pending: 'Đang tải ảnh lên...',
        success: 'Tải ảnh lên thành công!',
        error: 'Tải ảnh thất bại!'
      }
    ).then(res => {
      // B3: Sau khi upload thành công (res.url), cập nhật URL chính thức vào DB board
      handleUpdateBackground(res.url)
    }).catch(() => {
      // Revert về ảnh cũ nếu upload lỗi
      dispatch(updateCurrentActiveBoard(board))
    }).finally(() => {
      // Clear input
      e.target.value = ''
    })
  }

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
      sx={{ '& .MuiPopover-paper': { borderRadius: '8px', mt: 1, width: 320 } }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={onBack} size="small" sx={{ mr: 1 }}>
            <ArrowBackIosIcon fontSize="small" sx={{ fontSize: '14px', ml: '4px' }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '16px', flexGrow: 1, textAlign: 'center' }}>
            Thay đổi hình nền
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2, minHeight: '36px' }}>
          <Tab label="Ảnh" sx={{ textTransform: 'none', minHeight: '36px', py: 0.5 }} />
          <Tab label="Màu" sx={{ textTransform: 'none', minHeight: '36px', py: 0.5 }} />
        </Tabs>

        {/* Tab Content: Photos */}
        {activeTab === 0 && (
          <Box>
            <Grid container spacing={1}>
              <Grid xs={6}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{
                    height: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    borderStyle: 'dashed',
                    color: 'text.secondary',
                    borderColor: 'divider'
                  }}
                >
                  <CloudUploadIcon fontSize="small" />
                  <Typography sx={{ fontSize: '10px' }}>Tải lên</Typography>
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleUploadImage} />
                </Button>
              </Grid>
              {MOCK_PHOTOS.map((url, index) => (
                <Grid xs={6} key={index}>
                  <Box
                    onClick={() => handleUpdateBackground(url)}
                    sx={{
                      height: 60,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundImage: `url(${url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 2 }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tab Content: Colors */}
        {activeTab === 1 && (
          <Box>
            <Grid container spacing={1}>
              {MOCK_COLORS.map((value, index) => (
                <Grid xs={4} key={index}>
                  <Box
                    onClick={() => handleUpdateBackground(value)}
                    sx={{
                      height: 50,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: value,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 2 },
                      border: value.startsWith('#') && value.toLowerCase() === '#ffffff' ? '1px solid #ddd' : 'none'
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Popover>
  )
}

export default ChangeBackgroundModal
