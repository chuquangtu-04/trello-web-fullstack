import moment from 'moment'

export const filterCards = (cards, filters, currentUser) => {
  if (!filters) return cards

  return cards.filter(card => {
    // Nếu card là placeholder thì mặc định không bị filter để giữ cấu trúc UI kéo thả
    if (card.FE_placeholderCard) return true

    let isMatch = true

    // 1. Lọc theo Keyword (tìm trong title và description)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      const titleMatch = card.title?.toLowerCase().includes(keyword)
      const descMatch = card.description?.toLowerCase().includes(keyword)
      isMatch = isMatch && (titleMatch || descMatch)
    }

    // 2. Lọc theo Thành viên (memberIds)
    if (filters.memberIds?.length > 0) {
      let memberMatch = false
      if (filters.memberIds.includes('no-member')) {
        memberMatch = memberMatch || (!card.memberIds || card.memberIds.length === 0)
      }
      if (filters.memberIds.includes('my-cards')) {
        memberMatch = memberMatch || card.memberIds?.includes(currentUser?._id)
      }
      // Mở rộng thêm cho các userIds cụ thể nếu cần
      const specificUserIds = filters.memberIds.filter(id => id !== 'no-member' && id !== 'my-cards')
      if (specificUserIds.length > 0) {
        memberMatch = memberMatch || specificUserIds.some(userId => card.memberIds?.includes(userId))
      }
      
      isMatch = isMatch && memberMatch
    }

    // 3. Lọc theo Trạng thái (status)
    if (filters.status?.length > 0) {
      let statusMatch = false
      if (filters.status.includes('completed')) {
        statusMatch = statusMatch || card.completed
      }
      if (filters.status.includes('uncompleted')) {
        statusMatch = statusMatch || !card.completed
      }
      isMatch = isMatch && statusMatch
    }

    // 4. Lọc theo Ngày hết hạn (dueDateFilters)
    if (filters.dueDateFilters?.length > 0) {
      let dateMatch = false
      const now = moment()

      if (filters.dueDateFilters.includes('noDueDate')) {
        dateMatch = dateMatch || !card.dueDate
      }

      if (card.dueDate) {
        const dueDate = moment(card.dueDate)

        if (filters.dueDateFilters.includes('overdue')) {
          dateMatch = dateMatch || (dueDate.isBefore(now) && !card.completed)
        }
        if (filters.dueDateFilters.includes('tomorrow')) {
          const startOfTomorrow = moment().add(1, 'day').startOf('day')
          const endOfTomorrow = moment().add(1, 'day').endOf('day')
          dateMatch = dateMatch || dueDate.isBetween(startOfTomorrow, endOfTomorrow, null, '[]')
        }
        if (filters.dueDateFilters.includes('nextWeek')) {
          const startOfNextWeek = moment().add(1, 'week').startOf('week')
          const endOfNextWeek = moment().add(1, 'week').endOf('week')
          dateMatch = dateMatch || dueDate.isBetween(startOfNextWeek, endOfNextWeek, null, '[]')
        }
        if (filters.dueDateFilters.includes('nextMonth')) {
          const startOfNextMonth = moment().add(1, 'month').startOf('month')
          const endOfNextMonth = moment().add(1, 'month').endOf('month')
          dateMatch = dateMatch || dueDate.isBetween(startOfNextMonth, endOfNextMonth, null, '[]')
        }
      }
      isMatch = isMatch && dateMatch
    }

    // 5. Lọc theo Nhãn (labelIds)
    if (filters.labelIds?.length > 0) {
      let labelMatch = false
      if (filters.labelIds.includes('no-label')) {
        labelMatch = labelMatch || (!card.labelIds || card.labelIds.length === 0)
      }

      const specificLabelIds = filters.labelIds.filter(id => id !== 'no-label')
      if (specificLabelIds.length > 0) {
        labelMatch = labelMatch || specificLabelIds.some(labelId => card.labelIds?.includes(labelId))
      }

      isMatch = isMatch && labelMatch
    }

    return isMatch
  })
}
