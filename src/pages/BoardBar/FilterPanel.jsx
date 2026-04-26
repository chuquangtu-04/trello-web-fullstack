import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, selectFilters, updateFilters } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { filterCards } from '~/utils/filterCards'

function FilterPanel({ anchorEl, isOpen, onClose }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)

  const handleKeywordChange = (e) => {
    dispatch(updateFilters({ ...filters, keyword: e.target.value }))
  }

  const handleMemberChange = (memberId) => {
    const newMemberIds = filters.memberIds.includes(memberId)
      ? filters.memberIds.filter(id => id !== memberId)
      : [...filters.memberIds, memberId]
    dispatch(updateFilters({ ...filters, memberIds: newMemberIds }))
  }

  const handleStatusChange = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]
    dispatch(updateFilters({ ...filters, status: newStatus }))
  }

  const clearFilters = () => {
    dispatch(updateFilters({ keyword: '', memberIds: [], status: [] }))
  }

  // Calculate matching cards count
  const matchCount = useMemo(() => {
    if (!board) return 0
    const allCards = board.columns.flatMap(c => c.cards).filter(c => !c.FE_placeholderCard)
    const filtered = filterCards(allCards, filters, currentUser)
    return filtered.length
  }, [board, filters, currentUser])

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Lọc</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Từ khóa</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập từ khóa..."
            value={filters.keyword}
            onChange={handleKeywordChange}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Thành viên</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.memberIds.includes('no-member')}
                  onChange={() => handleMemberChange('no-member')}
                  size="small"
                />
              }
              label={<Typography variant="body2">Không có thành viên</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.memberIds.includes('my-cards')}
                  onChange={() => handleMemberChange('my-cards')}
                  size="small"
                />
              }
              label={<Typography variant="body2">Các thẻ đã chỉ định cho tôi</Typography>}
            />
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Trạng thái</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status.includes('completed')}
                  onChange={() => handleStatusChange('completed')}
                  size="small"
                />
              }
              label={<Typography variant="body2">Đã đánh dấu hoàn thành</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status.includes('uncompleted')}
                  onChange={() => handleStatusChange('uncompleted')}
                  size="small"
                />
              }
              label={<Typography variant="body2">Không được đánh dấu là đã hoàn thành</Typography>}
            />
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {matchCount} thẻ
          </Typography>
          <Button size="small" onClick={clearFilters}>
            Clear filter
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}

export default FilterPanel
