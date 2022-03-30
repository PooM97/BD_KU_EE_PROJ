import React, { useState } from "react";
import { Form, Col, Row, Button} from "react-bootstrap"
import { request } from "../../scripts/request";
import "./login.css"

async function authorization(username, password) {
    const headers =  {'Content-Type': 'application/x-www-form-urlencoded'},    
    body = `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
    try {
        return await request('POST', '/auth/login', undefined, body, 'json', headers)    
        
    } catch(e) {
        console.log(e)
    }
    // const response = fetch("http://127.0.0.1:8000/auth/login", {
    //     method: 'POST',  
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'   
    //     },       
    //     body: JSON.stringify(`grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`) 
    //     // body data type must match "Content-Type" header
    //   })      
    //     .then(res => res.json())
    //     .then(res => {   
    //         console.log(res)                
    //         return res.access_token
    //     })
}  

export default function Login() {    
    const [formData, setFormData] = useState(
        {
            username: "",
            password: "",
        }
    )
    function handleChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }
    async function handleSubmit(event) {               
        event.preventDefault()
        const res_token = await authorization(formData.username, formData.password)
        window.localStorage.setItem("token", res_token.access_token)
        window.location.reload(false);
    }
    return (
        <div className="login-wrapper">      
            <Form onSubmit={handleSubmit} className="login-form">
                <Row>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control
                        id="username" 
                        type="text" 
                        placeholder="username"
                        onChange={handleChange} 
                        value={formData.username}
                        name="username"
                        />                                            
                </Row>
                <Row>
                    <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                    <Form.Control
                        type="password"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        placeholder="password"
                        onChange={handleChange}
                        value={formData.password}
                        name="password"
                        />
                </Row>
                <Row>
                    <Col>
                        <Button className="login-btn" type="submit" variant="outline-primary" size="sm">
                            Login
                        </Button>
                    </Col>
                </Row>
            </Form>              
        </div>
    )
}