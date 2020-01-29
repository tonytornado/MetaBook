import React, {Component} from 'react';
import {Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {Link} from 'react-router-dom';
import {LoginMenu} from './api-authorization/LoginMenu';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render = () => 
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
            <Container>
                <NavbarBrand tag={Link} to="/" alt="MetaBook">MetaBook</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} className="mr-2"/>
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/contacts">Contacts</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/events">Events</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/tasks">Tasks</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink>|</NavLink>
                        </NavItem>
                        <LoginMenu>
                        </LoginMenu>
                    </ul>
                </Collapse>
            </Container>
        </Navbar>
    </header>;
}
