import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { LABEL_COLORS } from '~/utils/constants'

/**
 * LabelBadge – hiển thị một label dưới dạng badge màu
 * @param {object} label   – { id, name, color }
 * @param {boolean} compact – chỉ hiện màu, ẩn tên (có tooltip)
 * @param {boolean} animate – có animation khi mount
 */
function LabelBadge({ label, compact = false, animate = false, fullWidth = false, height = '20px' }) {
  if (!label) return null

  // Tìm giá trị màu hex (color có thể là id như 'green' hoặc hex '#22c55e')
  const colorDef = LABEL_COLORS.find(c => c.id === label.color || c.value === label.color)
  const bgColor = colorDef ? colorDef.value : label.color

  const badge = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: height,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: compact ? '4px' : '3px',
        bgcolor: bgColor,
        px: compact ? '8px' : '6px',
        minWidth: compact ? '36px' : 'auto',
        maxWidth: fullWidth ? '100%' : (compact ? '36px' : '120px'),
        cursor: 'default',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...(animate && {
          animation: 'labelFadeIn 0.2s ease'
        }),
        '@keyframes labelFadeIn': {
          from: { opacity: 0, transform: 'scale(0.85)' },
          to: { opacity: 1, transform: 'scale(1)' }
        }
      }}
    >
      {!compact && (
        <Box
          component="span"
          sx={{
            fontSize: height !== '20px' ? '13px' : '11px',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 1px 1px rgba(0,0,0,0.3)',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          {label.name || ''}
        </Box>
      )}
    </Box>
  )

  if (compact && label.name) {
    return <Tooltip title={label.name} arrow placement="top">{badge}</Tooltip>
  }
  return badge
}

export default LabelBadge
