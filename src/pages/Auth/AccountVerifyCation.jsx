import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerifyCation() {
  // Lấy giá trị email và token từ Url
  const [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')

  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo một biến state để biết được verifi tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token ) {
      verifyUserAPI().then(() => {
        // Nếu như gọi API verify account thành công thì gán biến verified = true
        setVerified(true)
      })
        .catch(() => {})
    }
  }, [email, token])

  // Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to='/404'/>
  }

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption='Verifying your account...'/>
  }


  return (
    <Navigate to={`/login?verifiedEmail=${email}`}/>
  )
}

export default AccountVerifyCation