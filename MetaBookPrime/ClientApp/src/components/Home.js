import React from 'react';
import {LoremIpsum} from 'react-lorem-ipsum';
import {Banner} from './Layout';

export default function Home() {
    return (
        <div>
            <Banner title="The MetaBook" subtitle="This is a simple little project, mate."/>
            <div>
                <LoremIpsum p={3}/>
            </div>
        </div>
    );
}
Home.displayName = Home.name;