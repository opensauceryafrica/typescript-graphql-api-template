export enum Pager {
    Sort = -1,
    Limit = 10,
    Offset = 0,
}

export interface Page {
    limit?: number;
    offset?: number;
    sort?: string;
}
