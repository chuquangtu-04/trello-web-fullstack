import ModeSelect from '~/components/ModeSelect/ModeSelect'
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
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'


function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
      overflowX: 'auto',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: { 'xs': 'flex', 'md': 'none' } }}>
          <Menu />
        </Box>
        <Box sx={{ display: { 'xs': 'none', 'md': 'flex' }, alignItems: 'center', gap: 1 }}>
          <AppsIcon sx={{ color: 'white' }}/>
          <Box sx={{ display:'flex', gap: 0.5, alignItems: 'center' }}>
            <SvgIcon component={StarIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }}/>
            <Typography variant='span' sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>Trello</Typography>
          </Box>
          <WorkSpaces />
          <Recent/>
          <Starred/>
          <Templates/>
          <Button
            variant="none"
            startIcon={<LibraryAddIcon/>}
            sx={{ color: 'white', borderColor: 'white', '&:hover': {
              backgroundColor: 'transparent'
            } }}
          >
            Create</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          spellCheck={false}
          id="input-with-icon-textfield"
          // id="outlined-search"
          label="Search..."
          type="text"
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={
                  {
                    color: 'white'
                  }
                }/>
              </InputAdornment>
            ),
            endAdornment: (
              searchValue && (
                <CloseIcon onClick={() => setSearchValue('')} sx={
                  {
                    color: 'white',
                    fontSize: 'medium',
                    cursor: 'pointer'
                  }
                }
                /> )
            )
          }}
          sx={
            {
              minWidth: '120px',
              maxWidth: '180px',
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label.Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }
          }/>
        <ModeSelect/>
        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ cursorL: 'pointer', color: 'white'}}/>
          </Badge>
        </Tooltip>

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }}/>
        </Tooltip>

        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar
