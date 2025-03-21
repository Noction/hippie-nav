declare module '*.vue' {
  import type { DefineComponent } from 'vue-demi'

  const component: DefineComponent<object, object, unknown>
  export default component
}
