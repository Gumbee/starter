type SetAction<T> = ((state: T) => Partial<T>) | Partial<T>;

export type Getter<T> = () => T;
export type Mutator<T> = (fn: SetAction<T>) => void;
