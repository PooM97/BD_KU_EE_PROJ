import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Container, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Popup from '../../components/popup/Popup'
import { request } from '../../scripts/request'

async function requestSensor(id, set) {
    try {
        const res = await request('GET', `/sensor/${id}`)        
        set(({            
            'name': res.name,
            'unit': res.unit,
            'group_id': res.group.id
        }))
    } catch (e){
        window.location.replace("/sensor")
    }
}

function SensorEdit() {
    const { id } = useParams()
    const [formSensor, setFormSensor] = useState({
        name: '',
        unit: '',
        group_id: ''
    })
    function handleForm(event) {
        const { name, value } = event.target
        setFormSensor(prevForm => {
            return {
                ...prevForm,
                [name]: value
            }
        })
    }
    async function onSubmit() {   
        const error = validation(formSensor)
        if (Object.keys(error).length !== 0) {
            setValid(error)
            return
        }
        try {
            if (id !== 'add') {
                await request('PUT', `/sensor/${id}/update`, undefined, formSensor)
            }
            else {
                console.log(formSensor)
                await request('POST', `/sensor/create`, undefined, [formSensor])
            }
            window.location.replace("/sensor")
        } catch(e) {
            console.log(e)
        }        
    }
    async function onDelete() {
        try {
            await request('DELETE', `/sensor/${id}/drop`)
            window.location.replace("/sensor")
        } catch(e) {
            console.log(e)
        }
    }
    //popup
    const popInit =
    {
        ispop: false,
        detail: {header: '', body: '', buttonMsg: ''}
    }
    const [popup, setPopup] = useState(popInit)
    function handlePopup(header, body, buttonMsg, onPopClick) {   
        setPopup(
            {
                ispop: true,
                detail: {'header': header, 'body': body, 'buttonMsg': buttonMsg},
                onClick: onPopClick
            }
        )
    }
    //validation
    const [valid, setValid] = useState({})
    function validation(value) {
        const error = {};      
        if (!value.name) {
            error.name = "Name is required";
        }
        if (!value.group_id) {
            error.group_id = "Group ID is required";
        }
        if (!value.unit) {
            error.unit = "Unit is required";
        }
        return error;
    }
    useEffect(()=>{
        if (id !== 'add') {
            requestSensor(id, setFormSensor)
        }
    }, [])
    return (
        <Container>
            <h1 style={{marginTop: '10px'}}>Sensors</h1>
            <hr />
            <Form className='sensorForm'>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                    <Form.Label column sm="2">
                        ID
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control plaintext readOnly defaultValue={(id === 'add') ? 'New Sensor':id} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                    <Form.Label column sm="2">
                        Name
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="text"
                                placeholder="Sensor name"
                                name="name"
                                value={formSensor.name}
                                onChange={handleForm}
                                isInvalid={valid.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {valid.name}
                            </Form.Control.Feedback>
                        </Col>
                </Form.Group>    
                <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                    <Form.Label column sm="2">
                        Unit
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="text"
                                placeholder="Unit"
                                name="unit"
                                value={formSensor.unit}
                                onChange={handleForm}
                                isInvalid={valid.unit}
                            />
                            <Form.Control.Feedback type="invalid">
                                {valid.unit}
                            </Form.Control.Feedback>
                        </Col>
                </Form.Group>    
                <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                    <Form.Label column sm="2">
                        Group ID
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="text"
                                placeholder="Group ID"
                                name="group_id"
                                value={formSensor.group_id}
                                onChange={handleForm}
                                isInvalid={valid.group_id}
                            />
                            <Form.Control.Feedback type="invalid">
                                {valid.group_id}
                            </Form.Control.Feedback>
                        </Col>
                </Form.Group>    
                <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                    <Form.Label column sm="2"></Form.Label>
                    <Col sm="10">
                        <Button 
                            variant="outline-primary"
                            onClick={onSubmit}                                                
                        >Submit
                        </Button>                            
                        {(id === 'add')?
                        <></>
                        :<Button 
                            style={{marginLeft: '15px'}}
                            variant="outline-danger"
                            onClick={() => handlePopup(
                                "Are you absolutely sure?",   
                                "This action cannot be undone.",
                                `I understand the consequeces, edit this measurement`,
                                () => onDelete()
                            )}                                              
                        >Delete
                        </Button>}                  
                    </Col>
                </Form.Group>
            </Form>
            <Popup
                show={popup.ispop}
                onHide={() => setPopup(popInit)}
                onClick={popup.onClick}
                header={popup.detail.header}
                body={popup.detail.body}
                buttonMsg={popup.detail.buttonMsg}
                checker={`${formSensor.name}`}
            />
        </Container>
    )   
}

export default SensorEdit