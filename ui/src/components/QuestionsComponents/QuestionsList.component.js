import React, {Component} from "react";
import axios from 'axios';
import { Card , CardColumns,Button,InputGroup,FormControl,Form} from 'react-bootstrap';
import Cookie from "js-cookie"

const cardStyle = {
    'color': 'black',
    'margin':'15px'
};

const tableStyle = {
    'width': '90%',
    'textAlign': 'center'
};

export default class Groups extends Component {
    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);

        this.state = {
            questions: []
        };
    }

    //Right before anything load the page this is called
    componentDidMount() {

        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }

        axios(process.env.REACT_APP_SERVER_URL + 'questions?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {

                this.setState({
                    questions: res.data
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

    render() {
        return (
            <div style={tableStyle} className="mx-auto">
                <h3>Questions</h3>

                <CardColumns >
                    {this.state.questions.map((item, i) => {
                        return <div key={i}>
                            <Card border={item.IsDraft?'danger':item.IsTemplate?'success':'info'}>
                                    <Card.Body style={cardStyle}>
                                        <Card.Title>{item.Name}</Card.Title>
                                        <Card.Text>
                                            {item.Description}
                                        </Card.Text>
                                        <small className="text-muted">{item.IsDraft?'Draft question':item.IsTemplate?'Template question':'Finished question'}</small>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button disabled={true} variant="danger" onClick={() => this.onDelete(item._id)} style={{margin:'5px'}}>Delete</Button>
                                        <Button variant="info" onClick={() => {window.location = "/questions/" + item._id}} style={{margin:'5px'}}>Open</Button>

                                    </Card.Footer>
                                </Card>
                        </div>

                    })}
                </CardColumns>
                <Button variant="primary" size="lg" className="mx-auto" style={{'margin':'30px'}} href={"/questions/new"}>
                    Create a question
                </Button>
            </div>
        );
    }
}
