export const isValidUuid = (uuid: any): boolean => {
  if (typeof uuid !== 'string') return false
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(uuid)) return false
  return true
}

import { v4 } from 'uuid'

export const randomBoolean = () => (Math.random() > 0.5 ? true : false)
export const generateId = () => v4()
