import React, {Component} from "react";
import axios from 'axios';
import { Table , Button} from 'react-bootstrap';
import Cookie from "js-cookie"

export default class GroupExercises extends Component {
    constructor(props) {
        super(props);

        this.onAttend = this.onAttend.bind(this);

        this.state = {
            exercises: this.props.exercises,
            groupId: this.props.groupId
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


    }

    onAttend(index) {

        console.log('Attending ' + this.state.exercises[index]._id + ' in groupId: ' + this.state.groupId);
        window.location = '/attend?exerciseId='+this.state.exercises[index]._id + '&groupId=' + this.state.groupId
    }

    render() {
        return (
            <div>
                {this.state.exercises.map((item,i) => {
                    return <li key={i}>{item.name} <Button style={{margin:'10px'}}  variant={"success"} onClick={() => this.onAttend(i)}>Attend</Button></li>
                })}
            </div>
        );
    }
}
