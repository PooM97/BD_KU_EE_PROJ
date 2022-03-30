import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { request } from '../../scripts/request';
import 'react-circular-progressbar/dist/styles.css';
import './progressBar.css'
import { Prev } from 'react-bootstrap/esm/PageItem';

function ProgressBar({title, subtitle, max, min, width, styles}) {
    const [data, setData] = useState('')
    // useEffect(() => {
    //     async function getData() {
    //         const url = `/ts/read/limit/${subtitle}`,
    //         params = {limit: 1},
    //         data = await request("GET", url, params)
    //         console.log(data[title][0])
    //         setData(data[title][0]) 
    //     }
    //     getData();
    // }, [])
    return (   
        <div className="progressBar" style={{width: width}}>
            <p className='title'>{title}</p>
            <p className='subtitle'>{subtitle}</p>                      
            <CircularProgressbar 
                value={data} text={`${data}` } 
                strokeWidth={'5'}
                minValue={min} maxValue={max}
                styles={buildStyles(styles)}
                />
        </div> 
    )
}

export default ProgressBar