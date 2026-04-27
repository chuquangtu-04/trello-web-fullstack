import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import moment from 'moment'

/**
 * DateBadge component
 * @param {object} card - The card object containing startDate, dueDate, dueTime, completed
 * @param {boolean} showIcon - Whether to show the clock icon (usually true on small card)
 * @param {boolean} interactive - If true, show checkbox to toggle completion and dropdown arrow (used in ActiveCard)
 * @param {function} onToggleComplete - Callback for checkbox
 * @param {function} onClick - Callback for opening popover
 */
function DateBadge({ card, showIcon = true, interactive = false, onToggleComplete, onClick }) {
  if (!card?.dueDate) return null

  const now = moment()
  // Compose full due date object
  let dueMoment = moment(card.dueDate)
  if (card.dueTime) {
    const [hours, minutes] = card.dueTime.split(':')
    dueMoment.set({ hour: parseInt(hours, 10), minute: parseInt(minutes, 10) })
  }

  // Determine status color
  let status = 'normal' // normal, soon, overdue, completed
  if (card.completed) {
    status = 'completed'
  } else if (dueMoment.isBefore(now)) {
    status = 'overdue'
  } else if (dueMoment.diff(now, 'hours') < 24) {
    status = 'soon'
  }

  const bgColors = {
    normal: 'transparent',
    soon: '#f5cd47', // Yellow
    overdue: '#f87168', // Red
    completed: '#4bce97' // Green
  }

  const textColors = {
    normal: 'text.secondary',
    soon: '#172b4d',
    overdue: '#fff',
    completed: '#fff'
  }

  // Format display text
  let dateText = ''
  if (card.startDate) {
    const startMoment = moment(card.startDate)
    dateText += startMoment.format('D MMM') + ' - '
  }
  dateText += dueMoment.format('D MMM')
  if (card.dueTime && interactive) {
    dateText += ` lúc ${card.dueTime}`
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: interactive ? 'action.hover' : bgColors[status],
        color: interactive ? 'text.primary' : textColors[status],
        borderRadius: '3px',
        px: interactive ? 1.5 : 0.5,
        py: interactive ? 0.75 : 0.25,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          bgcolor: onClick ? 'action.selected' : bgColors[status]
        }
      }}
    >
      {interactive && (
        <Checkbox
          size="small"
          checked={!!card.completed}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation()
            if (onToggleComplete) onToggleComplete()
          }}
          sx={{ p: 0, mr: 1, color: 'inherit', '&.Mui-checked': { color: 'inherit' } }}
        />
      )}

      {!interactive && showIcon && (
        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'inherit' }} />
      )}
      
      <Typography sx={{ fontSize: interactive ? '14px' : '12px', fontWeight: interactive ? 500 : 400, color: interactive ? 'text.primary' : 'inherit' }}>
        {dateText}
      </Typography>

      {!interactive && status !== 'normal' && (
        <Box
          sx={{
            ml: 0.5,
            px: 0.5,
            borderRadius: '2px',
            bgcolor: 'rgba(0,0,0,0.1)',
            fontSize: '10px',
            fontWeight: 700
          }}
        >
          {status === 'soon' && 'Sắp hạn'}
          {status === 'overdue' && 'Quá hạn'}
          {status === 'completed' && 'Hoàn thành'}
        </Box>
      )}

      {interactive && (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, px: 0.5, borderRadius: '2px', bgcolor: bgColors[status], color: textColors[status], fontSize: '12px', fontWeight: 500 }}>
          {status === 'soon' && 'Sắp hạn'}
          {status === 'overdue' && 'Quá hạn'}
          {status === 'completed' && 'Hoàn thành'}
        </Box>
      )}

      {interactive && <KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />}
    </Box>
  )
}

export default DateBadge
