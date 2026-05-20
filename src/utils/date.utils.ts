export const isToday = (dateStr: string): boolean => {
  if (!dateStr) return false
  const today = new Date()
  const date = new Date(dateStr)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const isOverdue = (dateStr: string): boolean => {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}

export const formatRelativeDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  
  // Format as short date string e.g. "Oct 12, 2023"
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
