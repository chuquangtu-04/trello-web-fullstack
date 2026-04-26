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
import { useState } from 'react'
import Badge from '@mui/material/Badge'
import { useSelector } from 'react-redux'
import { selectFilters } from '~/redux/activeBoard/activeBoardSlice'

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
  } }
function BoardBar({ board }) {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const filters = useSelector(selectFilters)
  const isOpenFilter = Boolean(filterAnchorEl)

  const handleOpenFilter = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleCloseFilter = () => {
    setFilterAnchorEl(null)
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
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label={board?.title}
            onClick={() => {}}
          />
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
