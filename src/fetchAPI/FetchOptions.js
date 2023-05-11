export const requestOptions = async()=>{
    const res = await fetch(`https://voyages3-api.crc.rice.edu/voyage/?hierarchical=false`,{
        method: "OPTIONS",
        headers: {'Authorization': 'Token ba4a9c10dd8685860fd97f47f505e39bc135528a'}
    })
    return res.json()
}

