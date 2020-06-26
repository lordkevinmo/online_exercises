import React, {Component} from "react";
import axios from 'axios';
import {Form, InputGroup, Col, Button, Card, Table} from "react-bootstrap";
import Cookie from "js-cookie";
import {Typeahead} from 'react-bootstrap-typeahead';

const RemoveBtnStyle = {
    'textAlign': 'center'
};

export default class InputEditor extends Component {

    constructor(props) {
        super(props);

        this.addInput = this.addInput.bind(this);
        this.removeInput = this.removeInput.bind(this);


        this.state = {
            Inputs: [{name:'A',type:'Integer',index:0,min:0,max:10},{name:'B',type:'Integer',index:1,min:0,max:10}],
            type: "Integer",
            name: "",
            min: 0,
            max: 10,
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {
        /*axios.get(process.env.REACT_APP_SERVER_URL + 'users?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {
                this.setState({UserCourses:res.data.courses});
            })
            .catch((err) => {
                alert('Error: ' + err);
            });*/
        this.props.SetInputsEditor(this.state.Inputs);
    }

    removeInput(index)
    {
        console.log(index);
        this.state.Inputs.splice(index, 1);
        this.setState({Inputs:this.state.Inputs});

        //Notify the parent
        this.props.SetInputsEditor(this.state.Inputs);
    }

    addInput()
    {

        this.state.Inputs.push({index:this.state.Inputs.length,type:this.state.type,name:this.state.name,min:this.state.min,max:this.state.max})

        this.setState({
            Inputs:this.state.Inputs,
            name:""
        });

        //Notify the parent
        this.props.SetInputsEditor(this.state.Inputs);
    }

    setInputs(inputs)
    {
        this.setState({
            Inputs:inputs
        })
    }

    render() {
        return (
            <Card className="mx-auto">
                <Card.Body>
                    <Card.Title>Function inputs</Card.Title>
                    <Form onSubmit={this.onSubmit}>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridType">
                                <Form.Label>Type</Form.Label>
                                <Form.Control as="select" value={this.state.type} onChange={(e) => {
                                    this.setState({
                                        type: e.target.value
                                    });
                                }}>
                                    <option>Integer</option>
                                    <option>Decimal</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={this.state.name} onChange={(e) => {
                                    this.setState({
                                        name: e.target.value
                                    });
                                }}>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridMin">
                                <Form.Label>Min</Form.Label>
                                <Form.Control type="number" value={this.state.min} onChange={(e) => {
                                    this.setState({
                                        min: e.target.value
                                    });
                                }}>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridMax">
                                <Form.Label>Max</Form.Label>
                                <Form.Control type="number" value={this.state.max} onChange={(e) => {
                                    this.setState({
                                        max: e.target.value
                                    });
                                }}>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>


                        <div style={{textAlign:"end",margin:"10px"}}>
                            <Button variant="outline-secondary" onClick={this.addInput}>Add</Button>
                        </div>

                        <Table responsive striped bordered hover>
                            <thead>
                            <tr>
                                <th>Index</th>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Min</th>
                                <th>Max</th>
                                <th>Options</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.Inputs.map((item, i) => {
                                return <tr key={i}>
                                    <td>{item.index}</td>
                                    <td>{item.type}</td>
                                    <td>{item.name}</td>
                                    <td>{item.min}</td>
                                    <td>{item.max}</td>
                                    <td key={i} style={RemoveBtnStyle} >
                                        <Button variant="danger" onClick={() => this.removeInput(i)}>Remove</Button></td>
                                </tr>})}
                            </tbody>
                        </Table>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}
