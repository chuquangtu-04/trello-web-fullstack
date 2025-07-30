import ModeSelect from '~/components/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { ReactComponent as StarIcon } from '~/assets/trello.svg'
import WorkSpaces from './Menus/WorkSpaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import Menu from './DrawerList/DrawerList'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'

function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
      overflowX: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: { 'xs': 'flex', 'md': 'none' } }}>
          <Menu />
        </Box>
        <Box sx={{ display: { 'xs': 'none', 'md': 'flex' }, alignItems: 'center', gap: 1 }}>
          <AppsIcon sx={{ color: 'primary.main' }}/>
          <Box sx={{ display:'flex', gap: 0.5, alignItems: 'center' }}>
            <SvgIcon component={StarIcon} fontSize='small' inheritViewBox sx={{ color: 'primary.main' }}/>
            <Typography variant='span' sx={{ color: 'primary.main', fontSize: '1.2rem', fontWeight: 'bold' }}>Trello</Typography>
          </Box>
          <WorkSpaces />
          <Recent/>
          <Starred/>
          <Templates/>
          <Button variant="outlined" startIcon={<LibraryAddIcon/>}>Create</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField id="outlined-search" label="Search..." type="search" size='small' sx={{ minWidth: '120px' }}/>
        <ModeSelect/>
        <Tooltip title="Notification">
          <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ cursorL: 'pointer', color: 'primary.main'}}/>
          </Badge>
        </Tooltip>

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'primary.main' }}/>
        </Tooltip>

        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar
