import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import ListCards from './ListCarts/listCards'
import { mapOrder } from '~/utils/sorts'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'


function Column({ column, createNewCard }) {
  const [openNewCardFrom, setOpenNewCardFrom] = useState(false)
  const toggleOpenNewCardFrom = () => setOpenNewCardFrom(!openNewCardFrom)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const orderedCard = mapOrder(column?.cards, column.cardOrderIds, '_id')
  const open = Boolean(anchorEl)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyle = {
    // Chiều cao phải luôn max:100% vì nếu không sẽ lỗi lúc kéo column ngắn qua
    //  một cái column dài thì phải kéo ở khu vực giữa-giữa rất khó chịu (demo ở video 32)
    // . Lưu ý: lúc này phải kết hợp với {...listeners} nằm ở Box chứ không phải ở div ngoài cùng
    //  để tránh trường hợp kéo vào vùng xanh.
    height: '100%',
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? '0.5' : undefined
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card title', { position: 'bottom-right' })
      return
    }
    const newCaredData = {
      title: newCardTitle,
      columnId: column._id
    }
    //   * Gọi lên props function createNewColumn nằm ở component cha cao nhất (boards/_id.jsx)
    // * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ
    //   đưa dữ liệu Board ra ngoài Redux Global Store,
    // * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những
    //   component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
    // * – Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
    await createNewCard(newCaredData)
    setNewCardTitle('')
    toggleOpenNewCardFrom()
  }

  // Nếu không bọc, khi kéo thả các cột (column) có thể gặp lỗi hiển thị nhấp nháy (flickering)
  // do chiều cao không được tính toán đúng — đặc biệt là khi kết hợp với animation hoặc auto layout.
  // Luôn đảm bảo wrapper (div hoặc section, Box,...) có chiều cao rõ ràng hoặc minHeight, height: 100%
  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyle}
      {...attributes}>
      <Box
        {...listeners}
        sx={
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
            height: ( theme ) => (theme.trello.column_header_height),
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
            {column.title}
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
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
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
              </MenuItem>t
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
        <ListCards cards={orderedCard}/>
        {/*Box Column Footer */}
        <Box sx={
          {
            height: ( theme ) => (theme.trello.column_footer_height),
            p: 2
          }
        }>
          {
            !openNewCardFrom
              ?
              <Box sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Button
                  onClick={toggleOpenNewCardFrom}
                  startIcon={<AddCardIcon/>}
                >
                Add new cart</Button>
                <Tooltip title='Drag to move'>
                  <DragHandleIcon sx={{
                    cursor: 'pointer'
                  }}/>
                </Tooltip>
              </Box>
              :
              <Box data-no-dnd="true" sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TextField
                  value={newCardTitle}
                  onChange={(e) => {setNewCardTitle(e.target.value)}}
                  spellCheck={false}
                  label="Enter Card title..."
                  type="text"
                  size='small'
                  variant='outlined'
                  autoFocus
                  // value={searchValue}
                  // onChange={(e) => setSearchValue(e.target.value)}
                  sx={
                    {
                      width: '100%',
                      '& label': { color: (theme) => theme.palette.primary.light },
                      '& input': { color: (theme) => theme.palette.text.primary },
                      '& label.Mui-focused': { color: (theme) => theme.palette.primary.light },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: (theme) => theme.palette.primary.light },
                        '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.light },
                        '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.light }
                      }
                    }
                  }/>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Button variant='contained' size='small'
                    onClick={addNewCard}
                  >Add</Button>
                  <CloseIcon onClick={toggleOpenNewCardFrom}
                    fontSize='small'
                    sx={
                      {
                        color: (theme) => theme.palette.info.main,
                        cursor: 'pointer',
                        '&:hover': {
                          color: (theme) => theme.palette.info.main
                        }
                      }
                    }
                  />
                </Box>
              </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column