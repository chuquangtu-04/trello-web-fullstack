import BoltIcon from '@mui/icons-material/Bolt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { capitalizeFirstLetter } from '~/utils/formatters'
import Archive from './Archive'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import FilterPanel from './FilterPanel'
import { useState, useEffect } from 'react'
import Badge from '@mui/material/Badge'
import TextField from '@mui/material/TextField'
import { useSelector, useDispatch } from 'react-redux'
import { selectFilters, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateBoardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'

const MENU_STYLE = {
  color: 'primary.main',
  backgroundColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}

function BoardBar({ board }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const isOpenFilter = Boolean(filterAnchorEl)

  // State phục vụ cho việc đổi tên board
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(board?.title || '')

  // Mỗi khi board thay đổi từ bên ngoài (ví dụ chuyển board) thì cập nhật lại titleValue
  useEffect(() => {
    if (board?.title) setTitleValue(board.title)
  }, [board?.title])

  const handleOpenFilter = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setFilterAnchorEl(null)
  }

  const handleUpdateBoardTitle = () => {
    const trimmedTitle = titleValue.trim()
    if (!trimmedTitle || trimmedTitle === board?.title) {
      setTitleValue(board?.title || '')
      setIsEditingTitle(false)
      return
    }

    // Optimistic Update UI
    const updatedBoard = { ...board, title: trimmedTitle }
    dispatch(updateCurrentActiveBoard(updatedBoard))

    // Gọi API cập nhật vào DB
    updateBoardDetailsAPI(board._id, { title: trimmedTitle })
      .then(() => {
        toast.success('Đã cập nhật tên Board thành công')
      })
      .finally(() => {
        setIsEditingTitle(false)
      })
  }

  // Đếm số lượng filter đang active để hiện badge
  const activeFilterCount = (filters.keyword ? 1 : 0) + filters.memberIds.length + filters.status.length

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)'),
      borderBottom: '1px solid rgba(255,255,255,0.28)',
      backdropFilter: 'blur(2px)',
      paddingX: 2
    }}>
      <Box sx={
        { display: 'flex',
          alignItems: 'center',
          gap: 2,
          '& .MuiButtonBase-root' : { backgroundColor: 'transparent' }
        }
      }>
        <Tooltip title={board?.description}>
          {isEditingTitle ? (
            <TextField
              size="small"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleUpdateBoardTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateBoardTitle()
                if (e.key === 'Escape') {
                  setTitleValue(board?.title || '')
                  setIsEditingTitle(false)
                }
              }}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  height: '32px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '4px 8px',
                  color: 'primary.main'
                }
              }}
            />
          ) : (
            <Chip
              sx={{
                ...MENU_STYLE,
                paddingX: '10px',
                '& .MuiChip-label': { fontWeight: 'bold', fontSize: '14px' }
              }}
              icon={<DashboardIcon />}
              label={board?.title}
              onClick={() => setIsEditingTitle(true)}
            />
          )}
        </Tooltip>
        <Tooltip title={board?.type}>
          <Chip
            sx={MENU_STYLE}
            icon={<VpnLockIcon />}
            label={capitalizeFirstLetter(board?.type)}
            onClick={() => {}}
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automatic"
          onClick={() => {}}
        />
        <Badge color="error" variant="dot" invisible={activeFilterCount === 0}>
          <Chip
            sx={MENU_STYLE}
            icon={<FilterListIcon />}
            label="Filters"
            onClick={handleOpenFilter}
          />
        </Badge>
        <FilterPanel 
          anchorEl={filterAnchorEl} 
          isOpen={isOpenFilter} 
          onClose={handleCloseFilter} 
        />
        <Archive/>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Xử lý mời user vào làm thành viên của board */}
        <InviteBoardUser boardId={board._id}/>
        {/* Xử lý hiện thị danh sách thành viên của board */}
        <BoardUserGroup boardUsers={board?.FE_allUsers}/>
      </Box>
    </Box>
  )
}

export default BoardBar
