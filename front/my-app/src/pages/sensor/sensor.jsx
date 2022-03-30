import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import Sidebar from '../../components/sidebar/Sidebar'
import {Link} from "react-router-dom"
import { request } from '../../scripts/request'
import './sensor.css'

async function requestGroupOption(setOption) {  
    try {
        const res = await request("GET", "/group/all")
        res.unshift({id: '-', name: "--  Please select  --"})
        setOption(res.map((element, index) => <option key={index} value={element.id}>{element.name}</option>))
    } catch(e) {
        console.log(e)
    }
}

async function requestSensor(groupID, set) {
    try {
        let sensors;
        if (groupID === '-') {
            sensors = await request("GET", `/sensor/all`)
        }
        else {
            sensors = await request("GET", `/sensor/group/${groupID}`)
        }
        set(sensors.map(s => {
            return (
                <Form key={s.id}className='sensorForm'>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                        <Form.Label column sm="2">
                            ID
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={s.id} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                        <Form.Label column sm="2">
                            Name
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={s.name} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                        <Form.Label column sm="2">
                            Unit
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control plaintext readOnly defaultValue={s.unit} />
                        </Col>
                    </Form.Group>
                    <Link to={`/sensor/${s.id}`} style={{ textDecoration: 'none' }}>Edit</Link>                    
                    <hr />
                </Form>
            )
        }))
    } catch(e) {
        console.log(e)
    }
}

function Sensor() {
    const [groupOption, setGroupOption] = useState([])
    const [sensorData, setSensorData] = useState([])
    const [groupID, setGroupID] = useState('-')

    function handleChange(event) {
        setGroupID(event.target.value)
        requestSensor(event.target.value, setSensorData)
    }   
    useEffect(()=>{
        requestGroupOption(setGroupOption)
        requestSensor(groupID, setSensorData)
    }, []) 
    return (
    <div>
        <Sidebar />
        <main>
            <div className='sensorPage'>
                <h1>
                    Group
                    <Button 
                            style={{width: '50px', height: '28px',marginLeft: '15px'}}
                            variant="success"
                            onClick={() => window.location.replace(`/sensor/group/add`)}                                                
                        >add
                    </Button>  
                </h1>
                <hr />
                <Row>
                    <Col style={{maxWidth: '500px'}}>
                        <Form.Select
                            id="group-select"      
                            onChange={handleChange}
                            name="group"                   
                        >
                            {groupOption}                            
                        </Form.Select>
                        <h5 style={{marginTop: '10px'}}>Group ID : {groupID}</h5>
                    </Col>
                    <Col>
                        <Button 
                            style={{width: '60px'}}
                            variant="primary"
                            onClick={() => window.location.replace(`/sensor/group/${groupID}`)}                                                
                        >Edit
                        </Button> 
                    </Col>             
                </Row>
                <h1 className='sensor-header'>
                    Sensors
                    <Button 
                            style={{width: '50px', height: '28px',marginLeft: '15px'}}
                            variant="success"
                            onClick={() => window.location.replace(`/sensor/add`)}                                             
                        >add
                    </Button>                
                </h1>
                <hr />
                {sensorData}
            </div>
        </main>
    </div>
    )
}

export default Sensor