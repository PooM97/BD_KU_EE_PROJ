import React, { useEffect, useState } from "react";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import { request } from "../../scripts/request";
import './widget.css'

function Widget({sensor_id, upper, lower, set}) {
    const [widgetData, setWidgetData] = useState({
        sensorName: '',
        sensorID: sensor_id,
        unit: '',
        group: '',
        timestamp: '',
        value: '',
        icon: ''
    });
    async function requestData() {
        try {
            const sensorData = await request('GET', `/sensor/${sensor_id}`),
            ValueData = await request('GET', `/ts/limit/sensor/${sensor_id}`, {'limit': 1})
            let type = 'normal',
            icon = <RemoveIcon className="icon"/>              
            if (ValueData[sensorData.name][0] > upper && upper !== '') {
                type='upper'
                icon = <KeyboardArrowUpOutlinedIcon className="icon"/> 
            }
            else if (ValueData[sensorData.name][0] < lower && lower !== '') {
                type='lower'
                icon = <KeyboardArrowDownOutlinedIcon className="icon"/>    
            }
            console.log(sensorData)
            setWidgetData(prev => ({
                ...prev,
                sensorName: sensorData.name.toUpperCase(),
                group: sensorData.group.name.toUpperCase(),
                unit: sensorData.unit,
                timestamp: ValueData.timestamp[0].replace('T', ' '),
                value: ValueData[sensorData.name][0],
                type: type,
                icon: icon
            }))
        } catch(e) {
            setWidgetData(prev => ({
                ...prev,
                sensorName: "Sensor",
                group: "Not Found",          
                value: "None"           
            }))
        }
    }
            
        
    useEffect(()=>{
        const interval = setInterval(() => {  
            requestData()  
        }, 5000);
        requestData()
        return () => clearInterval(interval);
      }, []);        
    
    return (
        <div className="widget">
            <div className="left">
                <span className="title">{widgetData.sensorName}
                    <span className="subtitle">{widgetData.group}</span>
                </span>
                <span className={`body ${widgetData.type}`}>{widgetData.value} {widgetData.unit}
                    <span className="subbody">{widgetData.timestamp}</span>
                </span>
                <span className="link" onClick={() => set(widgetData.sensorID)}>Sensor ID : {widgetData.sensorID}</span>
            </div>
            <div className="right">
                <div className={`percent ${widgetData.type}`}>
                    { widgetData.icon }               
                </div>                
            </div>
        </div>
    )
}

export default Widget