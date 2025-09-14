import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Board from './pages/Boards/_id'
import Auth from './pages/Auth/Auth'
function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm
        // trong history của Browser
        // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình
        // duyệt giữa 2 trường hợp có replace hoặc không có.
        <Navigate to='/boards/68b177305ae24b6d3851be0d' replace={true} />
      }/>

      {/* Board detail */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={ <Auth/> } />
      <Route path='/register' element={ <Auth/> } />

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}
export default App
