import react, { Component } from 'react';

export default class TodoItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            item: []
        }
    }
    
    componentDidMount(){
        // this.getItem();
    }

    render(){
        return this.todoItemRender(this.state.item);
    }

    todoItemRender(item) {
        return <article>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
        </article>;
    }
}

