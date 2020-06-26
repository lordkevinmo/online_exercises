import React, { Component } from 'react';
import axios from "axios";
import Cookie from "js-cookie";
import GenerateInstructionComponent from "./GenerateInstruction.component";
import {Button, Card, Form, FormControl, InputGroup, Modal} from "react-bootstrap";

export default class Attendance extends Component {

    constructor(props) {
        super(props);

        this.displayQuestion = this.displayQuestion.bind(this);
        this.saveUserOutput = this.saveUserOutput.bind(this);
        this.onFinish = this.onFinish.bind(this);

        this.state = {
            exerciseId:this.props.exerciseId,
            groupId:this.props.groupId,
            questions: undefined,
            session: undefined,
            instructionDEMO: '',
            questionNumber: -1,
            title:'',

            inputs:[],
            values: [],
            instruction:'',
            trigger:'@',

            instructionRef:React.createRef()

        };

    }

    componentDidMount() {

        const body = {
            exerciseId:this.state.exerciseId,
            groupId:this.state.groupId,
        };
        //Recover current session. If not the server will create one
        axios.post(process.env.REACT_APP_SERVER_URL + 'exercises/attend?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),body)
            .then(res => {

                if(res.data.error)
                {
                    alert(res.data.msg);
                    window.location = '/groups/'; //TODO: return to the group exercise page.
                    return;
                }

                console.log('Data received :');
                console.log(res.data);
                this.setState({
                    questions: res.data.questions,
                    session: res.data.session,
                    questionNumber:0,
                    title:res.data.exercise,
                    UserOutput: res.data.session.UserOutput?res.data.session.UserOutput:new Array(res.data.questions.length).fill(0),
                }, () => {
                    this.displayQuestion(0);
                });

                console.log(res.data);
            })
            .catch(err => {
                alert('Error' + JSON.stringify(err));
            })

    }

    displayQuestion(index)
    {
        if(index>=this.state.questions.length)
        {
            this.saveUserOutput();
            alert('OnFinish');
            return;
        }

        this.setState({
            inputs:this.state.questions[index].Inputs,
            values:this.state.session.questionLogs[index].input,
            instruction:this.state.questions[index].Instruction,
            questionNumber:index,
        }, () => {
            this.state.instructionRef.current.onRefresh();
        });

        if(this.state.questionNumber>0)
            this.saveUserOutput();

    }

    saveUserOutput()
    {
        const body = {
            exerciseSessionID:this.state.session._id,
            UserOutput:this.state.UserOutput,
            groupId:this.state.groupId,
        };

        axios.post(process.env.REACT_APP_SERVER_URL + 'exercises/attend/update?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),body)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    onFinish()
    {
        const body = {
            exerciseSessionID:this.state.session._id,
            UserOutput:this.state.UserOutput,
            groupId:this.state.groupId,
        };

        console.log(body);

        axios.post(process.env.REACT_APP_SERVER_URL + 'exercises/attend/submit?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),body)
            .then((res) => {
                console.log(res.data);
                alert('Result: ' + res.data.points + '/' + res.data.details.length);
                window.location = "/groups/" + this.state.groupId
            })
            .catch((err) => {
                console.log(err);
            })
    }


    render() {
        return (
            <div>
                <div style={{textAlign:'center',margin:'10px',marginBottom:'20px'}}><h1>{this.state.title}</h1></div>
                <Card style={{width: '18rem'}} className="mx-auto">
                    <Card.Body>
                        <Card.Title>{'Question ' + (this.state.questionNumber+1) + ': ' + (this.state.questionNumber>=0?this.state.questions[this.state.questionNumber].Name:'')}</Card.Title>
                        {this.state.alert}
                        <GenerateInstructionComponent ref={this.state.instructionRef}
                            inputs={this.state.inputs}
                            values={this.state.values}
                            instruction={this.state.instruction}
                            trigger={this.state.trigger}/>
                        <br />
                        <InputGroup className="mb-3">
                            <FormControl
                                type="number"
                                value={this.state.questionNumber>=0?this.state.UserOutput[this.state.questionNumber]:0}
                                onChange={(e) => {
                                    //console.log(e.target.value + ' for ' + this.state.questionNumber);
                                    this.state.UserOutput[this.state.questionNumber] = e.target.value;
                                    this.setState({
                                        UserOutput:this.state.UserOutput,
                                    });
                                }}
                            />
                        </InputGroup>
                        <div style={{textAlign:'center',margin:'10px',marginTop:'20px'}}>
                            {this.state.questionNumber>=1?<Button variant="secondary" onClick={() => {this.displayQuestion(this.state.questionNumber-1)}}>Previous</Button>:''}
                            {this.state.questions?(this.state.questionNumber<this.state.questions.length-1?<Button variant="secondary" onClick={() => {this.displayQuestion(this.state.questionNumber+1)}}>Next</Button>:''):''}
                        </div>
                    </Card.Body>
                </Card>
                <div style={{textAlign:'center',margin:'10px',marginTop:'20px'}}>
                    <Button style={{width:'18rem'}} variant="success" onClick={this.onFinish}>Finish</Button>
                </div>

            </div>
        );
    }
}
