import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, selectFilters, updateFilters } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { filterCards } from '~/utils/filterCards'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LabelBadge from '~/components/Modal/ActiveCard/Labels/LabelBadge'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Collapse from '@mui/material/Collapse'

const LabelItem = ({ label, isChecked, onToggle }) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={isChecked}
        onChange={() => onToggle(label.id)}
        size="small"
      />
    }
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <LabelBadge label={label} fullWidth height="32px" />
      </Box>
    }
    sx={{ width: '100%', mr: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
  />
)

function FilterPanel({ anchorEl, isOpen, onClose }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const [isLabelsExpanded, setIsLabelsExpanded] = useState(false)

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

  const handleDueDateChange = (filterKey) => {
    const newDueDateFilters = filters.dueDateFilters.includes(filterKey)
      ? filters.dueDateFilters.filter(f => f !== filterKey)
      : [...filters.dueDateFilters, filterKey]
    dispatch(updateFilters({ ...filters, dueDateFilters: newDueDateFilters }))
  }

  const handleLabelChange = (labelId) => {
    const newLabelIds = filters.labelIds.includes(labelId)
      ? filters.labelIds.filter(id => id !== labelId)
      : [...filters.labelIds, labelId]
    dispatch(updateFilters({ ...filters, labelIds: newLabelIds }))
  }

  const clearFilters = () => {
    dispatch(updateFilters({ keyword: '', memberIds: [], status: [], dueDateFilters: [], labelIds: [] }))
  }

  // Calculate matching cards count
  const matchCount = useMemo(() => {
    if (!board) return 0
    const allCards = board.columns?.flatMap(c => c.cards || []).filter(c => !c.FE_placeholderCard) || []
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Nhãn</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.labelIds.includes('no-label')}
                  onChange={() => handleLabelChange('no-label')}
                  size="small"
                />
              }
              label={<Typography variant="body2">Không có nhãn</Typography>}
            />
            {board?.labels?.slice(0, 3).map(label => (
              <LabelItem
                key={label.id}
                label={label}
                isChecked={filters.labelIds.includes(label.id)}
                onToggle={handleLabelChange}
              />
            ))}

            {board?.labels?.length > 3 && (
              <>
                <Button
                  size="small"
                  startIcon={isLabelsExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                  onClick={() => setIsLabelsExpanded(!isLabelsExpanded)}
                  sx={{ justifyContent: 'flex-start', pl: 1, color: 'text.secondary', textTransform: 'none' }}
                >
                  {isLabelsExpanded ? 'Ẩn bớt nhãn' : 'Xem thêm nhãn'}
                </Button>
                <Collapse in={isLabelsExpanded}>
                  <Box sx={{ mt: 1 }}>
                    {board?.labels?.slice(3).map(label => (
                      <LabelItem
                        key={label.id}
                        label={label}
                        isChecked={filters.labelIds.includes(label.id)}
                        onToggle={handleLabelChange}
                      />
                    ))}
                  </Box>
                </Collapse>
              </>
            )}
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Ngày hết hạn</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.dueDateFilters.includes('noDueDate')}
                  onChange={() => handleDueDateChange('noDueDate')}
                  size="small"
                />
              }
              label={<Typography variant="body2">Không có ngày hết hạn</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.dueDateFilters.includes('overdue')}
                  onChange={() => handleDueDateChange('overdue')}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: '#eb5a46', fontSize: '18px' }} />
                  <Typography variant="body2">Quá hạn</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.dueDateFilters.includes('tomorrow')}
                  onChange={() => handleDueDateChange('tomorrow')}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: '#f2d600', fontSize: '18px' }} />
                  <Typography variant="body2">Sẽ hết hạn vào ngày mai</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.dueDateFilters.includes('nextWeek')}
                  onChange={() => handleDueDateChange('nextWeek')}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: '#97a0af', fontSize: '18px' }} />
                  <Typography variant="body2">Sẽ hết hạn vào tuần sau</Typography>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.dueDateFilters.includes('nextMonth')}
                  onChange={() => handleDueDateChange('nextMonth')}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: '#97a0af', fontSize: '18px' }} />
                  <Typography variant="body2">Sẽ hết hạn vào tháng sau</Typography>
                </Box>
              }
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
