# hippie-nav

[![NPM version](https://img.shields.io/npm/v/@noction/vue-highcharts.svg?style=flat)](https://npmjs.com/package/@noction/vue-highcharts)
[![NPM downloads](https://img.shields.io/npm/dm/@noction/vue-highcharts.svg?style=flat)](https://npmjs.com/package/@noction/vue-highcharts)
[![codecov](https://codecov.io/gh/Noction/vue-highcharts/branch/main/graph/badge.svg?token=C5NGW1BC2N)](https://codecov.io/gh/Noction/vue-highcharts)

This modern searchbar offers an intuitive and efficient way for users to explore your application by vue routes and your defined actions, .

## Install

***npm***

```bash
npm i @noction/hippie-nav
```

***yarn***

```bash
yarn add @noction/hippie-nav
```

***pnpm***

```bash
pnpm add @noction/hippie-nav
```

## Options object structure

The plugin supports the following configuration options:

| Option          | Description                                                             | Type                    |
|-----------------|-------------------------------------------------------------------------|-------------------------|
| `excludedPaths` | An array of paths to be excluded from processing.                       | Array<string \| RegExp> |
| `indexFields`   | An object specifying index fields for different entities.               | object                  |
|                 | - `routes`: An array of fields to be indexed for the 'routes' entity.   | Array<string>           |
|                 | - `actions`: An array of fields to be indexed for the 'actions' entity. | Array<string>           |
| `displayField`  | An object specifying the display field for the 'route' entity .         | object                  |
|                 | - `route`: The string field from meta is used for display name.         | string                  |
| `resultsLimit`  | A number indicating the maximum number of results to be returned.       | number                  |

## Action object structure

| Property      | Description                                                                                  | Type            |
|---------------|----------------------------------------------------------------------------------------------|-----------------|
| `name`        | The name of the action.                                                                      | `string`        |
| `action`      | The function that will be executed when the action is triggered.                             | `function`      |
| `aliases`     | (Optional) An array of alternative names or aliases for the action.                          | `Array<string>` |
| `description` | (Optional) An array of strings providing additional description or details about the action. | `Array<string>` |

## Usage as component

```vue
<template>
  <hippie-nav :options="options" :actions="actions"/>
</template>

<script setup lang="ts">
import { HippieNav } from 'hippie-nav'

const options = {
  excludedPaths: ['/login', '/register', /^\/admin$/],
  indexFields: {
    routes: ['name', 'path'],
    actions: ['name'],
  },
  displayField: {
    route: 'hippieNavMeta.title'
  },
  resultsLimit: 5
}

const actions = [
  {
    name: 'Show graph',
    action: () => {
      //handler
    },
  },
  {
    name: 'Log out',
    action: () => {
      //handler
    }
  }
]


</script>
```

### Props

| Name    | Type   | Description                                       | Required |                                                                      
|---------|--------|---------------------------------------------------|----------|
| options | Object | The hippie-nav options structure                  | false    |
| actions | Array  | The hippie-nav actions of action object structure | false    |

## Usage as plugin
```ts 
const app = createApp(App)

app.use(router)
app.use(HippieNav, {
  displayField: {
    route: 'hippieNavMeta.title'
  },
  excludedPaths: ['/login', '/register', /^\/admin$/],
  indexFields: {
    actions: ['name'],
    routes: ['name', 'path']
  },
  resultsLimit: 5
})
app.component('HippieBtnCollapse', HippieBtnCollapse)
app.mount('#app')
```

```vue
<template>
  <hippie-nav :actions="actions"/>
</template>

<script setup lang="ts">
import { HippieNav } from 'hippie-nav'

const actions = [
  {
    name: 'Show graph',
    action: () => {
      //handler
    },
  },
  {
    name: 'Log out',
    action: () => {
      //handler
    }
  }
]


</script>
```
### Props

| Name            | Type  | Description                                       | Required   |                                                                      
|-----------------|-------|---------------------------------------------------|------------|
| actions         | Array | The hippie-nav actions of action object structure | false      |
