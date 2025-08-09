import Box from '@mui/material/Box'
import ListColumns from './ListColumns/listColumns'
import { mapOrder } from '~/utils/sorts'
import { arrayMove } from '@dnd-kit/sortable'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCarts/Cards/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {

  // Yêu cầu chuột di chuyển 10px thì mới hoạt động event, fix trường hợp click gọi event
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có
  // trải nghiệp trên mobie tốt nhấp, không bị bug

  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)


  const [orderedColumnState, setOrderedColumnState] = useState([])

  // Cùng một thời điểm chỉ có một phần tử đang kéo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnState(orderedColumn)
  }, [board])

  // Tìm một cái Column theo cardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì bước handleDragOver chúng ta sẽ
    // làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumnState.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // Trigger khi bắt đầu kéo (drap) một phần tử
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :ACTIVE_DRAG_ITEM_TYPE.COLUMN )
    setActiveDragItemData(event?.active?.data?.current)
  }
  // Trigger trong quá trình kéo (drap) một phần tử
  const handleOnDragOver = (event) => {
    // Không làm gì nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // Còn nếu kéo Cart thì xử lý thêm để có thể kéo card qua lại giữa column
    const { active, over } = event
    // Cần đam bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì
    // ( tránh crash trang )
    if (!active || !over.id) return

    // activeDraggingCardId là Card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId là card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại một trong hai column thì không làm gì hết, tránh cash trang web
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban
    // đầu của nó thì không làm gì cả
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó là vấn đề khác ở
    // (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumnState(prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        // Logic tính toán "CardIndex mới" ( trên hoặc dưới của overCard ) lấy chuẩn ra từ code của thư viên
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return – cập nhật lại OrderedColumnsState mới
        const nextColumn = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumn.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumn.find(column => column._id === overColumn._id)

        //nextActiveColumn: Column cũ
        if (nextActiveColumn) {
        // Lấy card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId )
          //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
        //nextOverColumn: column mới
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId )

          //Thêm Card đang kéo vào OverColumn theo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        return nextColumn
      })
    }


  }

  // Trigger khi kết thúc hành động kéo (drap) một phần tử => (drop)
  const handleDragEnd = (event) => {
    // console.log(event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log('Hành động kéo thả Card - Tạm thời không làm gì cả')
      return
    }

    const { active, over } = event
    // Kiểm tra nếu không tồn tại over kéo linh tính ra ngoài thi return luôn tránh lỗi
    if (!over.id) return

    // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      //Lấy vị trí cũ ( từ  active )
      const oldIndex = orderedColumnState.findIndex(c => c._id === active.id)
      //Lấy vị trí mới ( từ  over )
      const newIndex = orderedColumnState.findIndex(c => c._id === over.id)

      // Dùng arrayMove của thằng dnd-kit để sắp xếp lại column ban đầu
      // https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumn = arrayMove(orderedColumnState, oldIndex, newIndex)

      // Cập nhật lại state column ban đầu sau khi kéo thả
      setOrderedColumnState(dndOrderedColumn)
      // Cập nhập lại dự liệu lên db
      // const dndOrderedColumnIds = dndOrderedColumn.map(c => c._id)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  const customerDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleOnDragOver}
      onDragEnd={handleDragEnd}
      sensors={mySensors}
    >
      <Box sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#1976d2' : '#34495e'),
        width: '100%',
        height: (theme) => (theme.trello.boardContentHeight),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumnState}/>
        <DragOverlay dropAnimation={customerDropAnimation}>
          {activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/> }
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/> }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
