export interface HippieNavConfigRoute {
    name: string,
    aliases: string[]
    path: string
}

export type HippieNavConfig = HippieNavConfigRoute[]

export const config: HippieNavConfig = [
    {name: 'Home Page', aliases: ['home', 'main'], path: '/'},
    {name: 'About page', aliases: ['about', 'second'], path: '/about'}
]
