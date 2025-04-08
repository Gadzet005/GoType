/**
 * if it throws than it should be a bug
 */
export class Panic extends Error {
    constructor(message?: string) {
        super(message ?? "");
        this.name = "Panic";
    }

    toString(): string {
        return `Panic: ${this.message}`;
    }
}

export function requireTrue(condition: boolean, message?: string) {
    if (!condition) {
        throw new Panic(message);
    }
}

export function requireFalse(condition: boolean, message?: string) {
    if (condition) {
        throw new Panic(message);
    }
}

export function requireEqual(a: any, b: any, message?: string) {
    if (a !== b) {
        throw new Panic(message);
    }
}

export function requireIn(a: any, b: any[], message?: string) {
    if (!b.includes(a)) {
        throw new Panic(message);
    }
}
