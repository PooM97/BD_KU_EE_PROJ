import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import FormMes from '../../components/formMea/FormMea'
import Sidebar from '../../components/sidebar/Sidebar'
import Chart from '../../components/chart/Chart'
import { chartSetup } from '../../scripts/setupData'
import './graph.css'

function Graph() {   
    const [chartData, setChartData] = useState({
        lebels: [],
        datasets:  [{}]
    })
    const [formData, setFormData] = useState(
        {
            measurement: "",
            startDate: "",
            endDate: "",
        }
    )
    function onChange(change) {       
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [change[0]]: change[1]
            }
        }) 
    }

    return (
        <Container fluid>    
            <Sidebar />
            <main>
                <h1 className='headerTitle'>Graph</h1>
                <div className="graphPage">
                    <FormMes
                        onChange={onChange}
                        formData={formData}      
                        onSubmit={chartSetup}
                        setData = {setChartData}
                    />
                    <Chart data={chartData} />              
                </div>
            </main>
        </Container>
  )
}

export default Graph