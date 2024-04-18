import { AFRICANORIGINS, AfricanOriginsTransAtlantic, ALLENSLAVED, AllEnslavedPeople, ALLVOYAGES, AllVoyagesTitle, ENSALVERSTYLE, ENSLAVEDTEXAS, EnslaversAllTrades, INTRAAMERICAN, IntraAmericanTitle, INTRAAMERICANTRADS, TEXBOUND, TRANSATLANTIC, TransAtlanticTitle, TRANSATLANTICTRADS } from "@/share/CONST_DATA"

export const checkHeaderTitleLanguages = (lang: string, routeName: string) => {

    let headersTitle = ''
    if (lang === 'en') {
        if (routeName === TRANSATLANTIC) {
            headersTitle = TransAtlanticTitle
        } else if (routeName === INTRAAMERICAN) {
            headersTitle = IntraAmericanTitle
        } else if (routeName === ALLVOYAGES) {
            headersTitle = AllVoyagesTitle
        } else if (routeName === ALLENSLAVED) {
            headersTitle = AllEnslavedPeople
        } else if (routeName === AFRICANORIGINS) {
            headersTitle = AfricanOriginsTransAtlantic
        } else if (routeName === ENSLAVEDTEXAS) {
            headersTitle = TEXBOUND
        } else if (routeName === TRANSATLANTICTRADS) {
            headersTitle = TransAtlanticTitle
        } else if (routeName === INTRAAMERICANTRADS) {
            headersTitle = IntraAmericanTitle
        } else if (routeName === ENSALVERSTYLE) {
            headersTitle = EnslaversAllTrades
        }
    } else if (lang === 'es') {
        if (routeName === TRANSATLANTIC) {
            headersTitle = 'Trans-Atlántico'
        } else if (routeName === INTRAAMERICAN) {
            headersTitle = 'Intra-americano'
        } else if (routeName === ALLVOYAGES) {
            headersTitle = 'Viajes'
        } else if (routeName === ALLENSLAVED) {
            headersTitle = "Todas las personas esclavizadas"
        } else if (routeName === AFRICANORIGINS) {
            headersTitle = "Orígenes Africanos/Transatlántico"
        } else if (routeName === ENSLAVEDTEXAS) {
            headersTitle = "Rumbo a Texas"
        } else if (routeName === TRANSATLANTICTRADS) {
            headersTitle = 'Trans-Atlántico'
        } else if (routeName === INTRAAMERICANTRADS) {
            headersTitle = 'Intra-americano'
        } else if (routeName === ENSALVERSTYLE) {
            headersTitle = "Todos los Lntercambios"
        }
    } else if (lang === 'pt') {
        if (routeName === TRANSATLANTIC) {
            headersTitle = 'Trans-Atlântico'
        } else if (routeName === INTRAAMERICAN) {
            headersTitle = 'Américas'
        } else if (routeName === ALLVOYAGES) {
            headersTitle = 'Viagens'
        } else if (routeName === ALLENSLAVED) {
            headersTitle = "Todas as pessoas escravizadas"
        } else if (routeName === AFRICANORIGINS) {
            headersTitle = "Origens africanas/Transatlântico"
        } else if (routeName === ENSLAVEDTEXAS) {
            headersTitle = "Rumo ao Texas"
        } else if (routeName === TRANSATLANTICTRADS) {
            headersTitle = "Trans-Atlântico"
        } else if (routeName === INTRAAMERICANTRADS) {
            headersTitle = "Intra-americano"
        } else if (routeName === ENSALVERSTYLE) {
            headersTitle = "Todos os Negócios"
        }
    }
    return headersTitle
}