export type ActiveKey = {
    name: string,
    refCount: number,
}

export type KeyboardState = {
    activeKeys: ActiveKey[],
}

export type ActionType = {
    type: 'ACTIVE_KEY' | 'DEACTIVE_KEY',
    key: string
}

export type KeyboardRange = {
    lowerKey: string,
    higherKey: string,
}
