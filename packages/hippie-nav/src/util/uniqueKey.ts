export function uniqueKey (key: string | symbol) {
  return String(key) + String(Math.random())
}