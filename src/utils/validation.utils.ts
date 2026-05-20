export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Invalid email format'
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export const validateRequired = (value: string | any[], fieldName: string): string | null => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return `${fieldName} is required`
  }
  return null
}
