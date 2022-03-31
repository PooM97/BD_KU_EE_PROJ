import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from '../../components/table/DataTable'
import Sidebar from '../../components/sidebar/Sidebar';
import Popup from '../../components/popup/Popup';
import { usersTableSetup } from '../../scripts/setupData';
import { request } from '../../scripts/request';
import './users.css';

function Users() {
    const [tableData, setTableData] = useState(
        {
            rows: [],
            cols: []
        }
    )
    function rowCommit(v) {
        handlePopup("Are you absolutely sure?",
        "This action cannot be undone.",
        `I understand the consequeces, delete this measurement`, () => pass(v))
        async function pass(v){
            setPopup(popInit)
            try {                
                if (v.field === 'username') await request("PUT", '/user/update', undefined, {'username': v.value})      
                //else if (v.field === 'admin') await request("PUT", '/user/admin', {admin: v.value}, {'username': tableData.rows[v.id]['username']})
                window.location.replace("/users")
            } catch(e) {
                console.log(e)
            }
        }
    }
    // popup
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
        usersTableSetup(setTableData)
    }, [])

    return (
        <Container fluid>
            <Sidebar />
            <main>
                <h1 className='headerTitle'>Users</h1>
                <div className="tablePage">
                    <Table
                        width='100%'
                        height="100%"
                        pageSize={25}
                        data={tableData}
                        rowCommit={rowCommit}
                    />
                </div>
            </main>
            <Popup
                    show={popup.ispop}
                    onHide={() => setPopup(popInit)}
                    onClick={popup.onClick}
                    header={popup.detail.header}
                    body={popup.detail.body}
                    buttonMsg={popup.detail.buttonMsg}
                    checker={`understand`}
                />   
        </Container>
    )
}

export default Users