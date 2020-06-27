import React, {Component} from "react";
import axios from 'axios';
import { Table , Button, Card, Container,Row,Col,ListGroup} from 'react-bootstrap';
import Cookie from "js-cookie"

export default class GroupUserResults extends Component {

    constructor(props) {
        super(props);

        this.setUserSession = this.setUserSession.bind(this);

        this.state = {
            groupId: this.props.groupId,
            exerciseId: this.props.exercise,
            userSession: this.props.userSession,
            rightTitle: 'Select an user to see details'
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

        this.setUserSession(this.state.userSession);
    }

    componentWillReceiveProps(newProps) {
        const oldProps = this.props;
        if(oldProps.userSession !== newProps.userSession) {
            this.setUserSession(newProps.userSession);
        }
    }

    setUserSession(userSession)
    {
        let points = 0;
        userSession.results.forEach((item,i) => {
            points+=item?1:0;
        });

        this.setState({
            userSession:userSession,
            rightTitle: userSession.user[0].name + " " + userSession.user[0].surname + " (" + points +"/" + userSession.results.length + ")"
        })
    }


    render() {
        return (
            <Card>
            <Card.Header>{this.state.rightTitle}</Card.Header>
                {this.state.userSession.questionLogs.map((item,i) => {
                    return <Card border={this.state.userSession.results[i]?"success":"danger"} style={{ margin: '10px' }}>
                            <Card.Header>Question {i+1} ({this.state.userSession.results[i]?"1":"0"}/1)</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.userSession.questions[i].Name}</Card.Title>
                                <Card.Text>
                                    Input: {JSON.stringify(item.input)}
                                    User output:{this.state.userSession.UserOutput[i]}
                                    Expected output: {item.output}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                })}
            </Card>
        );
    }
}
