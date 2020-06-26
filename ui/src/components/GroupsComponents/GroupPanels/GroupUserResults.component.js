import React, {Component} from "react";
import axios from 'axios';
import { Table , Button, Card, Container,Row,Col,ListGroup} from 'react-bootstrap';
import Cookie from "js-cookie"

export default class GroupUserResults extends Component {

    constructor(props) {
        super(props);

        this.state = {
            groupId: this.props.groupId,
            exerciseId: this.props.exercise,
            userSession: this.props.userSession
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {
        console.log(this.props.token);

        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }

    }


    render() {
        return (
            <div>
                {this.state.userSession.questionLogs.map((item,i) => {
                    return <li>
                        <span>Input: {JSON.stringify(item.input)} User output:{this.state.userSession.UserOutput[i]} Expected output: {item.output}</span>
                    </li>
                })}
            </div>
        );
    }
}
