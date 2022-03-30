import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './chart.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

function Chart({data}) {
    return (
        <div className='chart'>
            <div className='top'>
                <h1 className='title'>Chart</h1>
            </div>
            <div className='bottom'>
                <Line            
                    data={{
                        labels: data.labels,
                        datasets: data.datasets                        
                    }}  
                    options={
                        { 
                            maintainAspectRatio: false,
                            interaction: {
                                mode: 'index',
                                intersect: false,
                            },                           
                        }
                    }
                    width={'100%'}                           
                />
            </div>
        </div>
    )
}

export default Chart