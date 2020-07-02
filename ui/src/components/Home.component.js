import React, {Component} from "react";
import axios from 'axios';
import { Card , Accordion, Button} from 'react-bootstrap';
import Cookie from "js-cookie"


const FAQ = [
    {title:"How to create a question ?", answer:<Card.Body style={{padding: "10px"}}>You need to be log in, then go to <a href={"/questions"}>Questions</a>, click on the <a
            href="/questions/new" className="mx-auto btn btn-primary btn-lg"
            style={{padding: "10px","font-size": "10px"}}>Create a question</a> button</Card.Body>},
    {title:"How to create an exercise ?", answer:<Card.Body style={{padding: "10px"}}>You need to be log in, then go to <a href={"/exercises"}>Exercises</a>, click on the <a
            href="/exercises/new" className="mx-auto btn btn-primary btn-lg"
            style={{padding: "10px","font-size": "10px"}}>Create an exercise</a> button</Card.Body>},
    {title:"How does an exercise work ?",answer:<Card.Body style={{padding: "10px"}}>In order to make an exercise you need to create question(s) first. Then in the exercise editor you can search by name the question(s) to add to the exercise.</Card.Body>},
    {title:"How to attend for an exercise ?",answer:<Card.Body style={{padding: "10px"}}>First you need to assign the exercise you want to attend to a group, using the assign button on the exercise list, you can search group by name. Then inside the group, you can attend the exercise.</Card.Body>},
    {title:"How to see the result(s) of an exercise ?",answer:<Card.Body style={{padding: "10px"}}>You can see the results only if you are admin of the group. Inside the group where the exercise is assign, you can go to the "results" tab and select the exercise.</Card.Body>},
];




export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            FAQ: FAQ,
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {

    }

    render() {
        return (
            <div style={{padding:"10px"}}>
                <h3>Self-Correcting Exams</h3>
                <Accordion defaultActiveKey="-1">
                    {this.state.FAQ.map((item,i) => {
                        return <Card key={i}>
                            <Card.Header style={{padding: "5px"}}>
                                <Accordion.Toggle as={Button} variant="link" eventKey={"" + i}>
                                    {item.title}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={"" + i}>
                                {item.answer}
                            </Accordion.Collapse>
                        </Card>
                    })}
                </Accordion>
            </div>
        );
    }
}
