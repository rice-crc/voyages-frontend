import { useQuery } from "react-query";
import { fetchTableCellStructure } from "@/fetch/voyagesFetch/fetchTableCellStructure";


export const useTableCellStructure = (styleNameRoute?: string) => {

    const { data, isLoading, isError } = useQuery(
        ['tableCellStructure', styleNameRoute!],
        () => fetchTableCellStructure(styleNameRoute!)
    );
    return { data, isLoading, isError };
};
