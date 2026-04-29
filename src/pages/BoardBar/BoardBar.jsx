import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import BoltIcon from '@mui/icons-material/Bolt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Tooltip, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import FilterPanel from './FilterPanel'
import BoardMenuModal from './BoardMenuModal'
import ArchivedItemsModal from './ArchivedItemsModal'
import ChangeBackgroundModal from './ChangeBackgroundModal'
import { useState, useEffect } from 'react'
import Badge from '@mui/material/Badge'
import TextField from '@mui/material/TextField'
import { useSelector, useDispatch } from 'react-redux'
import { selectFilters, updateCurrentActiveBoard, toggleBoardStar } from '~/redux/activeBoard/activeBoardSlice'
import { updateUserStarredBoards } from '~/redux/user/userSlice'
import { updateBoardDetailsAPI, toggleBoardStarAPI } from '~/apis'
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
  
  // State quản lý Filter Popover
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const isOpenFilter = Boolean(filterAnchorEl)

  // State quản lý Board Menu và Archived Popovers
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [showBoardMenu, setShowBoardMenu] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [showChangeBackground, setShowChangeBackground] = useState(false)

  // State phục vụ cho việc đổi tên board
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(board?.title || '')

  useEffect(() => {
    if (board?.title) setTitleValue(board.title)
  }, [board?.title])

  const handleOpenFilter = (event) => setFilterAnchorEl(event.currentTarget)
  const handleCloseFilter = () => setFilterAnchorEl(null)

  const handleOpenBoardMenu = (event) => {
    setMenuAnchorEl(event.currentTarget)
    setShowBoardMenu(true)
  }

  const handleCloseBoardMenu = () => {
    setMenuAnchorEl(null)
    setShowBoardMenu(false)
  }

  const handleOpenArchived = () => {
    setShowBoardMenu(false)
    setShowArchived(true)
    // Giữ nguyên menuAnchorEl để làm anchor cho Archived Popover
  }

  const handleCloseArchived = () => {
    setMenuAnchorEl(null)
    setShowArchived(false)
  }

  const handleBackToMenu = () => {
    setShowArchived(false)
    setShowChangeBackground(false)
    setShowBoardMenu(true)
  }

  const handleOpenChangeBackground = () => {
    setShowBoardMenu(false)
    setShowChangeBackground(true)
  }

  const handleCloseChangeBackground = () => {
    setMenuAnchorEl(null)
    setShowChangeBackground(false)
  }

  const handleUpdateBoardTitle = () => {
    const trimmedTitle = titleValue.trim()
    if (!trimmedTitle || trimmedTitle === board?.title) {
      setTitleValue(board?.title || '')
      setIsEditingTitle(false)
      return
    }

    const updatedBoard = { ...board, title: trimmedTitle }
    dispatch(updateCurrentActiveBoard(updatedBoard))

    updateBoardDetailsAPI(board._id, { title: trimmedTitle })
      .then(() => toast.success('Đã cập nhật tên Board thành công'))
      .finally(() => setIsEditingTitle(false))
  }

  const handleToggleStar = () => {
    const newStarState = !board?.isStarred
    // Optimistic update
    dispatch(toggleBoardStar(newStarState))
    dispatch(updateUserStarredBoards({ boardId: board._id, isStarred: newStarState }))
    
    toggleBoardStarAPI(board._id).catch(() => {
      // Rollback
      dispatch(toggleBoardStar(!newStarState))
      dispatch(updateUserStarredBoards({ boardId: board._id, isStarred: !newStarState }))
    })
  }

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, '& .MuiButtonBase-root': { backgroundColor: 'transparent' } }}>
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
                  backgroundColor: 'white', borderRadius: '4px', height: '32px', fontWeight: 'bold', fontSize: '14px', '& fieldset': { border: 'none' }
                },
                '& .MuiOutlinedInput-input': { padding: '4px 8px', color: 'primary.main' }
              }}
            />
          ) : (
            <Chip
              sx={{ ...MENU_STYLE, paddingX: '10px', '& .MuiChip-label': { fontWeight: 'bold', fontSize: '14px' } }}
              icon={<DashboardIcon />}
              label={board?.title}
              onClick={() => setIsEditingTitle(true)}
            />
          )}
        </Tooltip>

        <Tooltip title={board?.isStarred ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}>
          <IconButton
            onClick={handleToggleStar}
            sx={{
              padding: '6px',
              color: board?.isStarred ? '#f1c40f' : 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.2)',
                color: board?.isStarred ? '#f1c40f' : '#f1c40f'
              }
            }}
          >
            {board?.isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={board?.type}>
          <Chip sx={MENU_STYLE} icon={<VpnLockIcon />} label={capitalizeFirstLetter(board?.type)} onClick={() => { }} />
        </Tooltip>

        <Chip sx={MENU_STYLE} icon={<BoltIcon />} label="Automatic" onClick={() => { }} />

        <Badge color="error" variant="dot" invisible={activeFilterCount === 0}>
          <Chip sx={MENU_STYLE} icon={<FilterListIcon />} label="Filters" onClick={handleOpenFilter} />
        </Badge>
        <FilterPanel anchorEl={filterAnchorEl} isOpen={isOpenFilter} onClose={handleCloseFilter} />

        <Chip 
          sx={{ ...MENU_STYLE, minWidth: '40px', '& .MuiChip-label': { display: 'none' } }} 
          icon={<MoreHorizIcon />} 
          onClick={handleOpenBoardMenu} 
        />

        {/* Popovers */}
        <BoardMenuModal 
          isOpen={showBoardMenu} 
          anchorEl={menuAnchorEl}
          onClose={handleCloseBoardMenu} 
          onOpenArchived={handleOpenArchived}
          onOpenChangeBackground={handleOpenChangeBackground}
        />
        <ArchivedItemsModal 
          isOpen={showArchived} 
          anchorEl={menuAnchorEl}
          onClose={handleCloseArchived} 
          onBack={handleBackToMenu}
        />
        <ChangeBackgroundModal
          isOpen={showChangeBackground}
          anchorEl={menuAnchorEl}
          onClose={handleCloseChangeBackground}
          onBack={handleBackToMenu}
          board={board}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser boardId={board._id} />
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
