import { DocumentSearchModel } from "./DocumentSearchBox";
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { DocumentItemInfo, createDocKey} from '@/utils/functions/documentWorkspace';

export interface DocumentSearchApiResult {
    matches: number;
    results: DocumentItemInfo[];
    error?: string;
}

export const mkDocumentSearchApiErrorResult = (
    msg: string
): DocumentSearchApiResult => ({ error: msg, matches: 0, results: [] });

export type DocumentSearchApi = (
    search: DocumentSearchModel
) => Promise<DocumentSearchApiResult>;

const docSearch: DocumentSearchApi = async (search) => {
    try {
        const response = await fetch(`${BASEURL}/docs/DocumentSearch/`, {
            method: 'POST',
            body: JSON.stringify(search),
            headers: {
                Authorization: AUTHTOKEN,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
       
        if (!data.page_size) {
            // Must be an error result.
            return mkDocumentSearchApiErrorResult(JSON.stringify(data));
        }
        const result: DocumentSearchApiResult = {
            matches: data.count,
            results: data.results.map((r: any) => {
                const {
                    thumbnail: thumb,
                    text_snippet: textSnippet,
                    bib,
                    title: label,
                    zotero_group_id,
                    zotero_item_id,
                } = r;
                return {
                    key: createDocKey(zotero_group_id, zotero_item_id),
                    label,
                    bib,
                    revision_number: 1,
                    thumb,
                    textSnippet
                };
            }),
        };
        return result;
    } catch (e) {
        return mkDocumentSearchApiErrorResult((e as Error)?.message);
    }
};

export default docSearch  