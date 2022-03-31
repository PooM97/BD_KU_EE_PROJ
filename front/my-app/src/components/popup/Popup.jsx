import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Popup({show, size='m', onHide, onClick, header, body, buttonMsg, checker}) {
    const [form, setForm] = useState(
        {
            checkerInput: ''
        }
    )
    function handleForm(event) {
        setForm(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }
    return (
        <Modal      
            show={show} 
            onHide={onHide}
            size={size}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <h6>{header}</h6>            
            </Modal.Header>
            <Modal.Body>                
            <p>{body}</p>  
            <p>Please type <span style={{fontWeight: 'bold'}}>{`${checker}`}</span> to confirm.</p>           
            <div className="d-grid gap-2">            
                <Form.Control
                    type="text"
                    placeholder={''}
                    onChange={handleForm}
                    name="checkerInput"
                    value={form.checkerInput}
                >
                </Form.Control>               
                <Button     
                    size={size}           
                    variant="outline-danger"
                    disabled={(form.checkerInput === checker) ? false : true}
                    onClick={() => onClick()}
                >
                    {buttonMsg}
                </Button>                  
            </div>
            </Modal.Body>
        </Modal>
    );
}    
