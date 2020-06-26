import React, {Component,useState } from "react";
import axios from 'axios';
import {Card,Form,Modal,Button,InputGroup,FormControl} from "react-bootstrap";
import Cookie from "js-cookie";


export default class CreateGroup extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.HandleIsPublicChange = this.HandleIsPublicChange.bind(this);
        this.setShow = this.setShow.bind(this);
        this.onCopy = this.onCopy.bind(this);

        this.state = {
            name: '',
            description: '',
            isPublic: false,
            option: '',
            show: false,
            groupId: undefined
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

    setShow(e)
    {
        this.setState({
            show:e
        });

        if(e===false)
        {
            window.location = '/groups';
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

    onCopy()
    {
        navigator.clipboard.writeText(this.state.groupId).then(() => {
            this.setShow(false);
        }, function() {
            alert("Error??");
        });

    }

    HandleIsPublicChange(event) {
        const target = event.target;
        const value = target.name === 'isPublic' ? target.checked : target.value;

        this.setState({
            isPublic: value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const group = {
            name: this.state.name,
            description: this.state.description,
            isPublic: this.state.isPublic
        };

        axios.post(process.env.REACT_APP_SERVER_URL + 'groups/create?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),group)
            .then(res => {
                this.setState({
                    groupId:res.data._id
                });
                console.log("groupId:" + res.data._id);
                this.setShow(true);
            })
            .catch((err) => {

            });
    }


    render() {
        return (
            <div>
                <Card style={{width: '18rem'}} className="mx-auto">
                    <Card.Body>
                        <Card.Title>Create a group</Card.Title>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Group name: </label>
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


                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" name="isPublic" label="Make it public" checked={this.isPublic} onChange={this.HandleIsPublicChange} />
                            </Form.Group>
                            <div className="form-group">
                                <input type="submit" value="Create" className="btn btn-primary"/>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
                <Modal show={this.state.show} onHide={() => {this.setShow(false)}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Group invitation link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup className="mb-3">
                            <FormControl disabled={true}
                                placeholder="Group Id" value={this.state.groupId}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.onCopy}>Copy</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Modal.Body>
                </Modal>
            </div>

        );
    }
}
