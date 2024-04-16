import { ALLENSLAVEDPAGE, ENSALVEDPAGE, ENSALVERSPAGE, TRANSATLANTICENSLAVERS } from "@/share/CONST_DATA"

export const checkPathPeople = (title: string) => {
    let url = ''
    if (title === "Enslaved" || title === "Esclavizados" || title === "Escravizados") {
        url = `${ENSALVEDPAGE}${ALLENSLAVEDPAGE}#people`
    } else if (title === "Enslavers" || title === "Esclavistas" || title === "Escravizadores") {
        url = `${ENSALVERSPAGE}${TRANSATLANTICENSLAVERS}#people`
    }
    return url
}
