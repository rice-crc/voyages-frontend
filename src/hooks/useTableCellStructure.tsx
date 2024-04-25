import { useQuery } from "react-query";
import { useFetchTableCellStructure } from "./useFetchTableCellStructure";

export const useTableCellStructure = (styleNameRoute?: string) => {

    const { data, isLoading, isError } = useQuery(
        ['tableCellStructure', styleNameRoute!],
        () => useFetchTableCellStructure(styleNameRoute!)
    );
    return { data, isLoading, isError };
};
