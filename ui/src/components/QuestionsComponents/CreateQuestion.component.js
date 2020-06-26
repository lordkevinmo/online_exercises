import React, {Component,useState } from "react";
import axios from 'axios';
import {Card,Form,Modal,Button,InputGroup,FormControl} from "react-bootstrap";
import Cookie from "js-cookie";


export default class CreateQuestion extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

        this.state = {
            name: '',
            description: '',
            type: 'Computed answer (Automatic)'
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {
        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }

        //TODO: create request for all questions created by the user and display them in state question
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

        const question = {
            Name: this.state.name,
            Description: this.state.description,
        };

        axios.post(process.env.REACT_APP_SERVER_URL + 'questions/create?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),question)
            .then(res => {
                console.log(res.data);
                window.location = "/questions/" + res.data.id;
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
                        <Card.Title>Create a question</Card.Title>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Question name: </label>
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

                            <Form.Group controlId="formGridState">
                                <Form.Label>Type</Form.Label>
                                <Form.Control as="select" value={this.state.type} onChange={this.onChangeType}>
                                    <option disabled={true }>Textual answer (Manual)</option>
                                    <option disabled={true} >Multiple choice question (Automatic)</option>
                                    <option disabled={false}>Computed answer (Automatic)</option>
                                    <option disabled={true} >Scripts answer (Automatic)</option>
                                </Form.Control>
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
