import React, {Component} from "react";
import axios from 'axios';
import { Card } from 'react-bootstrap';
import Cookie from "js-cookie"

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.isLogin = this.isLogin.bind(this);

        this.state = {
            email: '',
            password: '',
            logining:false,
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {

        if(this.isLogin())
        {
            //window.location = '/';
            return;
        }

        this.setState({
            email: ""
        })
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        this.setState({
            logining:true,
        });

        const user = {
            email: this.state.email,
            password: this.state.password
        };

        console.log(user);

        axios.post(process.env.REACT_APP_SERVER_URL + 'users/login',user)
            .then(res => {

                if(res.data.success)
                {
                    console.log("success login \n" + JSON.stringify(res.data));
                    Cookie.set("token", res.data.token);
                    Cookie.set("userId", res.data.userId);
                    window.location = '/';
                }
                else
                {
                    alert(res.data.msg);
                    this.setState({
                        logining:false
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                Cookie.remove("token");
                Cookie.remove("userId");

                alert('Error: ' + err);
                //Return to the user list
                window.location = '/';
            });


    }

    isLogin()
    {
        if(!Cookie.get('token'))
            return false;
        else
            return (Cookie.get('token') !== '' && Cookie.get('userId') !== '')
    }



    render() {
        return (
            <Card style={{ width: '18rem' }} className="mx-auto">
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Email: </label>
                                <input type="text"
                                       required
                                       className="form-control"
                                       value={this.state.email}
                                       onChange={this.onChangeEmail}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password: </label>
                                <input type="password"
                                       required
                                       className="form-control"
                                       value={this.state.password}
                                       onChange={this.onChangePassword}
                                />
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Login" className="btn btn-primary" disabled={this.state.logining}/>
                            </div>
                        </form>
                </Card.Body>
            </Card>
        );
    }
}
