import React, {Component} from "react";
import axios from 'axios';
import {Card} from "react-bootstrap";

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);

        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRePassword = this.onChangeRePassword.bind(this);
        this.onChangeUniversity = this.onChangeUniversity.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            surname: '',
            password: '',
            repassword: '',
            university:'',
            email: '',
            signing:false
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {

    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeSurname(e) {
        this.setState({
            surname: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }


    onChangeUniversity(e) {
        this.setState({
            university: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeRePassword(e) {
        this.setState({
            repassword: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        this.setState({
            signing:true,
        });

        if(this.state.repassword !== this.state.password)
        {
            alert("Error");
            window.location = '/signup';
            return;
        }

        const user = {
            name: this.state.name,
            surname: this.state.surname,
            password: this.state.password,
            faculty: this.state.faculty,
            email: this.state.email
        };

        console.log(user);

        axios.post(process.env.REACT_APP_SERVER_URL + 'users/signup', user)
            .then(res => {
                console.log("Success");
                window.location = '/login';
            })
            .catch((err) => alert("Error: " + err));

    }

    render() {
        return (
            <Card style={{width: '18rem'}} className="mx-auto">
                <Card.Body>
                    <Card.Title>Register</Card.Title>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Name: </label>
                            <input type="text"
                                   required
                                   className="form-control"
                                   value={this.state.name}
                                   onChange={this.onChangeName}
                            />
                        </div>
                        <div className="form-group">
                            <label>Surname: </label>
                            <input type="text"
                                   required
                                   className="form-control"
                                   value={this.state.surname}
                                   onChange={this.onChangeSurname}
                            />
                        </div>
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
                            <label>University: </label>
                            <input type="text"
                                   className="form-control"
                                   value={this.state.university}
                                   onChange={this.onChangeUniversity}
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
                            <label>Retype your password: </label>
                            <input type="password"
                                   required
                                   className="form-control"
                                   value={this.state.repassword}
                                   onChange={this.onChangeRePassword}
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Sign up" className="btn btn-primary" disabled={this.state.signing}/>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        );
    }
}
