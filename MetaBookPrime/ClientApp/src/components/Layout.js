import React, {Component} from 'react';
import {Container} from 'reactstrap';
import {NavMenu} from './NavMenu';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner, faSync} from '@fortawesome/free-solid-svg-icons';

export class Layout extends Component {
    static displayName = Layout.name;

    render = () => (
        <div>
            <NavMenu/>
            <Banner/>
            <Container className="py-4">
                {this.props.children}
            </Container>
            <Footer/>
        </div>
    );
}

/**
 * A banner class for all pages.
 * @return {null}
 */
export function Banner(props) {
    let title = props.title;
    let subtitle = props.subtitle;

    return !(title && subtitle) 
        ? null 
        : <div className="text-center pb-3">
        <h2 className="display-4">{title}</h2>
        <h5 className="lead">{subtitle}</h5>
    </div>;
}

Banner.displayName = Banner.name

/**
 * A footer class for all pages
 * */
export function Footer() {
    return (
        <div className="text-center text-light bg-dark py-3">
            <p>Tony T. &copy; 2019</p>
        </div>
    );
}

Footer.displayName = Footer.name

/**
 * A function for loading screen animation
 * */
export function Loader() {
    return (
        <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} size="7x" spin/>
        </div>
    )
}

/**
 * A function for loading the login screen animation
 * */
export function LoginLoader() {
    return (
        <div className="text-center">
            <FontAwesomeIcon icon={faSync} size="7x" spin />
        </div>
    )
}