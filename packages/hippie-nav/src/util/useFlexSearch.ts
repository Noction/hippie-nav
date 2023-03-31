import {HippieNavConfig} from "../types";

export const useFlexSearch = (query: String, providedIndex: any, store: HippieNavConfig) => {

    const results = providedIndex.search(query)

    return results[0]?.result.map((id: number) => JSON.parse(JSON.stringify(store[id])))
}
