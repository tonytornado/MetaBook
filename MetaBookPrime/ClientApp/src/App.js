import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import Home from './components/Home';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import {ApplicationPaths} from './components/api-authorization/ApiAuthorizationConstants';
import ContactList from './applications/Contacts/ContactList';
import EventList from './applications/Moments/EventList';
import TodoList from './applications/Tasks/TodoList';
import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home}/>
                <AuthorizeRoute path='/tasks' component={TodoList}/>
                <AuthorizeRoute path='/events' component={EventList}/>
                <AuthorizeRoute path='/contacts' component={ContactList}/>
                <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes}/>
            </Layout>
        );
    }
}
