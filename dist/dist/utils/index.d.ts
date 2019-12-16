declare var List: ({
    id: number;
    content: string;
    isvirtual: boolean;
    class: string;
    award_id: number;
    name: string;
    rate: string;
    sum: string;
    background: string;
} | {
    id: number;
    content: string;
    isvirtual: boolean;
    class: string;
    award_id: string;
    name: string;
    rate: string;
    sum: string;
    background: string;
})[];
export default List;
