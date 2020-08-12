export interface IGuidedDevItem {
    id: string,
    messages: {
        title: string,
        description: string
    },
    action: {}
}

export interface IGuidedDevCollectionItem {
    id: string,
    order: number
}

export interface IGuidedDevCollection {
    id: string,
    messages: {
        title: string,
        description: string
    },
    items: IGuidedDevCollectionItem[]
}
