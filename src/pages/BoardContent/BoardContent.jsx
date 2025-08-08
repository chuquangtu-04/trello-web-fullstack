import Box from '@mui/material/Box'
import ListColumns from './ListColumns/listColumns'
import { mapOrder } from '~/utils/sorts'
import { arrayMove } from '@dnd-kit/sortable'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
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

  const handleDragStart = (event) => {
    // Trigger khi bắt đầu kéo (drap) một phần tử
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :ACTIVE_DRAG_ITEM_TYPE.COLUMN )
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger khi kết thúc hành động kéo (drap) một phần tử => (drop)
  const handleDragEnd = (event) => {
    // console.log(event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over kéo linh tính ra ngoài thi return luôn tránh lỗi
    if (!over.id) return

    // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      //Lấy vị trí cũ ( từ  active )
      const oldIndex = orderedColumnState.findIndex(c => c._id === active.id)
      //Lấy vị trí mới ( từ  over )
      const newIndex = orderedColumnState.findIndex(c => c._id === over.id)

      // console.log('oldIndex: ',oldIndex)
      // console.log('newIndex: ',newIndex)


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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={mySensors}>
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
