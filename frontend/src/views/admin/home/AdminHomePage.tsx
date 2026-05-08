import React from 'react';
import "./styles.css"

import { Outlet } from 'react-router-dom';
import { AdminHomeVM } from './AdminHomeVM';
import { SideBar } from '@/component/sideBar';

const AdminHomePage: React.FC = () => {

    const { config, action } = AdminHomeVM();

    return (
        <main className={`admin-home-page`}>
            {
                config.sideBarProps 
                &&
                <SideBar
                    props={config.sideBarProps}
                />
            }

            <React.Fragment>
                <Outlet />
            </React.Fragment>
        </main>
    )
}
export default AdminHomePage;
