import React, {Component} from "react";
import axios from 'axios';
import {Form, InputGroup, Col, Button, Card, Table} from "react-bootstrap";
import Cookie from "js-cookie";
import {Typeahead} from 'react-bootstrap-typeahead';

const RemoveBtnStyle = {
    'textAlign': 'center'
};

export default class EditExercise extends Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);

        this.state = {
            questions: [],
            options: [],
            selected: undefined,
            order: "Random",
            ref: React.createRef(),
            id:this.props.params,
            name:'',
            description:'',
            Date: new Date()
        };

    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_SERVER_URL + 'exercises/'+ this.state.id +'?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {
                this.setState({
                    questions:res.data.questions,
                    name: res.data.name,
                    description: res.data.description,
                });
            })
            .catch((err) => {
                alert('Error: ' + err);
            });
    }

    //InputChange for the Question box
    onInputChange(e) {

        if(e.length<3)
            return;

        axios.get(process.env.REACT_APP_SERVER_URL + 'questions/search/' + e + '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {

                var options = [];

                res.data.forEach((item) => {
                    let name = item.Name + ' ';
                    name+= item.Description.length>20?item.Description.substring(0,15)+'...':item.Description;
                    options.push({id:item._id,label:name});
                });
                this.setState({options:options});

            })
            .catch((err) => {
                alert('Error: ' + err);
            });
    }

    removeQuestion(index)
    {
        console.log(index);
        this.state.questions.splice(index, 1);
        this.setState({questions:this.state.questions});
    }

    addQuestion()
    {
        if(this.state.selected === undefined)
            return;

        this.state.questions.push({order:this.state.order,id:this.state.selected[0].id,name:this.state.selected[0].label});
        this.setState({
            questions:this.state.questions,
            selected: undefined,
            options: []
        });

        this.state.ref.current.clear();
    }

    onSubmit(e) {
        e.preventDefault();
        console.log("Submitting");
        console.log(this.state.questions);

        const exercise = {
            userId:Cookie.get('userId'),
            questions: this.state.questions,
            name: this.state.name,
            description: this.state.description
        };

        console.log(exercise);

        axios.post(process.env.REACT_APP_SERVER_URL + 'exercises/update/' + this.state.id + '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),exercise)
            .then(res => {
                console.log(res);
                window.location = '/exercises/'+this.props.params;
            })
            .catch((err) => {
                alert('Error: ' + err);
                window.location = '/exercises/'+this.props.params;
            });

    }

    render() {
        return (
            <Card style={{ width: '80%' }} className="mx-auto">
                <Card.Body>
                    <Card.Title>Exercise</Card.Title>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <fieldset>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control value={this.state.name} onChange={e => {this.setState({name:e.target.value})}} />
                                </fieldset>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <fieldset>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control value={this.state.description} onChange={e => {this.setState({description:e.target.value})}} />
                                </fieldset>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridQuestion">
                                <Form.Label>Search for a question</Form.Label>
                                <Typeahead
                                    id="QuestionSelection"
                                    onInputChange={this.onInputChange}
                                    onChange={(selected) => {
                                        this.setState({selected});
                                    }}
                                    options={this.state.options}
                                    ref={this.state.ref}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridOrder">
                                <Form.Label>Order</Form.Label><br/>
                                <InputGroup className="mb-3">
                                    <Form.Control as="select" value={this.state.order} onChange={(e) => {
                                        this.setState({
                                            order: e.target.value
                                        });
                                    }}>
                                        <option>Random</option>
                                        <option>By Index</option>
                                    </Form.Control>
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={this.addQuestion}>Add</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>

                        <Table responsive striped bordered hover>
                            <thead>
                            <tr>
                                <th>Index</th>
                                <th>Name</th>
                                <th>Order</th>
                                <th>Options</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.questions.map((item, i) => {
                                return <tr key={i}>
                                    <td>{i}</td>
                                    <td>{item.name}</td>
                                    <td>{item.order}</td>
                                    <td key={i} style={RemoveBtnStyle} >
                                        <Button variant="danger" onClick={() => this.removeQuestion(i)}>Remove</Button></td>
                                </tr>})}
                            </tbody>
                        </Table>


                        <input type="submit" value="Save" className="btn btn-primary"/>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}
