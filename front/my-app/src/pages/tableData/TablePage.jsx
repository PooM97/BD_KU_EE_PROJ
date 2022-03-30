import React, { useEffect, useState } from 'react';
import Table from '../../components/table/DataTable'
import Sidebar from '../../components/sidebar/Sidebar';
import FormMea from '../../components/formMea/FormMea';
import { tableSetup } from '../../scripts/setupData';
import { dateRfc3339 } from '../../scripts/date';
import { Container } from 'react-bootstrap';
import './tableData.css';

function TableData() {    
    const [tableData, setTableData] = useState(
        {
            rows: [],
            cols: []
        }
    )
    const [formData, setFormData] = useState({
        startDate: '',
        endDate:''
    })
       
    function onChange(change) { 
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [change[0]]: change[1]
            }
        })
    }
    useEffect(() => {      
        // if (measurement !== undefined) {
        //     var currentdate = new Date()       
        //     var d = currentdate.getDate(),
        //     m = currentdate.getMonth(),
        //     y = currentdate.getFullYear(),
        //     start = new Date(y,m,d),
        //     end = new Date(y,m,d+1),
        //     startDate = dateRfc3339(start),
        //     endDate = dateRfc3339(end)            
        //     tableMeaSetup({measurement, startDate, endDate}, setTableData)
        //}
    }, [])
    return (
        <Container fluid>
            <Sidebar />
            <main>
                <h1 className='headerTitle'>Table</h1>           
                <div className="tablePage">
                    <FormMea
                        onChange={onChange}
                        formData={formData}           
                        onSubmit={tableSetup}
                        setData = {setTableData}
                    />
                    <Table width='100%' height="100%" data={tableData} />
                </div>
            </main>
        </Container>
    )
}

export default TableData