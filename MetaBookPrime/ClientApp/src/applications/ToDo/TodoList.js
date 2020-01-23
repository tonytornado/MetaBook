import { Component } from 'react';


export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: []
        };
    }

    componentDidMount() {
    }

    render() {
    }

    todoListRender(items) {
        <ul>
            {items.map(item => (<li key={item.id}>{item.text}</li>))}
        </ul>;
    }
}
