import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TocIcon from '@mui/icons-material/Toc';
import SsidChartOutlinedIcon from '@mui/icons-material/SsidChartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import {Link} from "react-router-dom";
import './sidebar.css';

function logout() {  
    window.localStorage.removeItem('token');
    window.location.reload();
}

function Sidebar() {
    return (
        <div className='sidebar'>
            <div className='top'>
                <span className='logo'>Admin</span>
            </div>
            <hr />
            <div className='center'>
                <ul>
                    <p className='title'>MENU</p>
                    <Link to={"/"} style={{ textDecoration: 'none' }}>  
                        <li>
                            <DashboardIcon className='icon'/>
                            <span>Dashboard</span>
                        </li>
                    </Link>
                    <Link to={"/users"} style={{ textDecoration: 'none' }}>  
                        <li>
                            <PersonOutlineIcon className='icon'/>
                            <span>Users</span>
                        </li>
                    </Link>
                    <Link to={"/sensor"} style={{ textDecoration: 'none' }}>  
                        <li>
                            <SensorsIcon className='icon'/>
                            <span>Sensors</span>
                        </li>
                    </Link>
                    <Link to={"/table"} style={{ textDecoration: 'none' }}>  
                        <li>
                            <TocIcon className='icon'/>
                            <span>Table</span>
                        </li>
                    </Link>
                    <Link to={"/graph"} style={{ textDecoration: 'none' }}>  
                        <li>
                            <SsidChartOutlinedIcon className='icon'/>
                            <span>Graph</span>
                        </li>
                    </Link>
                    <Link to={"/Setting"} style={{ textDecoration: 'none' }}>  
                        <li>
                            <PsychologyOutlinedIcon className='icon'/>
                            <span>Setting</span>
                        </li>
                    </Link>
                    <p className='title'>USER</p>
                    
                    <Link to={"/profile"} style={{ textDecoration: 'none' }}>
                        <li>
                            <AccountCircleOutlinedIcon className='icon'/>
                            <span>Profile</span>
                        </li>
                    </Link>
                        <li onClick={logout}>
                            <ExitToAppOutlinedIcon className='icon'/>
                            <span>Logout</span>
                        </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar