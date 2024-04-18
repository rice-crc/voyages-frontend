// import { TextField, Typography } from '@mui/material';
// import 'react-select/dist/react-select.css'
// import 'react-virtualized/styles.css'
// import 'react-virtualized-select/styles.css'

// function AutoCompleteLazyLoad() {

//     const handleTextInputChange = (event: React.SyntheticEvent<Element, Event>) => {
//         console.log(event.target)
//     };

//     return (
//         <TextField
//             variant="outlined"
//             onChange={handleTextInputChange}
//             // value={selectedValue}
//             label={
//                 <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
//                     field
//                 </Typography>
//             }
//             placeholder="SelectedOptions"
//             style={{ marginTop: 20 }}
//         />

//     )



// }

// export default AutoCompleteLazyLoad;
import { border, margin, padding } from "@mui/system";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
function AutoCompleteLazyLoad() {
    const [dataSource, setDataSource] = useState([])
    const [hasMore, setHasMore] = useState<boolean>(true)

    const fetchMoreDataList = () => {
        if (dataSource.length < 20) {
            // MAKE API CALL
            setTimeout(() => {
                setDataSource(dataSource.concat(Array.from({ length: 20 })))
            }, 500)

        } else {
            setHasMore(false)
        }
    }
    const style = {
        border: '1px solid green',
        margin: 12,
        padding: 8
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={dataSource.length}
                loader={<p>Loading...</p>}
                // next={() => {
                //     setOffset(offset + limit)
                // }}
                next={fetchMoreDataList}
                scrollThreshold={0.9}
                endMessage={<p>No more items</p>}
                hasMore={hasMore}
            >
                {dataSource.map((item, index) => {
                    return <div style={style}>This is a div #{index + 1}</div>
                })}

            </InfiniteScroll>
        </div>

    )
}
export default AutoCompleteLazyLoad;