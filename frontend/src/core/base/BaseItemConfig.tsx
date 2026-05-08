export type BaseItemConfig<T> = {
    data: T;
    onItemClick?: () => void;
}