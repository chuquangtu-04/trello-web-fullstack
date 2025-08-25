import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
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
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'white' : '#34495e'),
      borderBottom: '1px solid white',
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
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automatic"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filters"
          onClick={() => {}}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon/>}>Invite</Button>

        <AvatarGroup max={6} sx={{
          gap: 0.5,
          '& .MuiAvatar-root': {
            width: '36px',
            height: '36px',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            '&.MuiAvatar-colorDefault': { color: 'white', bgcolor: '#a4b0be' }
          }
        }}>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://5sfashion.vn/storage/upload/images/ckeditor/4KG2VgKFDJWqdtg4UMRqk5CnkJVoCpe5QMd20Pf7.jpg" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-05.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-06.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-07.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-12.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-14.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://5sfashion.vn/storage/upload/images/ckeditor/4KG2VgKFDJWqdtg4UMRqk5CnkJVoCpe5QMd20Pf7.jpg" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-05.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-06.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-07.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-12.webp" />
          </Tooltip>
          <Tooltip title='QuangTuDev'>
            <Avatar alt="QuangTuDev" src="https://eric.edu.vn/upload/2025/01/em-gai-xinh-dep-14.webp" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
