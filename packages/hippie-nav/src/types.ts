export interface HippieNavConfigRoute {
    name: string,
    aliases: string[]
    path: string
}

export type HippieNavConfig = HippieNavConfigRoute[]
