export type HippieNavConfig = HippieNavConfigRoute[]

export interface HippieNavConfigRoute {
    id: number,
    name: string,
    aliases: string[]
    path: string
}
