import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSync } from '@fortawesome/free-solid-svg-icons';

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <NavMenu />
                <Banner />
                <Container className="py-4">
                    {this.props.children}
                </Container>
                <Footer />
            </div>
        );
    }
}

/**
 * A banner class for all pages.
 */
export class Banner extends Component {
    static displayName = Banner.name;

    render() {
        let title = this.props.title;
        let subtitle = this.props.subtitle;

        if (title && subtitle) {
            return <div className="text-center pb-3">
                <h2 className="display-4">{title}</h2>
                <h5 className="lead">{subtitle}</h5>
            </div>
        } else {
            return null;
        }
    }
}

/**
 * A footer class for all pages
 * */
export class Footer extends Component {
    static displayName = Footer.name;

    render() {
        return (
            <div className="text-center text-light bg-dark py-3">
                <p>&copy; 2019</p>
            </div>
        );
    }
}

/**
 * A function for loading screen animation
 * */
export function Loader() {
    return (
        <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} size="6x" spin />
        </div>
    )
}

/**
 * A function for loading the login screen animation
 * */
export function LoginLoader() {
    return (
        <div className="text-center">
            <FontAwesomeIcon icon={faSync} size="6x" spin />
        </div>
    )
}