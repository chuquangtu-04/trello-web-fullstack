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

    return isMatch
  })
}
