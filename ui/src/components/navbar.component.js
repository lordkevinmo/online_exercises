import React, { Component} from 'react';
//import { Link } from 'react-router-dom';
import { Navbar, Nav , Button} from 'react-bootstrap';
import Cookie from "js-cookie"
import axios from 'axios';

const btnStyle = {
    'margin': '5px',
};

export default class Navigation extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);

        this.state = {
            isLogin: false,
            buttons: ""
        };

    }

    async componentDidMount() {
        /*Check if the user is properly authenticated*/
        if(!Cookie.get('token'))
        {
            this.setState( {buttons: <div>
                    <Button variant="success" style={btnStyle} href="/login">Login</Button>
                    <Button variant="outline-success" style={btnStyle} href="/signup">Sign up</Button>
                </div>});
            return;
        }

        const response = await fetch(process.env.REACT_APP_SERVER_URL + 'users/auth?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'));

        if(response.status === 200)
            this.setState({ buttons: <Button variant="success" style={btnStyle} onClick={this.logout}>logout</Button> });
        else {
            this.setState( {buttons: <div>
                    <Button variant="success" style={btnStyle} href="/login">Login</Button>
                    <Button variant="outline-success" style={btnStyle} href="/signup">Sign up</Button>
                </div>});
            //throw new Error(response.status);
        }

    }


    logout()
    {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/logout?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {
                Cookie.remove("token");
                Cookie.remove("userId");
                window.location = '/';
            })
            .catch(err => {
                /*alert("Error: " + err);*/ //Very strange beacause we considere it has an error but it is not...
                Cookie.remove("token");
                Cookie.remove("userId");
                window.location = '/';
            });
    }

    render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="/">Self-Correcting Exams</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/groups">Groups</Nav.Link>
                        <Nav.Link href="/questions">Questions</Nav.Link>
                        <Nav.Link href="/exercises">Exercises</Nav.Link>
                    </Nav>
                    {this.state.buttons}
                </Navbar.Collapse>
            </Navbar>
        );
    }
};

