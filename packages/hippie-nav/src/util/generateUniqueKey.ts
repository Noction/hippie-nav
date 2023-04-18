export function generateUniqueKey (key: string | symbol) {
  return String(key) + String(Math.random())
}