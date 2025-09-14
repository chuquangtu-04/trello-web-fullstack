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

function ListColumns({ columns }) {
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
      boardId: board._id
    })
    createNewColumn.cards = [generatePlaceholderCard(createNewColumn)],
    createNewColumn.cardOrderIds = [generatePlaceholderCard(createNewColumn)._id]

    //  * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất
    //  * của spread operator là Shallow Copy/Clone, nên dính phải rules Immutability trong Redux Toolkit không
    //  * dùng được hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản nhanh gọn nhất ở trường hợp này của chúng
    //  * ta là dùng tới Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn.
    //  * https://redux-toolkit.js.org/usage/immer-reducers
    //  * Tài liệu thêm về Shallow và Deep Copy Object trong JS:
    //  * https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/

    // Cập nhật lại board
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createNewColumn)
    newBoard.columnOrderIds.push(createNewColumn._id)
    //  * Ngoài ra cách nữa là vẫn có thể dùng array.concat thay cho push như docs của Redux Toolkit ở trên vì
    //  * push như đã nói nó sẽ thay đổi giá trị mảng trực tiếp, còn concat thì nó merge – ghép mảng lại và
    //  * tạo ra một mảng mới để chúng ta gán lại giá trị nên không vấn đề gì.
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createNewColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createNewColumn._id])
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    setNewColumnTitle('')
    toggleOpenNewColumnFrom()
  }
  return (
    <SortableContext items={columns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
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
          columns.map(column => (<Column key={column._id} column={column}/>))
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