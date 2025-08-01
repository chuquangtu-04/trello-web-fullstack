import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import GroupIcon from '@mui/icons-material/Group'
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'

const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

function BoardContent() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#1976d2' : '#34495e'),
      width: '100%',
      height: (theme) => (theme.trello.boardContentHeight),
      p: '10px 0'
    }}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {/*Box Column 01*/}
        <Box sx={
          {
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) => (`calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`)
          }
        }>
          {/*Box Column Header */}
          <Box sx={
            {
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }>
            <Typography variant='h6' sx={
              {
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }>
              Column Title
            </Typography>
            <Box>
              <Tooltip title='more option'>
                <ExpandMoreIcon
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id="basic-column-dropdown"
                  aria-controls={open ? 'menu-column-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id="menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new cart</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><DeleteForeverIcon fontSize="medium" /></ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/*Box Column List Card */}
          <Box sx={
            {
              p: '0 5px',
              m: '0 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: (theme) => (`calc(
                ${theme.trello.boardContentHeight} -
                ${theme.spacing(5)} -
                ${COLUMN_HEADER_HEIGHT} -
                ${COLUMN_HEADER_HEIGHT}
                )`),
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ced0da',
                borderRadius: '8px'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#bfc2cf'
              }
            }
          }>
            <Card sx={
              {
                cursor: 'pointer',
                overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
              }
            }>
              <CardMedia
                sx={{ height: 140 }}
                image="https://images.pexels.com/photos/1670413/pexels-photo-1670413.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                title="green iguana"
              />
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Chu Quang Tú Dev</Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button startIcon={<GroupIcon/>} size="small">20</Button>
                <Button startIcon={<CommentIcon/>} size="small">16</Button>
                <Button startIcon={<AttachmentIcon/>} size="small">7</Button>
              </CardActions>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
          </Box>
          {/*Box Column Footer */}
          <Box sx={
            {
              height: COLUMN_FOOTER_HEIGHT,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }>
            <Button startIcon={<AddCardIcon/>}>Add new cart</Button>
            <Tooltip title='Drag to move'>
              <DragHandleIcon sx={{
                cursor: 'pointer'
              }}/>
            </Tooltip>
          </Box>
        </Box>
        {/*Box Column 02*/}
        <Box sx={
          {
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) => (`calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`)
          }
        }>
          {/*Box Column Header */}
          <Box sx={
            {
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }>
            <Typography variant='h6' sx={
              {
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }>
              Column Title
            </Typography>
            <Box>
              <Tooltip title='more option'>
                <ExpandMoreIcon
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id="basic-column-dropdown"
                  aria-controls={open ? 'menu-column-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id="menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new cart</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><DeleteForeverIcon fontSize="medium" /></ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/*Box Column List Card */}
          <Box sx={
            {
              p: '0 5px',
              m: '0 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: (theme) => (`calc(
                ${theme.trello.boardContentHeight} -
                ${theme.spacing(5)} -
                ${COLUMN_HEADER_HEIGHT} -
                ${COLUMN_HEADER_HEIGHT}
                )`),
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ced0da',
                borderRadius: '8px'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#bfc2cf'
              }
            }
          }>
            <Card sx={
              {
                cursor: 'pointer',
                overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
              }
            }>
              <CardMedia
                sx={{ height: 140 }}
                image="https://images.pexels.com/photos/1670413/pexels-photo-1670413.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                title="green iguana"
              />
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Chu Quang Tú Dev</Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button startIcon={<GroupIcon/>} size="small">20</Button>
                <Button startIcon={<CommentIcon/>} size="small">16</Button>
                <Button startIcon={<AttachmentIcon/>} size="small">7</Button>
              </CardActions>
            </Card>
            <Card sx={{ overflow: 'unset', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                <Typography>Cart 01</Typography>
              </CardContent>
            </Card>
          </Box>
          {/*Box Column Footer */}
          <Box sx={
            {
              height: COLUMN_FOOTER_HEIGHT,
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }>
            <Button startIcon={<AddCardIcon/>}>Add new cart</Button>
            <Tooltip title='Drag to move'>
              <DragHandleIcon sx={{
                cursor: 'pointer'
              }}/>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default BoardContent
