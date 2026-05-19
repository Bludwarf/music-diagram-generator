export function checkIsInteger(name: string, value: number) {
    check(name, value, 'be an integer', value => Math.floor(value) === value)
}

export function checkIsPositive(name: string, value: number) {
    check(name, value, 'be positive', value => value >= 0)
}

export function checkIsStrictlyPositive(name: string, value: number) {
    check(name, value, 'be strictly positive', value => value > 0)
}

function check(name: string, value: number, predicateName: string, predicate: (value: number) => boolean): void {
    if (!predicate(value)) {
        throw new Error(`${name} should ${predicateName} : ${value}`);
    }
}
