import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { request } from "../../scripts/request";
import './formMea.css'

async function requestGroupOption(setOption) {  
    try {
        const res = await request("GET", "/group/all")
        res.unshift({id: undefined, name: "--  Please select  --"})        
        setOption(res.map((element, index) => <option key={index} value={element.id}>{element.name}</option>))
    } catch(e) {
        console.log(e)
    }
}
async function requestSensorOption(groupID, setOption) {
    try {
        const res = await request("GET", `/sensor/group/${groupID}`)        
        res.unshift({id: 'all', name: 'all'})
        setOption(res.map((element, index) => <option key={index} value={element.id}>{element.name}</option>))
    } catch(e) {
        console.log(e)
    }
}

function FormMes({formData, onChange, onSubmit, setData}) {
    const [groupOption, setGroupOption] = useState([])
    const [sensorOption, setSensorOption] = useState([<option key="0">--  Sensor  --</option>])

    function handleChange(event) {
        if (event.target.value === '--  Please select  --'){
            setSensorOption([<option key="1">--  Sensor  --</option>])
        }
        else if (event.target.name === 'group') {
            requestSensorOption(event.target.value, setSensorOption)
        }
        onChange([event.target.name, event.target.value])
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (formData.group === undefined) return alert("Please select the group")        
        if (formData.startDate === "") return alert("Please enter the start date")
        if (formData.endDate === "") return alert("Please enter the end date")
        if (formData.startDate >= formData.endDate) return alert("Start data is more than end data")
        onSubmit(formData, setData);
    }

    useEffect(() => {
        requestGroupOption(setGroupOption)      
    }, [])

    return (  
        <Form onSubmit={handleSubmit} className="measure-form">
            <Row xs="auto">
                <Col className="measurement-select">
                    <Form.Select
                        id="measurement-select"            
                        onChange={handleChange}
                        name="group"
                        value={formData.group}                  
                        >
                        {groupOption}                                
                    </Form.Select>
                </Col>
                <Col className="sensor-select">
                    <Form.Select
                        id="sensor-select"            
                        onChange={handleChange}
                        name="sensor"
                        value={formData.sensor}                 
                        >
                        {sensorOption}                                
                    </Form.Select>
                </Col>
                <Col className="date-select">
                    <Form.Control 
                        id="date-select"                
                        placeholder="start"
                        onChange={handleChange}
                        name="startDate"
                        value={formData.startDate}
                        />
                </Col>
                <Col className="date-select">
                    <Form.Control 
                        id="date-select"             
                        placeholder="end"
                        onChange={handleChange}
                        name="endDate"
                        value={formData.endDate}
                        />
                </Col>
                <Col>
                    <Button type="submit" variant="primary">
                        Submit
                    </Button>
                </Col>               
            </Row>
        </Form>
    )
}
export default FormMes