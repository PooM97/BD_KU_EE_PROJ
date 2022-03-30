import React, { useEffect, useState } from 'react'
import { 
    Container, 
    Row, 
    Form, 
    InputGroup, 
    FormControl, 
    Button 
} from 'react-bootstrap'

function DashSetting() {    
    const [rows, setRows] = useState([
        [
            {            
                sensorID: '',
                upper: '',
                lower: ''
            },          
        ],           
    ])

    function removeRow(row_id) {
        const newRow = [...rows]
        newRow.splice(row_id, 1)        
        setRows(newRow)
    }
    function addRow(row_id) {
        const newRow = [...rows]
        newRow.splice(row_id+1, 0, [
            {
                sensorID: '',
                upper: '',
                lower: ''
            },
        ])  
        setRows(newRow)       
    }
    function removeWidget(row_id, id) {
        const newRow = [...rows]
        newRow[row_id].splice(id, 1)        
        setRows(newRow)
    } 
    function addWidget(row_id, id) {
        const newRow = [...rows]
        newRow[row_id].splice(id+1, 0, {                
            sensorID: '',
            upper: '',
            lower: ''
        },)        
        setRows(newRow)
    } 
    function onChangeWidget(event, row_id, id) {
        const newRow = [...rows]
        newRow[row_id][id][event.target.name] = event.target.value
        setRows(newRow)
    }
    function onSubmit() {
        localStorage.setItem('widget', JSON.stringify(rows));
        window.location.replace("/")
    }
    useEffect(() => {
        console.log(localStorage.getItem('widget'))
        if(localStorage.getItem('widget') !== null) {
            setRows(JSON.parse(localStorage.getItem('widget')))
        }
    }, [])

    return (
        <Container>
            <h1>Dashboard Setting</h1>
            <hr />
            <Form>
                <div>                    
                    {rows.map((row, row_id) => {
                        return (
                            <Row key={row_id}>
                                <h3>Row{row_id+1}                        
                                    <Button 
                                        variant='outline-light' 
                                        style={{color: 'black'}}
                                        onClick={() => addRow(row_id)}
                                    >ADD
                                    </Button>                                                        
                                    <Button 
                                        variant='outline-light' 
                                        style={{color: 'black'}}
                                        onClick={() => removeRow(row_id)}
                                        disabled={rows.length === 1}
                                    >REMOVE</Button>                                                        
                                </h3>                                
                                 <br />                               
                                {row.map((widgetData, index) => {
                                    return (                                      
                                        <InputGroup className="mb-4">
                                            <InputGroup.Text id="sensorID">SensorID</InputGroup.Text>
                                            <FormControl
                                                name="sensorID"
                                                placeholder="SensorID"
                                                onChange={(e) => onChangeWidget(e, row_id, index)}
                                                value={widgetData.sensorID}
                                                />
                                            <InputGroup.Text id="upper">Upper</InputGroup.Text>
                                            <FormControl
                                                name="upper"
                                                placeholder="Upper"   
                                                onChange={(e) => onChangeWidget(e, row_id, index)}
                                                value={widgetData.upper}
                                            />
                                            <InputGroup.Text id="Lower">Lower</InputGroup.Text>
                                            <FormControl
                                                name="lower"
                                                placeholder="Lower"
                                                onChange={(e) => onChangeWidget(e, row_id, index)}
                                                value={widgetData.lower}
                                            />
                                            <Button
                                                variant="outline-primary"
                                                id="Add"
                                                onClick={() => addWidget(row_id, index)}
                                            >
                                                Add Card
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                id="Remove"
                                                onClick={() => removeWidget(row_id, index)}
                                                disabled={row.length === 1}
                                            >
                                                Remove
                                            </Button>
                                        </InputGroup>
                                    )
                                })}
                            </Row>
                        )
                    })}
                </div>
                <Button
                    variant="outline-primary"
                    id="submit"
                    onClick={onSubmit}
                >
                    Submit
                </Button>             
            </Form>
        </Container>
    )
}

export default DashSetting