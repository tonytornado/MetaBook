import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { ContactForm } from './forms/ContactForm';
import { EventCreator } from './forms/EventForm';
import Contact from './applications/Contacts/Contact';
import ContactList from './applications/Contacts/ContactList';
import EventList from './applications/Moments/EventList';
import Event from './applications/Moments/Event';
import TodoList from './applications/Tasks/TodoList';
import TodoItem from './applications/Tasks/TodoItem';

import './custom.css'
import TodoForm from './forms/TodoForm';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route exact path='/tasks' component={TodoList} />
                <Route exact strict path='/tasks/:id' component={TodoItem} />
                <AuthorizeRoute exact strict path='/tasks/add/' component={TodoForm} />
                <Route exact path='/events' component={EventList} />
                <Route exact strict path='/events/:id' component={Event} />
                <AuthorizeRoute exact strict path='/events/add/' component={EventCreator} />
                <AuthorizeRoute exact path='/directory' component={ContactList} />
                <AuthorizeRoute exact strict path='/contact/:id' component={Contact} />
                <AuthorizeRoute exact strict path='/contact/add/' component={ContactForm} />
                <AuthorizeRoute exact strict path='/edit/:id' component={ContactForm} />
                <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
            </Layout>
        );
    }
}
