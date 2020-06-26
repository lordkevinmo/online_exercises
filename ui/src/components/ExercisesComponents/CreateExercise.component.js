import React, {Component,useState } from "react";
import axios from 'axios';
import {Card,Form,Modal,Button,InputGroup,FormControl} from "react-bootstrap";
import Cookie from "js-cookie";


export default class CreateExercise extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

        this.state = {
            name: '',
            description: '',
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {
        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }
    }


    onChangeName(e)
    {
        this.setState({
            name: e.target.value
        });
    }

    onChangeDescription(e)
    {
        this.setState({
            description: e.target.value
        });
    }

    onChangeType(e)
    {
        this.setState({type:e.target.value});
    }


    onSubmit(e) {
        e.preventDefault();

        const exercise = {
            Name: this.state.name,
            Description: this.state.description,
        };

        axios.post(process.env.REACT_APP_SERVER_URL + 'exercises/create?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),exercise)
            .then(res => {
                console.log(res.data);
                window.location = "/exercises/" + res.data.id;
            })
            .catch((err) => {
                alert('Err: ' + JSON.stringify(err));
            });
    }


    render() {
        return (
            <div>
                <Card style={{width: '18rem'}} className="mx-auto">
                    <Card.Body>
                        <Card.Title>Create an exercise</Card.Title>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Exercise name: </label>
                                <input type="text"
                                       required
                                       className="form-control"
                                       value={this.state.name}
                                       onChange={this.onChangeName}
                                />
                            </div>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea"
                                              rows="3"
                                              value={this.state.description}
                                              onChange={this.onChangeDescription}/>
                            </Form.Group>

                            <div className="form-group">
                                <input type="submit" value="Create" className="btn btn-primary"/>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </div>

        );
    }
}
