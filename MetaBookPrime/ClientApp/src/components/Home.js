import React, { Component } from 'react';
import { LoremIpsum } from 'react-lorem-ipsum';
import { Banner } from './Layout';

export default class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <Banner title="The MetaBook" subtitle="This is a simple little project, man." />
                <div>
                    <LoremIpsum p={3} />
                </div>
            </div>
        );
    }
}