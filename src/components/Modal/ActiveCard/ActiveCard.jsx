import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import { useDispatch, useSelector } from 'react-redux'
import { clearAndHideCurrentActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentActiveCard, selectIsShowModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailAPI, uploadFileAPI, createLabelAPI, updateLabelAPI, deleteLabelAPI } from '~/apis'
import { updateCardInBoard, selectCurrentActiveBoard, addLabelToBoard, updateLabelInBoard, removeLabelFromBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import CardAttachmentSection from './CardAttachmentSection'
import LabelBadge from './Labels/LabelBadge'
import LabelPicker from './Labels/LabelPicker'
import DatePickerPopover from './Dates/DatePickerPopover'
import DateBadge from './Dates/DateBadge'
import { useConfirm } from 'material-ui-confirm'
import MoveCardModal from './MoveCardModal'
import CopyCardModal from './CopyCardModal'

import { styled } from '@mui/material/styles'
import { CARD_MEMBERS_ACTIONS } from '~/utils/constants'
import { useState } from 'react'
import { archiveCardAPI, moveCardAPI, copyCardAPI } from '~/apis'
import { removeCardFromBoard, moveCardInBoard, addCardToBoard } from '~/redux/activeBoard/activeBoardSlice'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const boardLabels = activeBoard?.labels || []

  // State cho LabelPicker
  const [labelAnchorEl, setLabelAnchorEl] = useState(null)
  const isLabelPickerOpen = Boolean(labelAnchorEl)

  // State cho DatePicker
  const [dateAnchorEl, setDateAnchorEl] = useState(null)
  const isDatePickerOpen = Boolean(dateAnchorEl)

  // State cho MoveCardModal
  const [moveAnchorEl, setMoveAnchorEl] = useState(null)
  const isMoveModalOpen = Boolean(moveAnchorEl)

  // State cho CopyCardModal
  const [copyAnchorEl, setCopyAnchorEl] = useState(null)
  const isCopyModalOpen = Boolean(copyAnchorEl)

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
    // setIsOpen(false)
  }

  // Func dùng chung cho các trường hợp update card title, description, cover, comment...
  const callApiUpdateCard = async (updateData) => {
    const updateCard = await updateCardDetailAPI(activeCard._id, updateData)

    // B1: Cập nhật lại cái card đang active trong modal hiện tại
    dispatch(updateCurrentActiveCard(updateCard))
    // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
    dispatch(updateCardInBoard(updateCard))

    return updateCard
  }

  const onUpdateCardTitle = (newTitle) => {
    // Gọi API...
    callApiUpdateCard({ title: newTitle })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onUploadCardCover = async (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      { pending: 'Updating...' }
    )
  }

  const onUploadCardAttachment = async (event) => {
    const file = event.target?.files[0]
    if (!file) return

    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }

    try {
      const uploadResult = await uploadFileAPI(file)
      const newAttachmentToAdd = {
        url: uploadResult.url,
        fileName: file.name
      }
      toast.promise(
        callApiUpdateCard({ newAttachmentToAdd }).finally(() => event.target.value = ''),
        { pending: 'Uploading attachment...', success: 'Attachment added!' }
      )
    } catch (error) {
      toast.error('Failed to upload attachment')
    }
  }

  const onDeleteCardAttachment = (attachmentUrl) => {
    toast.promise(
      callApiUpdateCard({ attachmentToDelete: { url: attachmentUrl } }),
      { pending: 'Deleting attachment...', success: 'Attachment deleted!' }
    )
  }

  // Dùng async await ở đây để component con CardActivitySection
  //  chờ và nếu thành công thì mới clear thẻ input comment
  const OnAddCardComment = async (newCommentToAdd) => {
    await callApiUpdateCard({ newCommentToAdd })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }

  // ============================================================
  // Label handlers
  // ============================================================
  const handleOpenLabelPicker = (e) => setLabelAnchorEl(e.currentTarget)
  const handleCloseLabelPicker = () => setLabelAnchorEl(null)

  const onToggleLabel = async (labelId) => {
    // Optimistic update
    const currentLabelIds = activeCard?.labelIds || []
    const isRemoving = currentLabelIds.includes(labelId)
    const newLabelIds = isRemoving
      ? currentLabelIds.filter(id => id !== labelId)
      : [...currentLabelIds, labelId]
    const optimisticCard = { ...activeCard, labelIds: newLabelIds }
    dispatch(updateCurrentActiveCard(optimisticCard))
    dispatch(updateCardInBoard(optimisticCard))
    // Gọi API
    try {
      const updated = await updateCardDetailAPI(activeCard._id, { toggleLabelId: labelId })
      dispatch(updateCurrentActiveCard(updated))
      dispatch(updateCardInBoard(updated))
    } catch (err) {
      // Revert nếu lỗi
      dispatch(updateCurrentActiveCard(activeCard))
      dispatch(updateCardInBoard(activeCard))
    }
  }

  const onCreateLabel = async (data) => {
    try {
      const result = await createLabelAPI(activeBoard._id, data)
      dispatch(addLabelToBoard(result.labels))
      // Tự động gán label vừa tạo vào card
      await onToggleLabel(result.label.id)
    } catch (err) {
      // error handled by axios interceptor
    }
  }

  const onUpdateLabel = async (labelId, data) => {
    try {
      const result = await updateLabelAPI(activeBoard._id, labelId, data)
      dispatch(updateLabelInBoard(result.labels))
    } catch (err) { }
  }

  const onDeleteLabel = async (labelId) => {
    try {
      await deleteLabelAPI(activeBoard._id, labelId)
      dispatch(removeLabelFromBoard(labelId))
      if (activeCard?.labelIds?.includes(labelId)) {
        const updated = { ...activeCard, labelIds: activeCard.labelIds.filter(id => id !== labelId) }
        dispatch(updateCurrentActiveCard(updated))
        dispatch(updateCardInBoard(updated))
      }
    } catch (err) { }
  }

  // ============================================================
  // Date handlers
  // ============================================================
  const handleOpenDatePicker = (e) => setDateAnchorEl(e.currentTarget)
  const handleCloseDatePicker = () => setDateAnchorEl(null)

  const onSaveDates = async (dateData) => {
    const updatedCard = { ...activeCard, ...dateData }
    dispatch(updateCurrentActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))
    try {
      await updateCardDetailAPI(activeCard._id, dateData)
    } catch (err) {
      dispatch(updateCurrentActiveCard(activeCard))
      dispatch(updateCardInBoard(activeCard))
    }
    handleCloseDatePicker()
  }

  const onRemoveDates = async () => {
    const dateData = { startDate: null, dueDate: null, dueTime: null, reminder: null, repeat: null, completed: false }
    const updatedCard = { ...activeCard, ...dateData }
    dispatch(updateCurrentActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))
    try {
      await updateCardDetailAPI(activeCard._id, dateData)
    } catch (err) {
      dispatch(updateCurrentActiveCard(activeCard))
      dispatch(updateCardInBoard(activeCard))
    }
    handleCloseDatePicker()
  }

  const onToggleComplete = async () => {
    const updatedCard = { ...activeCard, completed: !activeCard.completed }
    dispatch(updateCurrentActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))
    try {
      await updateCardDetailAPI(activeCard._id, { completed: updatedCard.completed })
    } catch (err) {
      dispatch(updateCurrentActiveCard(activeCard))
      dispatch(updateCardInBoard(activeCard))
    }
  }

  const confirmArchiveCard = useConfirm()
  const handleArchiveCard = () => {
    confirmArchiveCard({
      title: 'Delete Card?',
      description: 'Are you sure you want to delete this card? It will be moved to the Archive.',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(async () => {
      // Optimistic update: Xóa card khỏi board state ngay lập tức
      dispatch(removeCardFromBoard({ cardId: activeCard._id, columnId: activeCard.columnId }))
      
      // Đóng modal card detail
      handleCloseModal()

      // Gọi API archive
      try {
        await archiveCardAPI(activeCard._id)
        toast.success('Đã chuyển thẻ vào mục Lưu trữ', {
          // Bonus: Nút Undo
          action: {
            label: 'Undo',
            onClick: () => {
              // Logic khôi phục nhanh nếu cần, nhưng hiện tại ta tập trung vào Archive trước
              toast.info('Vào Menu > Mục đã lưu trữ để khôi phục.')
            }
          }
        })
      } catch (err) {
        // Nếu lỗi thì fetch lại board để đồng bộ lại (hoặc revert state nếu phức tạp hơn)
        // Ở đây đơn giản là toast lỗi
      }
    }).catch(() => {})
  }

  const handleOpenMoveModal = (e) => setMoveAnchorEl(e.currentTarget)
  const handleCloseMoveModal = () => setMoveAnchorEl(null)

  const onMoveCard = async (moveData) => {
    const isDifferentBoard = moveData.targetBoardId !== moveData.boardId

    if (isDifferentBoard) {
      // Nếu khác board: Xóa card khỏi board hiện tại và đóng modal ngay lập tức
      dispatch(removeCardFromBoard({ cardId: activeCard._id, columnId: activeCard.columnId }))
      handleCloseModal()
      toast.success('Đã chuyển thẻ sang bảng mới thành công!')
    } else {
      // Nếu cùng board: Optimistic update
      dispatch(moveCardInBoard(moveData))
      // Nếu chuyển sang column khác, cập nhật lại columnId cho activeCard trong modal
      if (moveData.columnId !== moveData.targetColumnId) {
        dispatch(updateCurrentActiveCard({ ...activeCard, columnId: moveData.targetColumnId }))
      }
      toast.success('Đã di chuyển thẻ thành công')
    }

    try {
      await moveCardAPI(activeCard._id, moveData)
    } catch (err) {
      // Nếu lỗi, có thể cần fetch lại board để đồng bộ
    }
  }

  const handleOpenCopyModal = (e) => setCopyAnchorEl(e.currentTarget)
  const handleCloseCopyModal = () => setCopyAnchorEl(null)

  const onCopyCard = async (copyData) => {
    try {
      const newCard = await copyCardAPI(activeCard._id, copyData)
      dispatch(addCardToBoard({ card: newCard, position: copyData.position }))
      toast.success('Đã sao chép thẻ thành công')
    } catch (err) {
      // Lỗi được xử lý bởi interceptor
    }
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>
        {
          activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
            />
          </Box>
        }

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>

            {/* Dates section */}
            {activeCard?.dueDate && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Due date</Typography>
                <DateBadge
                  card={activeCard}
                  interactive
                  onToggleComplete={onToggleComplete}
                  onClick={handleOpenDatePicker}
                />
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            {/* Labels section */}
            {(activeCard?.labelIds?.length > 0) && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <LocalOfferOutlinedIcon />
                  <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Labels</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {(activeCard.labelIds || []).map(lid => {
                    const label = boardLabels.find(l => l.id === lid)
                    return label ? <LabelBadge key={lid} label={label} animate /> : null
                  })}
                </Box>
              </Box>
            )}

            <CardAttachmentSection
              cardAttachments={activeCard?.attachments}
              onDeleteCardAttachment={onDeleteCardAttachment}
            />

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                OnAddCardComment={OnAddCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/*Feature 05: Xử lý hành động bản thân user tự join vào card
                Nếu user hiện tại đang đăng nhập chưa thuộc mảng memberIds của card thì mới cho hiện nút Join ra
                Khi Click vào Join thì nó sẽ luôn là hành động ADD  */}
              {
                activeCard?.memberIds.includes(currentUser._id)
                  ?
                  null
                  : <SidebarItem
                    className="active"
                    onClick={() => onUpdateCardMembers({
                      userId: currentUser._id,
                      action: CARD_MEMBERS_ACTIONS.ADD
                    })}
                  >
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    Join
                  </SidebarItem>
              }

              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem className="active" component="label">
                <AttachFileOutlinedIcon fontSize="small" />
                Attachment
                <VisuallyHiddenInput type="file" onChange={onUploadCardAttachment} />
              </SidebarItem>
              {/* Feature Labels Picker */}
              <SidebarItem className="active" onClick={handleOpenLabelPicker}>
                <LocalOfferOutlinedIcon fontSize="small" />
                Labels
              </SidebarItem>
              <LabelPicker
                anchorEl={labelAnchorEl}
                isOpen={isLabelPickerOpen}
                onClose={handleCloseLabelPicker}
                boardLabels={boardLabels}
                cardLabelIds={activeCard?.labelIds || []}
                onToggle={onToggleLabel}
                onCreateLabel={onCreateLabel}
                onUpdateLabel={onUpdateLabel}
                onDeleteLabel={onDeleteLabel}
              />
              <SidebarItem className="active" onClick={handleOpenDatePicker}>
                <WatchLaterOutlinedIcon fontSize="small" />
                Dates
              </SidebarItem>
              <DatePickerPopover
                anchorEl={dateAnchorEl}
                isOpen={isDatePickerOpen}
                onClose={handleCloseDatePicker}
                card={activeCard}
                onSave={onSaveDates}
                onRemove={onRemoveDates}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem onClick={handleOpenMoveModal}><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
              <SidebarItem onClick={handleOpenCopyModal}><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem>
              {/* <SidebarItem><AutoAwesomeOutlinedIcon fontSize="small" />Make Template</SidebarItem> */}
              <SidebarItem onClick={handleArchiveCard}><ArchiveOutlinedIcon fontSize="small" />Delete Card</SidebarItem>
              <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
            </Stack>

            <MoveCardModal
              isOpen={isMoveModalOpen}
              onClose={handleCloseMoveModal}
              anchorEl={moveAnchorEl}
              card={activeCard}
              onMove={onMoveCard}
            />

            <CopyCardModal
              isOpen={isCopyModalOpen}
              onClose={handleCloseCopyModal}
              anchorEl={copyAnchorEl}
              card={activeCard}
              onCopy={onCopyCard}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
