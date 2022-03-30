import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { request } from "./scripts/request";
import Dashboard from "./pages/dashboard/Dashboard";
import TableData from "./pages/tableData/TablePage";
import Users from "./pages/users/Users";
import Graph from "./pages/graph/Graph";
import NotFound from "./pages/notFound/NotFound";
import Login from "./pages/login/Login"
import DashSetting from './pages/dashsetting/DashSetting'
import Sensor from "./pages/sensor/sensor";
import SensorEdit from "./pages/sensorEdit/SensorEdit";
import GroupEdit from "./pages/groupEdit/GroupEdit"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [datalogin, setDataLogin] = useState(
        {
            isLogin: false      
        }
    )
    useEffect(() => {        
        getME()
        async function getME() {
            try {
                const res = await request('GET', '/user/me', undefined, undefined, 'none')           
                if (res.ok) {
                    const data = await res.json()
                    setDataLogin(          
                        {                    
                            isLogin: true,
                            username: data.username,
                            admin: data.admin,    
                        }
                    )
                }
                else {
                    setDataLogin(          
                        {          
                            isLogin: false
                        }
                    )
                }
            } catch(e) {
                console.log(e)
            }
        }
    }, [])

    if (!datalogin.isLogin) {        
        return <Login />
    }

    return (
        <div className="App">
            <Routes>               
                <Route path='*' element={<NotFound />} /> 
                <Route path="/">                    
                    <Route index element={<Dashboard />} />
                    <Route path='table' element={<TableData />} />         
                    <Route path='users' element={<Users />} />
                    <Route path='sensor'>
                        <Route index element={<Sensor />}/>
                        <Route path='group/:gname' element={<GroupEdit />}/>
                        <Route path=':id' element={<SensorEdit />}/>
                    </Route>
                    <Route path='graph' element={<Graph />} />
                    <Route path='setting' element={<DashSetting />}/>              
                </Route>
            </Routes>
        </div>
    )
}

export default App;
