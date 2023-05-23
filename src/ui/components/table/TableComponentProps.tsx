import './Table.scss';
interface TableComponentProps {
    title: string;
    data?: any[] | undefined;
    columns: {
        name: string,
        keyName: string,
    }[],
    searchByWord: (word: string, page: number, itemsPerPage: number) => void;
    page: number;
    itemsPerPage?: number;
    totalPages?: number;
    totalItems?: number;
    handleAdd?: ()=>Promise<void> | undefined;
    handleEdit?: (row: any) => Promise<void> | undefined;
    handleDelete?: (row: any) => Promise<void> | undefined;
    handleRowClick?: (row: any) => Promise<void> | undefined;
}

export default TableComponentProps;
