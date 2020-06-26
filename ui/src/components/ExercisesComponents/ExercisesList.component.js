import React, {Component} from "react";
import axios from 'axios';
import {Card, CardColumns, Button, Modal, Form, Col} from 'react-bootstrap';
import Cookie from "js-cookie"
import {Typeahead} from "react-bootstrap-typeahead";

const cardStyle = {
    'color': 'black',
    'margin':'15px'
};

const tableStyle = {
    'width': '90%',
    'textAlign': 'center'
};

export default class ExercisesList extends Component {
    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
        this.setShow = this.setShow.bind(this);
        this.onAttribute = this.onAttribute.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            exercises: [],
            show: false,

            //Modal
            title:'',
            options: [],
            selected: undefined,
            ref: React.createRef(),
            exercisesSelected:'',

        };
    }

    //Right before anything load the page this is called
    componentDidMount() {

        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }

        axios(process.env.REACT_APP_SERVER_URL + 'exercises?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {

                this.setState({
                    exercises: res.data
                })
            })
            .catch(err => {
                alert("Error: " + err);
            })

    }

    onDelete(id)
    {
        console.log('delete:' + id );
    }


    /** MODAL **/
    onAttribute (i)
    {
        this.setState({
            title:this.state.exercises[i].name,
            exercisesSelected:this.state.exercises[i]._id
        });
        this.setShow(true)
    };

    setShow (val) {
        this.setState({
            show:val
        })
    };

    //InputChange for the course box
    onInputChange(e) {

        if(e.length<3)
            return;

        axios.get(process.env.REACT_APP_SERVER_URL + 'groups/search/' + e + '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {
                console.log(res.data);
                var options = [];

                res.data.forEach((item) => {
                    let name = item.name;
                    options.push({id:item._id,label:name});
                });
                this.setState({options:options});

            })
            .catch((err) => {
                alert('Error: ' + err);
            });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log("Submitting");

        const body = {
            exerciseId: this.state.exercisesSelected,
            groupId: this.state.selected[0].id,
        };

        console.log(body);

        axios.post(process.env.REACT_APP_SERVER_URL + 'exercises/assign?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),body)
            .then(res => {
                console.log(res);
                window.location = '/exercises';
            })
            .catch((err) => {
                alert('Error: ' + err);
                window.location = '/exercises';
            });

    }





    render() {
        return (
            <div style={tableStyle} className="mx-auto">
                <h3>Exercises</h3>

                <CardColumns >
                    {this.state.exercises.map((item, i) => {
                        return <div key={i}>
                            <Card border={'success'}>
                                    <Card.Body style={cardStyle}>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>
                                            {item.description}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button disabled={true} variant="danger" onClick={() => this.onDelete(item._id)} style={{margin:'5px'}}>Delete</Button>
                                        <Button variant="info" onClick={() => {window.location = "/exercises/" + item._id}} style={{margin:'5px'}}>Open</Button>
                                        <Button variant="warning" onClick={() => {this.onAttribute(i)}}>Assigned to group</Button>
                                    </Card.Footer>
                                </Card>
                        </div>

                    })}
                </CardColumns>
                <Button variant="primary" size="lg" className="mx-auto" style={{'margin':'30px'}} href={"/exercises/new"}>
                    Create an Exercise
                </Button>
                <Modal show={this.state.show} onHide={() => this.setState({show:false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Col} controlId="formGridCourse">
                                <Form.Label>Search for a group</Form.Label>
                                <Typeahead
                                    id="GroupSelection"
                                    onInputChange={this.onInputChange}
                                    onChange={(selected) => {
                                        this.setState({selected});
                                    }}
                                    options={this.state.options}
                                    ref={this.state.ref}
                                />
                            </Form.Group>
                            <div style={{textAlign:'end',margin:'15px'}}>
                            <input type="submit" value="Assign" className="btn btn-primary"/>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>

        );
    }
}
