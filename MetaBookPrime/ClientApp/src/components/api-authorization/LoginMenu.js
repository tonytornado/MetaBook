import React, { Component, Fragment } from 'react';
import { NavItem, NavLink, UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt, faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons';

export class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: null,
            isOpen: false
        };

        this.setIsOpen = this.setIsOpen.bind(this);
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    setIsOpen() {
        this.setState(prevState => {
            isOpen: !prevState
        });
    }

    /**
     * Populates the state of the component
     */
    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            isAuthenticated,
            userFirstName: user && user.FirstName,
            userLastName: user && user.LastName,
            userId: user && user.Id
        });
    }

    render() {
        const { isAuthenticated, userFirstName } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        } else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(userFirstName, profilePath, logoutPath);
        }
    }

    /**
     * Authenticated view for the logged in user.
     * 
     * @param {string} userName The User's Username
     * @param {string} profilePath The path to the User's profile
     * @param {string} logoutPath The path to logOut
     */
    authenticatedView(userName, profilePath, logoutPath) {
        return (
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                    {userName}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to={profilePath}><FontAwesomeIcon icon={faUser} /> | Profile</NavLink>
                        </NavItem>
                    </DropdownItem>
                    <DropdownItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to={logoutPath}><FontAwesomeIcon icon={faSignOutAlt} size="1x" /> | Logout</NavLink>
                        </NavItem>
                    </DropdownItem>
                </DropdownMenu >
            </UncontrolledDropdown >
        );

    }

    /**
     * Anonymous view for unlogged visitors
     * 
     * @param {string} registerPath The path to the Register page
     * @param {string} loginPath The path to the Log In page
     */
    anonymousView(registerPath, loginPath) {
        return (
            <Fragment>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={registerPath} alt="Register" title="Register here!"><FontAwesomeIcon icon={faUserPlus} size="1x" /></NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={loginPath} alt="Sign In" title="Login"><FontAwesomeIcon icon={faSignInAlt} size="1x" /></NavLink>
                </NavItem>
            </Fragment>);
    }
}
