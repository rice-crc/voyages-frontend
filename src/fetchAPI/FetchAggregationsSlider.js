
export const requestAggregations = async()=>{
    const res = await fetch(`https://voyages3-api.crc.rice.edu/voyage/aggregations`,{
        method: "POST",
        headers: {'Authorization': 'Token ba4a9c10dd8685860fd97f47f505e39bc135528a'}
    })
    return res.json()
}

