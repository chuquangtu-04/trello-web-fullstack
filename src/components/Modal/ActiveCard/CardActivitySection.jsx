import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { styled } from '@mui/material/styles'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socketClient'

const CommentBubble = styled(Box)(({ theme, isowner }) => ({
  display: 'block',
  backgroundColor: isowner === 'true' 
    ? (theme.palette.mode === 'dark' ? '#004a99' : '#e7f3ff')
    : (theme.palette.mode === 'dark' ? '#33485D' : '#f0f2f5'),
  padding: '10px 14px',
  marginTop: '4px',
  borderRadius: '18px',
  borderTopLeftRadius: isowner === 'true' ? '18px' : '4px',
  borderTopRightRadius: isowner === 'true' ? '4px' : '18px',
  wordBreak: 'break-word',
  fontSize: '14px',
  lineHeight: '1.5',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  color: theme.palette.text.primary,
  maxWidth: 'fit-content'
}))

const TypingDot = styled('span')(({ theme }) => ({
  width: '4px',
  height: '4px',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0 2px',
  animation: 'typing 1.4s infinite ease-in-out',
  '&:nth-of-type(1)': { animationDelay: '0s' },
  '&:nth-of-type(2)': { animationDelay: '0.2s' },
  '&:nth-of-type(3)': { animationDelay: '0.4s' },
  '@keyframes typing': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' }
  }
}))

function CardActivitySection({ cardId, cardComments = [], OnAddCardComment, typingUser }) {
  const currentUser = useSelector(selectCurrentUser)

  const handleAddCardComment = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!event.target?.value) return

      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim()
      }

      socketIoInstance.emit('FE_USER_STOPPED_TYPING_COMMENT', {
        cardId: cardId,
        userDisplayName: currentUser?.displayName
      })

      OnAddCardComment(commentToAdd).then(() => {
        event.target.value = ''
      })
    }
  }

  const handleTypingComment = (e) => {
    if (e.target.value) {
      socketIoInstance.emit('FE_USER_TYPING_COMMENT', {
        cardId: cardId,
        userDisplayName: currentUser?.displayName
      })
    } else {
      socketIoInstance.emit('FE_USER_STOPPED_TYPING_COMMENT', {
        cardId: cardId,
        userDisplayName: currentUser?.displayName
      })
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Input section */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Avatar
          sx={{ width: 40, height: 40, border: '2px solid transparent', p: '2px', bgcolor: 'primary.main' }}
          alt={currentUser.username}
          src={currentUser?.avatar}
        />
        <TextField
          fullWidth
          placeholder="Write a comment..."
          variant="outlined"
          multiline
          size="small"
          onKeyDown={handleAddCardComment}
          onChange={handleTypingComment}
          onBlur={() => socketIoInstance.emit('FE_USER_STOPPED_TYPING_COMMENT', { cardId: cardId, userDisplayName: currentUser?.displayName })}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2c3e50' : '#f8f9fa',
              '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.1)' },
              '&:hover fieldset': { borderColor: 'primary.main' }
            }
          }}
        />
      </Box>

      {/* Typing indicator */}
      {typingUser && (
        <Box sx={{ ml: 7, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: '500' }}>
            {typingUser} is typing
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <TypingDot /><TypingDot /><TypingDot />
          </Box>
        </Box>
      )}

      {/* Comments list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cardComments.length === 0 && !typingUser && (
          <Box sx={{ textAlign: 'center', py: 3, opacity: 0.5 }}>
            <Typography variant="body2">No comments yet. Be the first to say something!</Typography>
          </Box>
        )}
        
        {cardComments.map((item, index) => {
          const isOwner = item.userId === currentUser._id
          return (
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1.5, 
                width: '100%',
                flexDirection: isOwner ? 'row-reverse' : 'row'
              }} 
              key={index}
            >
              <Tooltip title={item.userDisplayName}>
                <Avatar
                  sx={{ width: 36, height: 36, cursor: 'pointer', mt: 0.5 }}
                  alt={item.userDisplayName}
                  src={item.userAvatar}
                />
              </Tooltip>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwner ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {isOwner ? 'You' : item.userDisplayName}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>
                    {moment(item.commentedAt).fromNow()}
                  </Typography>
                </Box>
                
                <CommentBubble isowner={isOwner.toString()}>
                  {item.content}
                </CommentBubble>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default CardActivitySection
