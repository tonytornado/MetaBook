import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { ContactForm } from './forms/ContactForm';
import { EventCreator } from './forms/EventForm';
import Contact from './applications/Contacts/Contact';
import ContactList from './applications/Contacts/ContactList';
import EventList from './applications/Events/EventList';
import Event from './applications/Events/Event';
import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/events' component={EventList} />
        <Route exact path='/events/:id' component={Event} />
        <AuthorizeRoute exact path='/event_add' component={EventCreator} />
        <AuthorizeRoute exact path='/directory' component={ContactList} />
        <AuthorizeRoute exact path='/contact/:id' component={Contact} />
        <AuthorizeRoute path='/add' component={ContactForm} />
        <AuthorizeRoute path='/edit/:id' component={ContactForm} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
