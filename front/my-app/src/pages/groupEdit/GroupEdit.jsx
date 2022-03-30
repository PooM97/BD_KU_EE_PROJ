import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Container, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Popup from '../../components/Popup/Popup'
import { request } from '../../scripts/request'

async function requestGroupData(name, set) {
    try {
        const res = await request('GET', `/group/${name}`)
        set(prev => {
            return ({
                ...prev,
                'name': res.name,
                'id': res.id
            })
        })
    } catch(e) {
        window.location.replace("/sensor")
    }
}

function GroupEdit() {
    const { gname } = useParams()
    const [ groupData, setGroupData ] = useState({
        id: '',
        name: ''
    })

    function handleOnChange(event) {
        const { name, value } = event.target
        setGroupData(prev => {
            return ({
                ...prev,
                [name]: value
            })
        })
    }
    async function onSubmit() { 
        const error = validation(groupData)
        if (Object.keys(error).length !== 0) {
            setValid(error)
            return    
        }     
        try {
            const body = { name: groupData.name }
            if (gname !== 'add') {                
                await request('PUT', `/group/${gname}/update`, undefined, body)
            }
            else {
                await request('POST', `/group/create`, undefined, body)
            }
            window.location.replace("/sensor")
        } catch(e) {
            console.log(e)
        }        
    }
    async function onDelete() {
        try {
            await request('DELETE', `/group/${gname}/drop`)
            window.location.replace("/sensor")
        } catch(e) {
            console.log(e)
        }
    }

    //validation
    const [valid, setValid] = useState({})
    function validation(value) {
        const error = {};      
        if (!value.name) {
            error.name = "Name is required";
        }       
        return error;
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
    useEffect(() => {
        if (gname !== 'add') {
            requestGroupData(gname, setGroupData)
        }
    }, [])
    return (
        <Container>
            <h1 style={{marginTop: '10px'}}>Group</h1>
            <hr />
            <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                <Form.Label column sm="2">
                    ID
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={(gname == 'add') ? 'New Group':groupData.id} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintext">
                <Form.Label column sm="2">
                    Name
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            placeholder="group name"
                            name="name"
                            value={groupData.name}
                            onChange={handleOnChange}   
                            isInvalid={valid.name}                         
                        />
                         <Form.Control.Feedback type="invalid">
                                {valid.name}
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
                        {(gname === 'add')?
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
            <Popup
                show={popup.ispop}
                onHide={() => setPopup(popInit)}
                onClick={popup.onClick}
                header={popup.detail.header}
                body={popup.detail.body}
                buttonMsg={popup.detail.buttonMsg}
                checker={`${groupData.name}`}
            /> 
        </Container>
    )
}

export default GroupEdit