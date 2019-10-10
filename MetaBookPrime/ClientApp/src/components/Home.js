import React, { Component } from 'react';
import { Banner } from './Layout';
import { LoremIpsum } from 'react-lorem-ipsum';

export class Home extends Component {
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