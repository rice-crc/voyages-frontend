import { AFRICANORIGINSPAGE, ENSALVEDPAGE, ENSALVERSPAGE, TRANSATLANTICENSLAVERS } from "@/share/CONST_DATA"

export const checkPathPeople = (title: string) => {
    let url = ''
    if (title === "Enslaved" || title === "Esclavizados" || title === "Escravizados") {
        url = `${ENSALVEDPAGE}${AFRICANORIGINSPAGE}#people`
    } else if (title === "Enslavers" || title === "Esclavistas" || title === "Escravizadores") {
        url = `${ENSALVERSPAGE}${TRANSATLANTICENSLAVERS}#people`
    }
    return url
}
