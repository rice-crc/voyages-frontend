import { useQuery } from 'react-query';

import { fetchBlogAutoCompleted } from '@/fetch/blogFetch/fetchBlogAutoCompleted';
import { IRootFilterObject } from '@/share/InterfaceTypes';

export const useAutoBlogList = (dataSend: IRootFilterObject | undefined) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['autoListBlog', dataSend],
    queryFn: () => fetchBlogAutoCompleted(dataSend),
  });
  return { data, isLoading, isError };
};
