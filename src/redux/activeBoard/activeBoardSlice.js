import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { get } from '~/utils/httpRequest'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'


// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentActiveBoard: null,
  boardCreationDraft: null,
  filters: {
    keyword: '',
    memberIds: [],
    status: [],
    dueDateFilters: [],
    labelIds: []
  }
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const res = await get(`boards/${boardId}`)
    return res.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Lưu ý: ở đây luôn luôn cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1      dòng, đây là rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhãn dữ liệu vào reducer,
      // ở đây chúng ta gán nó ra một biến có nghĩa hơn
      let board = action.payload

      // Xử lý dữ liệu nếu cần thiết
      // ...

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      // Update nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload
      // Tìm dần từ board > column > card
      const column = state.currentActiveBoard.columns.find(column => column._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(card => card._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title
          /**
           * Giải thích đoạn dưới, các bạn mới lần đầu sẽ dễ bị lú :D
           * Đơn giản là dùng Object.keys để lấy toàn bộ các properties (keys) của incomingCard về một Array
           * rồi forEach nó ra.
           * Sau đó tuỳ vào trường hợp cần thì kiểm tra thêm còn không thì cập nhật ngược lại giá trị vào
           * card luôn như bên dưới.
           */
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    },
    setBoardCreationDraft: (state, action) => {
      const payload = action.payload || {}
      state.boardCreationDraft = { ...payload, FE_creationDraft: true }
    },
    updateFilters: (state, action) => {
      state.filters = action.payload
    },
    // Thêm label mới vào board
    addLabelToBoard: (state, action) => {
      if (state.currentActiveBoard) {
        if (!state.currentActiveBoard.labels) state.currentActiveBoard.labels = []
        state.currentActiveBoard.labels = action.payload
      }
    },
    // Cập nhật label trong board
    updateLabelInBoard: (state, action) => {
      if (state.currentActiveBoard) {
        state.currentActiveBoard.labels = action.payload
      }
    },
    // Xóa label khỏi board
    removeLabelFromBoard: (state, action) => {
      const labelId = action.payload
      if (state.currentActiveBoard) {
        state.currentActiveBoard.labels = (state.currentActiveBoard.labels || []).filter(l => l.id !== labelId)
        // Cũng xóa labelId khỏi tất cả card trong state
        state.currentActiveBoard.columns?.forEach(col => {
          col.cards?.forEach(card => {
            if (card.labelIds) {
              card.labelIds = card.labelIds.filter(id => id !== labelId)
            }
          })
        })
      }
    },
    removeCardFromBoard: (state, action) => {
      const { cardId, columnId } = action.payload
      const column = state.currentActiveBoard.columns.find(col => col._id === columnId)
      if (column) {
        column.cards = column.cards.filter(card => card._id !== cardId)
        column.cardOrderIds = column.cardOrderIds.filter(id => id !== cardId)
        
        // Nếu column rỗng sau khi xóa, cần tạo placeholder card
        if (isEmpty(column.cards)) {
          const placeholderCard = generatePlaceholderCard(column)
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        }
      }
    },
    moveCardInBoard: (state, action) => {
      const { cardId, columnId, targetColumnId, position } = action.payload
      const board = state.currentActiveBoard

      // 1. Tìm column hiện tại và column đích
      const currentColumn = board.columns.find(c => c._id === columnId)
      const targetColumn = board.columns.find(c => c._id === targetColumnId)

      if (!currentColumn || !targetColumn) return

      // 2. Tìm card cần di chuyển
      const card = currentColumn.cards.find(c => c._id === cardId)
      if (!card) return

      // 3. Xóa card khỏi column hiện tại
      currentColumn.cards = currentColumn.cards.filter(c => c._id !== cardId)
      currentColumn.cardOrderIds = currentColumn.cardOrderIds.filter(id => id !== cardId)

      // Xử lý placeholder cho column cũ nếu nó rỗng
      if (isEmpty(currentColumn.cards)) {
        const placeholder = generatePlaceholderCard(currentColumn)
        currentColumn.cards = [placeholder]
        currentColumn.cardOrderIds = [placeholder._id]
      }

      // 4. Cập nhật columnId mới cho card
      const movedCard = { ...card, columnId: targetColumnId }

      // 5. Thêm card vào column đích
      // Nếu column đích đang có placeholder card, xóa nó đi trước
      targetColumn.cards = targetColumn.cards.filter(c => !c.FE_placeholderCard)
      targetColumn.cardOrderIds = targetColumn.cardOrderIds.filter(id => !id.includes('placeholder'))

      targetColumn.cards.splice(position, 0, movedCard)
      targetColumn.cardOrderIds.splice(position, 0, cardId)
    },
    addCardToBoard: (state, action) => {
      const { card, position } = action.payload
      const column = state.currentActiveBoard.columns.find(c => c._id === card.columnId)
      if (column) {
        // Xóa placeholder nếu có
        column.cards = column.cards.filter(c => !c.FE_placeholderCard)
        column.cardOrderIds = column.cardOrderIds.filter(id => !id.includes('placeholder'))

        column.cards.splice(position, 0, card)
        column.cardOrderIds.splice(position, 0, card._id)
      }
    },
    toggleBoardStar: (state, action) => {
      if (state.currentActiveBoard) {
        state.currentActiveBoard.isStarred = action.payload
      }
    }
  },
  // ExtraReducer: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload chính là return res.data ở phía trên
      let board = action.payload

      // Thành viên trong cái board sẽ là gộp lại của 2 mảng owners và members
      board.FE_allUsers = board.owners.concat(board.members)


      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)],
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { 
  updateCurrentActiveBoard, 
  updateCardInBoard, 
  setBoardCreationDraft, 
  updateFilters, 
  addLabelToBoard, 
  updateLabelInBoard, 
  removeLabelFromBoard, 
  removeCardFromBoard,
  moveCardInBoard,
  addCardToBoard,
  toggleBoardStar
} = activeBoardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}
export const selectFilters = (state) => {
  return state.activeBoard.filters
}
// Cái file này tên là activeBoardSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer