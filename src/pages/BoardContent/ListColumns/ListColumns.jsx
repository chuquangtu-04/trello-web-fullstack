import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '~/apis'
import Column from './Column/Column'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { generatePlaceholderCard } from '~/utils/formatters'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({ columns = [] }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openNewColumnFrom, setOpenNewColumnFrom] = useState(false)
  const toggleOpenNewColumnFrom = () => setOpenNewColumnFrom(!openNewColumnFrom)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }
    // Tạo dữ liệu Column để gọi Api
    const newColumnData = {
      title: newColumnTitle
    }
    // Gọi Api tạo mới column và làm lại dữ liệu State Board
    const createNewColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board?._id
    })
    createNewColumn.cards = [generatePlaceholderCard(createNewColumn)],
    createNewColumn.cardOrderIds = [generatePlaceholderCard(createNewColumn)._id]

    // Cập nhật lại board
    const newBoard = cloneDeep(board || {})
    if (!newBoard.columns) newBoard.columns = []
    if (!newBoard.columnOrderIds) newBoard.columnOrderIds = []
    newBoard.columns.push(createNewColumn)
    newBoard.columnOrderIds.push(createNewColumn._id)
    dispatch(updateCurrentActiveBoard(newBoard))
    setNewColumnTitle('')
    toggleOpenNewColumnFrom()
  }
  return (
    <SortableContext items={(columns || []).map(column => column._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {
          columns?.map(column => (<Column key={column._id} column={column}/>))
        }

        {
          !openNewColumnFrom
            ?
            <Box
              onClick={toggleOpenNewColumnFrom}
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#ffffff3d',
                mx: 2
              }}>
              <Button
                startIcon={<NoteAddIcon/>}
                sx={
                  {
                    color: 'white',
                    width: '100%',
                    justifyContent: 'flex-start',
                    pl: 2.5,
                    py: 1
                  }
                }>
            Add new column
              </Button>
            </Box>
            :
            <Box sx={{
              maxWidth: '250px',
              minWidth: '250px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
                value={newColumnTitle}
                onChange={(e) => {setNewColumnTitle(e.target.value)}}
                spellCheck={false}
                label="Enter column title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                // value={searchValue}
                // onChange={(e) => setSearchValue(e.target.value)}
                sx={
                  {
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
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Button
                  className='interceptor-loading'
                  variant='contained'
                  size='small'
                  onClick={addNewColumn}
                >Add Column</Button>
                <CloseIcon onClick={toggleOpenNewColumnFrom}
                  fontSize='small'
                  sx={
                    {
                      color: 'white',
                      cursor: 'pointer',
                      '&:hover': {
                        color: (theme) => theme.palette.warning.light
                      }
                    }
                  }
                />
              </Box>
            </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns