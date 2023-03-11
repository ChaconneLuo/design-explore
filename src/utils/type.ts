type MergeType<T> = {
    [K in keyof T]: T[K]
}
export type RequiredKeys<T, R extends keyof T> = MergeType<{ [P in keyof Omit<T, R>]: T[P] } & { [P in R]-?: T[P] }>;