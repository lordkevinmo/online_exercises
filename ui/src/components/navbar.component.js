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
            navs: [],
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
                </div>,
                navs:[{url:"/",name:"Home"}]
            });
            return;
        }

        const response = await fetch(process.env.REACT_APP_SERVER_URL + 'users/auth?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'));

        if(response.status === 200)
            this.setState({ buttons: <Button variant="success" style={btnStyle} onClick={this.logout}>logout</Button>,
                navs:[{url:"/",name:"Home"},{url:"/groups",name:"Groups"},{url:"/questions",name:"Questions"},{url:"/exercises",name:"Exercises"}]});
        else {
            this.setState( {buttons: <div>
                    <Button variant="success" style={btnStyle} href="/login">Login</Button>
                    <Button variant="outline-success" style={btnStyle} href="/signup">Sign up</Button>
                </div>,
                navs:[{url:"/",name:"Home"}]});
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
                /*alert("Error: " + err);*/ //Very strange because we consider it has an error but it is not...
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
                        {this.state.navs.map((item,i) => {
                           return <Nav.Link href={item.url} key={i}>{item.name}</Nav.Link>
                        })}
                    </Nav>
                    {this.state.buttons}
                </Navbar.Collapse>
            </Navbar>
        );
    }
};

