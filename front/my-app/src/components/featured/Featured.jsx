import React from 'react';
import './featured.css';
import ProgressBar from './ProgressBar';
import { Row, Col } from 'react-bootstrap';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

function Featured({data}) {
    return (
        <div className='featured'>
            <div className='top'>
                <h1 className='title'>Total collect data</h1>
                <MoreVertOutlinedIcon fontSize='small'/>
            </div>
            <Row style={{display: 'flex' ,alignItems: 'center'}}>                
                <Col sm>
                    <ProgressBar
                        title={'element.field'}
                        subtitle={'element.measurement'}
                        width="140px"
                        max={'element.max'}
                        min={'element.min'}
                        styles={{
                            rotation: 0,
                            strokeLinecap: 'butt',
                            textSize: '16px',
                            pathTransitionDuration: 0.5,
                            pathColor: `rgba(${100-7}, 152, 199, 1)`,
                            textColor: '#f88',
                            trailColor: '#00000',
                            backgroundColor: '#3e98c7',
                        }}                       
                    />
                </Col>                   
            </Row>    
        </div>
    )
    }

export default Featured