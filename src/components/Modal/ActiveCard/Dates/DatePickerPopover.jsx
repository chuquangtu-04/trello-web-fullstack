import React, { useState, useMemo, useEffect } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import moment from 'moment'

// Constants
const REMINDERS = [
  { value: 'none', label: 'Không' },
  { value: '5m', label: '5 phút trước' },
  { value: '10m', label: '10 phút trước' },
  { value: '1h', label: '1 giờ trước' },
  { value: '1d', label: '1 ngày trước' }
]

const REPEATS = [
  { value: 'none', label: 'Không bao giờ' },
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' }
]

const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

function DatePickerPopover({ anchorEl, isOpen, onClose, card, onSave, onRemove }) {
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))

  // States for form
  const [hasStartDate, setHasStartDate] = useState(!!card?.startDate)
  const [startDateStr, setStartDateStr] = useState('') // YYYY-MM-DD
  const [dueTimeStr, setDueTimeStr] = useState('') // HH:mm
  const [dueDateStr, setDueDateStr] = useState('') // YYYY-MM-DD
  
  const [reminder, setReminder] = useState(card?.reminder || 'none')
  const [repeat, setRepeat] = useState(card?.repeat || 'none')

  // Focus state for calendar picking
  const [activeDateField, setActiveDateField] = useState('due') // 'start' | 'due'

  // Initialize states when card changes or popover opens
  useEffect(() => {
    if (isOpen) {
      setHasStartDate(!!card?.startDate)
      setStartDateStr(card?.startDate ? moment(card.startDate).format('YYYY-MM-DD') : '')
      setDueDateStr(card?.dueDate ? moment(card.dueDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
      setDueTimeStr(card?.dueTime || moment().format('HH:mm'))
      setReminder(card?.reminder || 'none')
      setRepeat(card?.repeat || 'none')
      setCurrentMonth(card?.dueDate ? moment(card.dueDate).startOf('month') : moment().startOf('month'))
    }
  }, [isOpen, card])

  // Calendar logic
  const calendarDays = useMemo(() => {
    const startDay = currentMonth.clone().startOf('month').startOf('isoWeek') // Monday start
    const endDay = currentMonth.clone().endOf('month').endOf('isoWeek')
    
    const days = []
    let day = startDay.clone()
    while (day.isBefore(endDay, 'day') || day.isSame(endDay, 'day')) {
      days.push(day.clone())
      day.add(1, 'day')
    }
    return days
  }, [currentMonth])

  const handlePrevMonth = () => setCurrentMonth(prev => prev.clone().subtract(1, 'month'))
  const handleNextMonth = () => setCurrentMonth(prev => prev.clone().add(1, 'month'))

  const handleDayClick = (day) => {
    const formatted = day.format('YYYY-MM-DD')
    if (activeDateField === 'start') {
      setStartDateStr(formatted)
      setHasStartDate(true)
    } else {
      setDueDateStr(formatted)
    }
  }

  const handleSave = () => {
    const data = {
      startDate: hasStartDate && startDateStr ? moment(startDateStr).toISOString() : null,
      dueDate: dueDateStr ? moment(dueDateStr).toISOString() : null,
      dueTime: dueTimeStr || null,
      reminder: reminder !== 'none' ? reminder : null,
      repeat: repeat !== 'none' ? repeat : null
    }
    onSave(data)
  }

  const handleRemove = () => {
    onRemove()
  }

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: { width: 320, p: 2, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>
          Ngày
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <IconButton size="small" onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
        <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
          Tháng {currentMonth.format('M YYYY')}
        </Typography>
        <IconButton size="small" onClick={handleNextMonth}><ChevronRightIcon /></IconButton>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', mb: 2, textAlign: 'center' }}>
        {DAYS_OF_WEEK.map(d => (
          <Typography key={d} sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary' }}>{d}</Typography>
        ))}
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = day.isSame(currentMonth, 'month')
          const isToday = day.isSame(moment(), 'day')
          const dateStr = day.format('YYYY-MM-DD')
          const isSelectedStart = hasStartDate && startDateStr === dateStr
          const isSelectedDue = dueDateStr === dateStr

          let bgColor = 'transparent'
          let color = isCurrentMonth ? 'text.primary' : 'text.disabled'
          
          if (isSelectedStart || isSelectedDue) {
            bgColor = 'primary.main'
            color = 'white'
          }

          return (
            <Box
              key={idx}
              onClick={() => handleDayClick(day)}
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: bgColor,
                color: color,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isToday || isSelectedStart || isSelectedDue ? 700 : 400,
                border: isToday && !isSelectedStart && !isSelectedDue ? '1px solid #1976d2' : '1px solid transparent',
                '&:hover': {
                  bgcolor: isSelectedStart || isSelectedDue ? 'primary.dark' : 'action.hover'
                }
              }}
            >
              {day.format('D')}
            </Box>
          )
        })}
      </Box>

      {/* Inputs */}
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Ngày bắt đầu</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Checkbox 
          size="small" 
          checked={hasStartDate} 
          onChange={(e) => setHasStartDate(e.target.checked)} 
          sx={{ p: 0 }} 
        />
        <TextField 
          size="small" 
          placeholder="DD/MM/YYYY"
          value={hasStartDate && startDateStr ? moment(startDateStr).format('DD/MM/YYYY') : ''}
          onClick={() => { setHasStartDate(true); setActiveDateField('start') }}
          InputProps={{ readOnly: true }}
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { bgcolor: activeDateField === 'start' ? 'action.selected' : 'transparent' } }}
        />
      </Box>

      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Ngày hết hạn</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Checkbox size="small" checked disabled sx={{ p: 0 }} />
        <TextField 
          size="small" 
          placeholder="DD/MM/YYYY"
          value={dueDateStr ? moment(dueDateStr).format('DD/MM/YYYY') : ''}
          onClick={() => setActiveDateField('due')}
          InputProps={{ readOnly: true }}
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { bgcolor: activeDateField === 'due' ? 'action.selected' : 'transparent' } }}
        />
        <TextField 
          size="small" 
          type="time"
          value={dueTimeStr}
          onChange={(e) => setDueTimeStr(e.target.value)}
          sx={{ width: 100 }}
        />
      </Box>

      {/* Selects */}
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Thiết lập nhắc nhở</Typography>
      <Select size="small" fullWidth value={reminder} onChange={e => setReminder(e.target.value)} sx={{ mb: 1.5 }}>
        {REMINDERS.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
      </Select>

      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Định kỳ</Typography>
      <Select size="small" fullWidth value={repeat} onChange={e => setRepeat(e.target.value)} sx={{ mb: 2 }}>
        {REPEATS.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
      </Select>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, lineHeight: 1.2 }}>
        Nhắc nhở sẽ được gửi đến tất cả các thành viên của thẻ này.
      </Typography>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained" fullWidth onClick={handleSave} disableElevation>Lưu</Button>
        <Button variant="contained" fullWidth color="inherit" onClick={handleRemove} disableElevation sx={{ bgcolor: 'action.hover' }}>Gỡ bỏ</Button>
      </Box>

    </Popover>
  )
}

export default DatePickerPopover
