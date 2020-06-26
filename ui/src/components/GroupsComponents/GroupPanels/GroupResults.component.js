import React, {Component} from "react";
import axios from 'axios';
import { Table , Button, Card} from 'react-bootstrap';
import Cookie from "js-cookie"

export default class GroupResults extends Component {

    constructor(props) {
        super(props);

        this.state = {
            groupId: this.props.groupId,
            exercises: [],
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {
        console.log(this.props.token);

        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }

        axios(process.env.REACT_APP_SERVER_URL + 'exercises/group?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId') + "&groupId=" + this.state.groupId)
            .then(res => {
                console.log(res);
                console.log(res.data);

                this.setState({exercises:res.data});
            })
            .catch((err) => {
                console.log(err);
            });

    }

    displayExercise(exercise)
    {
        this.props.displayExerciseResults(exercise);
    }


    render() {
        return (
            <div>
                {this.state.exercises.map((item,i) => {
                    return <Card key={i} style={{margin:"10px"}}>
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>
                                {item.description}
                            </Card.Text>
                            <Button variant="primary" onClick={() => this.displayExercise(item)}>Display results</Button>
                        </Card.Body>
                    </Card>
                })}
            </div>
        );
    }
}
