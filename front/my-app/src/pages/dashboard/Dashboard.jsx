import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Widget from '../../components/widget/widget';
import Chart from '../../components/chart/Chart';
import DataTable from '../../components/table/DataTable';
import { Container, Row, Col } from 'react-bootstrap';
import { chartSetup, tableSetup } from '../../scripts/setupData';
import './Dashboard.css';

function Dashboard() {
    const [widgetHtml, setwidgetHtml] = useState()
    const [sensorID, setSensorID] = useState()
    const [tableData, setTableData] = useState({rows: [], cols: []})
    const [chartData, setChartData] = useState({lebels: [], datasets: [{}]})
    function setup() {
        if (sensorID !== undefined) {
            const formData = {sensor: sensorID, limit: 10}
            chartSetup(formData, setChartData, 'limit')
            tableSetup(formData, setTableData, 'limit')
        }
    }
    useEffect(() => {
        const widgetData = JSON.parse(localStorage.getItem('widget'))
        if (widgetData === null) {
            window.location.replace("/setting")
        }
        setwidgetHtml(widgetData.map((row, idx) => {
            return (
                <Row key={idx} className='widgets'>
                    {row.map((value, idx2) => {                
                        return <Widget key={idx2} 
                            sensor_id={value.sensorID} 
                            upper={value.upper} 
                            lower={value.lower} 
                            set={setSensorID}
                        />
                    })}
                </Row>
            )
        }))        
    }, [])
    useEffect(() => {
        const interval = setInterval(() => {
            setup()
        }, 5000);
        setup()
        return () => clearInterval(interval);
    }, [sensorID])    
    return (
        <Container fluid>
            <Sidebar />
            <main>
                <h1 className='headerTitle'>Dashboard</h1>
                {widgetHtml}
                <Row className='charts'>
                    <Col sm>
                        <DataTable width='100%' height="500px" data={tableData}/>
                    </Col>
                    <Col sm>                    
                        <Chart data={chartData}/>
                    </Col>
                </Row>               
            </main>
        </Container>
        )
    }
    
export default Dashboard