import React, {Component} from "react";
import axios from 'axios';
import { Table , Button, Card, Container,Row,Col,ListGroup} from 'react-bootstrap';
import Cookie from "js-cookie"
import GroupUserResults from './GroupUserResults.component';

export default class GroupAdvancedResults extends Component {

    constructor(props) {
        super(props);

        this.setUserDetail = this.setUserDetail.bind(this);

        this.state = {
            groupId: this.props.groupId,
            exercise: this.props.exercise,
            userSessions: [],
            rightPage: <div>Select an user</div>
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

        axios(process.env.REACT_APP_SERVER_URL + 'exercises/results' +
            "?token=" + Cookie.get('token') +
            "&userId="+Cookie.get('userId') +
            "&groupId=" + this.state.groupId +
            "&exerciseId=" + this.state.exercise._id)
            .then(res => {
                console.log(res.data);
                this.setState({userSessions:res.data});
            })
            .catch((err) => {
                console.log(err);
            });

    }


    setUserDetail(index)
    {
        this.setState({
            rightPage: <GroupUserResults userSession={this.state.userSessions[index]} exerciseId={this.state.exercise._id} groupId={this.state.groupId}/>
        })
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col><Card style={{ width: '18rem' }}>
                            <Card.Header>Users</Card.Header>
                            <ListGroup variant="flush">
                                {this.state.userSessions.map((item,i) => {
                                    return <ListGroup.Item key={i}>
                                        <a href={"#"} onClick={() => this.setUserDetail(i)}>{item.user[0].name} {item.user[0].surname}</a>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Card></Col>
                        <Col>{this.state.rightPage}</Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
