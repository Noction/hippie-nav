import {HippieNavConfig} from "../types";

export const useFlexSearch = (query: String, providedIndex: any, store: HippieNavConfig) => {

    const results = providedIndex.search(query)
    console.log(results[0]?.result.map((id: number) => JSON.parse(JSON.stringify(store[id]))))
    return results[0]?.result.map((id: number) => JSON.parse(JSON.stringify(store[id])))
}
