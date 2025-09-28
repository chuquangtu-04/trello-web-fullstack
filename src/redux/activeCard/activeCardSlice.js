import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentActiveCard: null
}

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload // action.payload là chuẩn đặt tên
      // nhận dữ liệu vào reducer, ở đây chúng ta gắn nó ra một biến có nghĩa hơn
      // Xử lý dữ liệu cần thiết

      // Update lại dữ liệu currentActiveCard trong redux
      state.currentActiveCard = fullCard
    }
  },
  // ExtraReducer: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: () => {}
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}
// Cái file này tên là activeCardSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer