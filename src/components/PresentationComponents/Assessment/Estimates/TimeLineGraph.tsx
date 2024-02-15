import { getMobileMaxHeight, getMobileMaxWidth, maxWidthSize } from '@/utils/functions/maxWidthSize';
import { Grid } from '@mui/material';
import Plot from 'react-plotly.js';
import { useWindowSize } from '@react-hook/window-size';

const TimeLineGraph = () => {

    const [width, height] = useWindowSize();
    const maxWidth = maxWidthSize(width);
    return (
        <div>
            <Grid>
                <Plot
                    data={[]}
                    layout={{
                        width: getMobileMaxWidth(maxWidth),
                        height: getMobileMaxHeight(height),
                        title: 'Timeline: Number of Captives Embarked and Disembarked per Year',
                        font: {
                            family: 'Arial, sans-serif',
                            size: maxWidth < 400 ? 7 : 10,
                            color: '#333333',
                        },
                        xaxis: {
                            title: {
                                text: '',
                            },
                            fixedrange: true,
                        },
                        yaxis: {
                            title: {
                                text: '',
                            },
                            fixedrange: true,
                        },
                    }}
                    config={{ responsive: true }}
                />
            </Grid>
        </div>
    )
}

export default TimeLineGraph;