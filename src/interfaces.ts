export type PromiseFunction = (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => void
export type OnProgressFunction = (
    doneCount: number,
    remainingCount: number
) => void;

