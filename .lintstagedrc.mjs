export default {
  // "*.{ts,js,vue}": ["cross-env NODE_ENV=production npm run lint:es", "npm run type:check"],
  "*.{css,scss,vue}": ["npm run lint:style"],
  '*.{ts,js,vue}': [
    () => {
      return ["cross-env NODE_ENV=production npm run lint:es", "npm run type:check"]
    },
  ],
}
