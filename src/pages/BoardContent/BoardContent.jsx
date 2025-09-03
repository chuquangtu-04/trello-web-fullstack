import {
  DndContext,
  DragOverlay,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  // rectIntersection,
  getFirstCollision,
  pointerWithin,
  // PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { cloneDeep, isEmpty } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { generatePlaceholderCard } from '~/utils/formatters'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCarts/Cards/Card'
import ListColumns from './ListColumns/listColumns'
import { CustomMouseSensor, CustomTouchSensor } from '~/CustomLibraries/customSensors'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumn, moveCardInColumn, moveCardOutColumn }) {


  // Yêu cầu chuột di chuyển 10px thì mới hoạt động event, fix trường hợp click gọi event
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  const mouseSensor = useSensor(CustomMouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(CustomTouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })


  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có
  // trải nghiệp trên mobie tốt nhấp, không bị bug

  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)


  const [orderedColumnState, setOrderedColumnState] = useState([])

  // Cùng một thời điểm chỉ có một phần tử đang kéo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng ( xử lý thuật toán phát hiện va chạm )
  const lastOverId = useRef(null)


  useEffect(() => {
    // Column đã được sắp xếp ở component cha cao nhất
    setOrderedColumnState(board.columns)
  }, [board])

  // Tìm một cái Column theo cardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì bước handleDragOver chúng ta sẽ
    // làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumnState.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }


  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumn = (active, over, activeColumn, overColumn,
    overCardId, activeDraggingCardId, activeDraggingCardData, status) => {
    const data = ( setOrderedColumnState(prevColumns => {
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

        // Thêm Placeholder nếu column rỗng bị kéo hết card đi, không còn cái nào
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      //nextOverColumn: column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId )

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa
        // hai column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId : nextOverColumn._id
        }

        //Thêm Card đang kéo vào OverColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xóa các Placeholder đi nêu trong card có ít nhất một dữ liệu thẻ card
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_placeholderCard)
        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumn
    }))
    if (status != 'dragOver') {
      const activeColumnId = oldColumnWhenDraggingCard._id
      const overColumnId = overColumn._id
      const CardActiveData = orderedColumnState.find(c => c._id === activeColumnId)
      const CardOverData = orderedColumnState.find(c => c._id === overColumnId)
      moveCardOutColumn(activeColumnId, overColumnId, CardActiveData, CardOverData, activeDraggingCardId)
    }
    return data
  }

  const handleDragStart = (event) => {
    // Trigger khi bắt đầu kéo (drap) một phần tử
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN )
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo (drap) một phần tử
  const handleOnDragOver = (event) => {
    // Không làm gì nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // Còn nếu kéo Cart thì xử lý thêm để có thể kéo card qua lại giữa column
    const { active, over } = event
    // Cần đam bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì
    // ( tránh crash trang )
    if (!active || !over) return
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
      const status = 'dragOver'
      moveCardBetweenDifferentColumn( active, over, activeColumn, overColumn,
        overCardId, activeDraggingCardId, activeDraggingCardData, status)
    }
  }

  // Trigger khi kết thúc hành động kéo (drap) một phần tử => (drop)
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      /// Cần đam bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì
      // ( tránh crash trang )
      if (!active || !over) return
      // activeDraggingCardId là Card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId là card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over

      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)


      // Nếu không tồn tại một trong hai column thì không làm gì hết, tránh cash trang web
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart)
      // chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị
      //  cập nhật một lần rồi.
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        const status ='dragEnd'
        moveCardBetweenDifferentColumn( active, over, activeColumn, overColumn,
          overCardId, activeDraggingCardId, activeDraggingCardData, status)
      } else {
        // Hành động kéo thả card trong cùng một column
        const { cards } = orderedColumnState.find(c => c._id === oldColumnWhenDraggingCard._id)
        //Lấy vị trí cũ ( từ  active )
        const oldCardIndex = cards.findIndex(card => card._id === active.id)
        //Lấy vị trí mới ( từ  over )
        const newCardIndex = cards.findIndex(card => card._id === over.id)


        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardsIds = dndOrderedCards.map(card => card._id)
        setOrderedColumnState(prevColumn => {
          const nextColumn = cloneDeep(prevColumn)
          // Tìm tới cái column mà chúng ta đang thả
          const targetColumn = nextColumn.find(c => c._id === oldColumnWhenDraggingCard._id)

          // Cập nhật lại hai giá trị mới là card và cardOrdeIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardsIds
          // Trả về giá trị state mới ( chuẩn vị trí )
          return nextColumn
        }
        )
        moveCardInColumn(dndOrderedCards, dndOrderedCardsIds, oldColumnWhenDraggingCard._id)
      }
    }

    // Kiểm tra nếu không tồn tại over kéo linh tính ra ngoài thi return luôn tránh lỗi
    if (!over.id) return

    // Xử lý kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        //Lấy vị trí cũ ( từ  active )
        const oldColumnIndex = orderedColumnState.findIndex(c => c._id === active.id)
        //Lấy vị trí mới ( từ  over )
        const newColumnIndex = orderedColumnState.findIndex(c => c._id === over.id)

        // Dùng arrayMove của thằng dnd-kit để sắp xếp lại column ban đầu
        // https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumn = arrayMove(orderedColumnState, oldColumnIndex, newColumnIndex)
        // Cập nhật lại state column ban đầu sau khi kéo thả
        // Vẫn gọi update State ở đây để tránh delay hoặc Flickring giao diện lúc kéo thả cần phải gọi lại api (small trick)
        setOrderedColumnState(dndOrderedColumn)

        //   * Gọi lên props function createNewColumn nằm ở component cha cao nhất (boards/_id.jsx)
        // * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ
        //   đưa dữ liệu Board ra ngoài Redux Global Store,
        // * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những
        //   component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
        // * – Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
        moveColumn(dndOrderedColumn)
      }
    }
    // Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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
  // Chúng ta sẽ custom lại chiến lược / thuật toán pháp hiện va chạm tối ưu cho việc kéo thả card giữa nhiều
  // column
  // args = arguments = các đối số tham số
  const collisionDetectionStrategy = useCallback((args) => {
    // Trường hợp kéo Column thì dùng thuật toán closetCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    // Tìm các điểm giao nhau, va chạm - intersettions với con trỏ
    const pointerIntersections = pointerWithin(args)
    // Fix triệt để cái bug flickering của thư viện Dnd-kit trong trường hợp sau:
    // -- Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
    if ( !pointerIntersections?.length ) return
    // const intersettions = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // Tìm overId đầu tiên trong đám intersections ở trên
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào
      // thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở đây dùng
      // closestCenter mình thấy mượt mà hơn.
      const checkColumn = orderedColumnState.find( c => c._id === overId)
      if (checkColumn) {
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter( container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumnState])
  return (
    <DndContext
      sensors={mySensors}
      // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì lúc này nó đang bị conflict giữa card và column),
      // chúng ta sẽ dùng closestCorners thay vì closestCenter
      // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleOnDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#1976d2' : '#34495e'),
        width: '100%',
        height: (theme) => (theme.trello.boardContentHeight),
        p: '10px 0'
      }}>
        <ListColumns
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          columns={orderedColumnState}/>
        <DragOverlay dropAnimation={customerDropAnimation}>
          {activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/> }
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/> }
        </DragOverlay>
      </Box>
    </DndContext>
  )}

export default BoardContent
