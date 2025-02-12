// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type RemoveFirst<T> = T extends [infer _, ...infer Rest] ? Rest : [];
