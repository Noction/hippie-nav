export interface HippieNavConfigRoute {
    id: number,
    name: string,
    aliases: string[]
    path: string
}

export type HippieNavConfig = HippieNavConfigRoute[]
