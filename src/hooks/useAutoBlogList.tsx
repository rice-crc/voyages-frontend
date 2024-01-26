import { fetchBlogAutoCompleted } from "@/fetch/blogFetch/fetchBlogAutoCompleted";
import { IRootFilterObject } from "@/share/InterfaceTypes";
import { useQuery } from "react-query";

export const useAutoBlogList = (dataSend: IRootFilterObject | undefined, styleName?: string) => {
    const { data, isLoading, isError } = useQuery(
        {
            queryKey: ['autoListBlog', dataSend],
            queryFn: () => fetchBlogAutoCompleted(dataSend)
        }
    );
    return { data, isLoading, isError };
};
