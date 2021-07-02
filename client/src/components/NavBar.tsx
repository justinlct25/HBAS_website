import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

function NavBar() {
    const [collapsed, setCollapsed] = useState(true);
    const dispatch = useDispatch();

    const toggleNavbar = () => setCollapsed(!collapsed);
    
    const HomeBand = () =>{
        dispatch(push('/'));
    }
    const HomeClick = () =>{
        toggleNavbar();
        dispatch(push('/'));
    }
    const AlertDataPage = () =>{
        toggleNavbar();
        dispatch(push('/alertData'));
    }
    return (
        <div>
            <Navbar color="faded" light>
                <NavbarBrand onClick={HomeBand} className="mr-auto"><label>Handbrake System</label></NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                    <NavItem>
                        <NavLink onClick={HomeClick}><label>Home page</label></NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={AlertDataPage}><label>Alert page</label></NavLink>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}

export default NavBar;
