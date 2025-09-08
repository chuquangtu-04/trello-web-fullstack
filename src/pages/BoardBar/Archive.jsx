import CloseIcon from '@mui/icons-material/Close'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsSoftColumnAPI, restoreColumnsAPI } from '~/apis'
import { toast } from 'react-toastify'

const MENU_STYLE = {
  color: 'primary.main',
  backgroundColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '6px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  },
  '& .MuiChip-icon': { ml: '18px' }
}
function Archive() {
  const [columnArchive, setColumnArchive] = useState([])

  const [anchorEl, setAnchorEl] = useState(null)
  const [showArchive, setShowArchive] = useState(false)
  const toggleOpenShowArchive = () => (setShowArchive(!showArchive))

  const boardId = '68b177305ae24b6d3851be0d'
  useEffect( () => {
    ( async () => {
      const board = await fetchBoardDetailsSoftColumnAPI(boardId)
      setColumnArchive(board.columns)
    })()
  }, [])

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // Khôi phục column
  const handleArchiveColumn = (columnId) => {
    const newColumns = cloneDeep(columnArchive)
    const newColumnsDelete = newColumns.filter(column => column._id != columnId)
    setColumnArchive(newColumnsDelete)

    // Gọi API
    restoreColumnsAPI(columnId).then((res) => {
      toast.success(res.message)
    })
  }

  // Xóa vĩnh viên column
  const handleDeleteColumn = (columnId) => {
  }

  if (!columnArchive) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Button
        id="basic-button-archive"
        aria-controls={open ? 'basic-menu-archive' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ color: 'white' }}
      >
        <Chip
          sx={MENU_STYLE}
          icon={<MoreHorizIcon />}
          onClick={() => {}}
        />
      </Button>
      <Menu
        sx={{
          '& .MuiPopover-paper': { borderRadius: '8px' }
        }}
        id="basic-menu-archive"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-archive'
        }}
      >
        <Box
          sx={ {
            minWidth: '382px',
            minHeight: '180px',
            p: '14px 7px 14px 14px'
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#44546f' }}>
              Mục đã lưu trữ
              <CloseIcon fontSize='small' sx={{ cursor: 'pointer', borderRadius: '6px', '&:hover': { backgroundColor: '#091e4224' } }} onClick={handleClose}/>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '12px', mb: '20px' }}>
              <TextField sx={{ mr: '10px', flex: 1, '& .MuiOutlinedInput-root:hover fieldset': { borderColor: '#1976b6' } }} size='small' id="outlined-search" placeholder='Tìm kiếm lưu trữ...' type="search" />
              {
                showArchive ?
                  <Button variant="contained" onClick={toggleOpenShowArchive}>Card are stored</Button> :
                  <Button variant="contained" onClick={toggleOpenShowArchive}>Columns are stored</Button>
              }
            </Box>
            {
              showArchive ? 'Card lưu trữ ở đây' :
                <Box sx={{ maxHeight: '300px', overflowX: 'auto', pr: '7px' }}>
                  {
                    columnArchive.length === 0 &&
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#091e420f',
                      mt: '14px',
                      minHeight: '68px',
                      borderRadius: '8px'
                    }}>
                    Không có thẻ nào
                    </Box> }
                  {
                    columnArchive.map((column, index) => (
                      <Box sx={{ mt: '14px', minHeight: '68px' }} key={index} >
                        <Box sx={{ display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0px 1px 0px 0px #091e4224',
                          pb: '12px',
                          pt: '12px'
                        }}>
                          {column.title}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                              onClick={() => handleArchiveColumn(column._id)}
                              startIcon={<RestartAltIcon/>}
                              sx={{ mr: '6px' }}
                              variant="contained"
                            >Khôi Phục</Button>
                            <Box
                              onClick={() => handleDeleteColumn(column._id)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '37px',
                                width: '37px',
                                borderRadius: '6px',
                                backgroundColor: '#091e420f',
                                '&:hover': { backgroundColor: '#091e4224' }
                              }}>
                              <DeleteSweepIcon fontSize="small" sx={ { cursor: 'pointer', color: '#44546f' }}/>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  }
                </Box>
            }
          </Box>
        </Box>
      </Menu>
    </Box>
  )
}

export default Archive