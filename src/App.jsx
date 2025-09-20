import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Board from './pages/Boards/_id'
import Auth from './pages/Auth/Auth'
import AccountVerifyCation from './pages/Auth/AccountVerifyCation'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 *
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRouter = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true}/>
  return <Outlet/>
}
function App() {
  const currentUser = useSelector(selectCurrentUser)

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

      {/* Protected Routes (Hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
      <Route element={<ProtectedRouter user={currentUser}/>}>
        {/* <Outlet/> của react-router-dom sẽ chạy vào các child router trong này */}
        {/* Board detail */}
        <Route path='/boards/:boardId' element={<Board />} />

        {/* User Setting */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={ <Auth/> } />
      <Route path='/register' element={ <Auth/> } />
      <Route path='/account/verification' element={<AccountVerifyCation/>}/>

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}
export default App
