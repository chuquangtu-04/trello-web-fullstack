import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import ReactMarkdown from 'react-markdown'
import { callAIChatAPI, createNewCardAPI } from '~/apis'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentActiveBoard, fetchBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'
import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button'
import AddTaskIcon from '@mui/icons-material/AddTask'

function AIChat() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi là AI Assistant của bạn. Tôi có thể giúp bạn phân tích Board, tóm tắt tiến độ hoặc tạo task mới. Bạn cần giúp gì không?', createdAt: new Date().toISOString() }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMsg = { role: 'user', content: message, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setMessage('')
    setIsLoading(true)

    try {
      const res = await callAIChatAPI(board._id, message)
      const assistantMsg = { role: 'assistant', content: res.response, createdAt: new Date().toISOString() }
      
      // Parse tasks if AI suggested them
      if (res.response.includes('---TASKS_JSON---')) {
        const parts = res.response.split('---TASKS_JSON---')
        assistantMsg.content = parts[0].trim() // Show only text to user
        try {
          const tasks = JSON.parse(parts[1].trim())
          assistantMsg.suggestedTasks = tasks
        } catch (e) {
          console.error('Failed to parse suggested tasks', e)
        }
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (error) {
      const errorMsg = { role: 'assistant', content: 'Rất tiếc, đã có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra API Key hoặc thử lại sau.', createdAt: new Date().toISOString() }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSuggestedTasks = async (tasks) => {
    if (!tasks || tasks.length === 0) return
    setIsLoading(true)
    try {
      // Lấy column đầu tiên của board để add task vào
      const firstColumnId = board.columnOrderIds[0]
      if (!firstColumnId) {
        toast.error('Board chưa có danh sách nào để thêm task!')
        return
      }

      // Tạo từng task (card)
      for (const task of tasks) {
        await createNewCardAPI({
          boardId: board._id,
          columnId: firstColumnId,
          title: task.title,
          description: task.description || ''
        })
      }
      
      toast.success(`Đã tạo thành công ${tasks.length} task mới!`)
      // Refresh board details to show new cards
      dispatch(fetchBoardDetailsAPI(board._id))
      
      // Add feedback to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Đã tạo thành công ${tasks.length} task mới vào danh sách đầu tiên của bạn! ✅`, 
        createdAt: new Date().toISOString() 
      }])
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo task từ AI.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {/* Floating Button */}
      {!isOpen && (
        <Tooltip title="AI Assistant">
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'primary.dark' },
              transition: 'all 0.3s'
            }}
          >
            <SmartToyIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            width: { xs: 'calc(100vw - 48px)', sm: 380 },
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>AI Workspace Assistant</Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5' }}>
            {messages.length === 1 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {['Tóm tắt dự án', 'Task nào quá hạn?', 'Gợi ý task mới'].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setMessage(prompt)
                      // Tự động gửi luôn nếu muốn
                    }}
                    sx={{ textTransform: 'none', borderRadius: 5, fontSize: '0.75rem' }}
                  >
                    {prompt}
                  </Button>
                ))}
              </Box>
            )}
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: msg.role === 'user' ? 'primary.main' : (theme.palette.mode === 'dark' ? '#333' : 'white'),
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    '& p': { m: 0 }
                  }}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  
                  {msg.suggestedTasks && (
                    <Box sx={{ mt: 2, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}>
                        AI đã gợi ý {msg.suggestedTasks.length} task mới. Bạn có muốn tạo chúng không?
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        startIcon={<AddTaskIcon />}
                        onClick={() => handleCreateSuggestedTasks(msg.suggestedTasks)}
                        fullWidth
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        Tạo các task này vào Board
                      </Button>
                    </Box>
                  )}
                </Paper>
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: theme.palette.mode === 'dark' ? '#333' : 'white', p: 1.5, borderRadius: '12px 12px 12px 0', width: 'fit-content' }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Box className="dot" sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%', animation: 'typing 1.4s infinite' }} />
                  <Box className="dot" sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%', animation: 'typing 1.4s infinite 0.2s' }} />
                  <Box className="dot" sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%', animation: 'typing 1.4s infinite 0.4s' }} />
                </Box>
                <style>
                  {`
                    @keyframes typing {
                      0%, 60%, 100% { transform: translateY(0); }
                      30% { transform: translateY(-4px); }
                    }
                  `}
                </style>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}`, display: 'flex', gap: 1, bgcolor: 'background.paper' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Hỏi AI về board này..."
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isLoading}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default AIChat
