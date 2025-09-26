// TrungQuanDev: https://youtube.com/@trungquandev
import { useState } from 'react'
import TextField from '@mui/material/TextField'

// Một Trick xử lý css khá hay trong việc làm UI UX khi cần ẩn hiện một cái input: Hiểu đơn giản là thay vì phải tạo biến State để chuyển đổi qua lại giữa thẻ Input và Text thông thường thì chúng ta sẽ CSS lại cho cái thẻ Input trông như text bình thường, chỉ khi click và focus vào nó thì style lại trở về như cái input ban đầu.
// Controlled Input trong MUI: https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
function ToggleFocusInput({ value, onChangedValue, inputFontSize = '16px', ...props }) {
  const [inputValue, setInputValue] = useState(value)

  // Xử lý hành 2 hành động:
  // + Người dùng click vào Title để chỉnh sửa, khi bôi đen để copy column không bị kéo theo

  // + Khắc phục trường hợp cũ khi click vào title chỉ có thể chính sửa title
  // + Sau khi chỉnh sửa xong có thể đưa chuột lên title và kéo được vào không hiện chỉnh sửa title
  const [handleMouse, setHandleMouse] = useState('')
  //
  const [mouseAction, setMouseAction] = useState('focus')

  // Blur là khi chúng ta không còn Focus vào phần tử nữa thì sẽ trigger hành động ở đây.
  const triggerBlur = () => {
    setHandleMouse('')
    // Support Trim cái dữ liệu State inputValue cho đẹp luôn sau khi blur ra ngoài
    setInputValue(inputValue.trim())

    // Nếu giá trị không có gì thay đổi hoặc Nếu user xóa hết nội dung thì set lại giá trị gốc ban đầu theo value từ props và return luôn không làm gì thêm
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }

    // Khi giá trị có thay đổi ok thì gọi lên func ở Props cha để xử lý
    onChangedValue(inputValue)
  }
  const handleOnClick =() => {
    setMouseAction('')
    setHandleMouse(true)
  }
  const actionFocus =() => {
    setMouseAction('focus')
  }
  return (
    <TextField
      onFocus={actionFocus}
      onDrop={e => e.preventDefault()}
      data-no-dnd={handleMouse}
      onClick={handleOnClick}
      id="toggle-focus-input-controlled"
      fullWidth
      variant='outlined'
      size="small"
      value={inputValue}
      onChange={(event) => { setInputValue(event.target.value) }}
      onBlur={triggerBlur}
      {...props}
      // Magic here :D
      sx={{
        '& label': {},
        '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          '& .MuiOutlinedInput-input': mouseAction === 'focus' ? { cursor: 'pointer' } : { cursor: 'text' },
          backgroundColor: mouseAction === 'focus' ? 'transparent' : (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
          // '& fieldset': { borderColor: 'primary.main' },
          '& fieldset': { borderColor: mouseAction === 'focus' ? 'transparent' : 'primary.main' }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        },
        '& .MuiOutlinedInput-input:hover': {
          cursor: 'pointer'
        }
      }}
    />
  )
}

export default ToggleFocusInput
