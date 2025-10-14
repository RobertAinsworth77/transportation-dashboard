import { OrdeByFilterEntity } from '../../../domain/entities/OrdeByFilterEntity';
import './Table.scss';

interface TableComponentProps {
    title: string;
    data?: any[] | undefined;
    columns: {
        name: string,
        keyName: string,
    }[],
    defaultOrderBy?: OrdeByFilterEntity | undefined,
    searchByWord: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined, countryFilter?: string, cityFilter?: string) => void;
    page: number;
    itemsPerPage?: number;
    totalPages?: number;
    totalItems?: number;
    handleAdd?: ()=>Promise<void> | undefined;
    handleEdit?: (row: any) => Promise<void> | undefined;
    handleDelete?: (row: any) => Promise<void> | undefined;
    handleRowClick?: (row: any) => Promise<void> | undefined;
    showFilters?: boolean;
    filterOptions?: {countries: string[], cities: string[]};
    countryFilter?: string;
    cityFilter?: string;
}

export default TableComponentProps;
