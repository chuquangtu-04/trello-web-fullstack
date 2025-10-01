import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as StarIcon } from '~/assets/trello.svg'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Menu from './DrawerList/DrawerList'
import Profiles from './Menus/Profiles'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import WorkSpaces from './Menus/WorkSpaces'
import Notifications from './Notifications/Notifications'


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
          <Link to='/boards'>
            <Tooltip title='Board List'>
              <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }}/>
            </Tooltip>
          </Link>

          <Link to='/'>
            <Box sx={{ display:'flex', gap: 0.5, alignItems: 'center' }}>
              <SvgIcon component={StarIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }}/>
              <Typography variant='span' sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>Trello</Typography>
            </Box>
          </Link>

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
                <InputAdornment position="end">
                  <CloseIcon onClick={() => setSearchValue('')} sx={
                    {
                      color: 'white',
                      fontSize: 'medium',
                      cursor: 'pointer'
                    }
                  }
                  />
                </InputAdornment>
              )
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
        {/* hiện thị dark light systems mode */}
        <ModeSelect/>
        {/* Xử lý hiện thị các thông báo */}
        <Notifications/>

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }}/>
        </Tooltip>

        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar
