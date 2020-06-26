import React from "react";
import MonacoEditor from "react-monaco-editor";
import {Button, Container, Form, Modal, Card, InputGroup, FormControl, Breadcrumb} from 'react-bootstrap';
import axios from 'axios';
import Cookie from "js-cookie"
import InputEditor from "./InputEditor.component";
import EditInstruction from "./EditInstruction.component";
import GenerateInstructionComponent from "../AttendComponents/GenerateInstruction.component";


const defaultCode = `/* 
   The returned object by the main function will be the expected
   element the user should input following the instruction
 */

function main(input)
{
    console.log("Hello world!");
    let output = input;
    return output;
}`;

const btnStyle = {
  margin:"10px"
};

export default class CodeEditor extends React.Component {

    constructor(prop) {
        super(prop);

        this.onChange = this.onChange.bind(this);
        this.editorDidMount = this.editorDidMount.bind(this);

        //Modal functions
        this.setModalDemoShow = this.setModalDemoShow.bind(this);
        this.onSubmitDemoModal = this.onSubmitDemoModal.bind(this);

        //Buttons
        this.run = this.run.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDemo = this.onDemo.bind(this);
        this.onDelete = this.onDelete.bind(this);

        //This function will be used as callback by the child InputEditor to set the inputs.
        this.SetInputsEditor = this.SetInputsEditor.bind(this);

        this.state = {
            //Question basic
            id:this.props.params,
            name: '',
            description:'',
            isTemplate:false,
            isDraft: false,
            //Instruction
            instructionHTML:'',
            //Editor
            code: defaultCode,
            theme: "vs-light",
            editor:undefined,
            logs: "",
            inputs: undefined,
            instructionRef:  React.createRef(),
            inputRef:  React.createRef(),

            //Demo
            showDemoModal:false,
            instructionDEMO:'',
            demoForm:0,
            outputValue:0,
            alert:'',

            //Saving
            saving:true,

        };
    }
    componentDidMount() {

        if (!Cookie.get('token')) {
            window.location = '/';
        }

        axios(process.env.REACT_APP_SERVER_URL + 'questions/'+ this.state.id + '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {
                console.log(res);
                this.setState({
                    name:res.data.Name,
                    description:res.data.Description,
                    isTemplate:res.data.IsTemplate,
                    isDraft:res.data.IsDraft,
                    inputs:res.data.Inputs,
                    instruction:res.data.Instruction,
                    code: res.data.Function?res.data.Function:defaultCode,
                    instructionHTML:<EditInstruction ref={this.state.instructionRef} text={res.data.Instruction} isReadOnly={false}/>,
                    saving:false,
                });

                //this.state.instructionRef.current.setInstructions(res.data.Instruction)
                this.state.inputRef.current.setInputs(res.data.Inputs);
                this.state.instructionRef.current.setInputs(this.state.inputs);

            })
            .catch(err => {
                alert('Err: ' + JSON.stringify(err));
                //window.location = "/";
            })
    }

    onChange (newValue) {
        //console.log("onChange", newValue); // eslint-disable-line no-console
        this.setState({code:newValue});
    };

    editorDidMount (editor) {
        // eslint-disable-next-line no-console
        //console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
        this.setState({editor:editor});
    };

    run() {
        //console.log(this.state.editor.getValue());

        const code = {
            code:this.state.editor.getValue(),
            inputs:this.state.inputs
        };

        axios.post(process.env.REACT_APP_SERVER_URL + 'code/execute?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),code)
            .then((res) => {

                let logs = "";

                if(res.data.input !== undefined)
                    logs= "[Input] " + JSON.stringify(res.data.input) + "\n";

                if(res.data.logs !== undefined && res.data.logs.length > 0)
                    logs += "[Logs]" + res.data.logs;

                if(res.data.output !== undefined)
                    logs+= "\n\n[Output] " + JSON.stringify(res.data.output);


                this.setState({logs:logs});

            })
            .catch((err) => alert('Error: ' + err));
    };

    SetInputsEditor(inputs)
    {
        this.setState({inputs:inputs});
        if(this.state.instructionRef.current)
            this.state.instructionRef.current.setInputs(inputs);
    }

    onSave(callback)
    {
        console.log("OnSave");

        this.setState({
            saving:true
        });

        const question = {
            Name: this.state.name,
            Description: this.state.description,
            IsDraft: this.state.isDraft, //Is the question finish to be created
            IsTemplate: this.state.isTemplate, //Is this question a template to demonstrate functionality (public)
            Inputs: this.state.inputs,
            Instruction: this.state.instructionRef.current.getInstructions(), //Example Multiply #A by #B.
            Function: this.state.code, //Contain the function
            OutputType: undefined, //Example : "Integer"
            MarginError: undefined, //Example 4%
        };

        console.log(question);

        axios.post(process.env.REACT_APP_SERVER_URL + 'questions/update/'+ this.state.id + '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),question)
            .then((res) => {
                console.log(res.data);

                if(typeof callback === "function")
                    callback();
                else{
                    console.log('Saved');
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    onDemo()
    {

        this.onSave(() => {

            console.log('OnDemo');
            axios.get(process.env.REACT_APP_SERVER_URL + 'code/simulate/'+ this.state.id + '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
                .then((res) => {
                    let data = res.data;

                    this.setState({
                        instructionDEMO:<GenerateInstructionComponent inputs={data.inputs} values={data.values} instruction={data.instruction} trigger={'@'}/>,
                        outputValue:res.data.output,
                        saving: false
                    }, () => {
                        this.setModalDemoShow(true)
                    });



                })
                .catch(err => {
                    alert(err);
                })

        });

    }

    onDelete()
    {
        console.log('OnDelete');
        //TODO: ask for confirmation #modal
    }

    setModalDemoShow(value)
    {
        this.setState({showDemoModal:value})
    }

    onSubmitDemoModal()
    {
        if(this.state.outputValue + '' === this.state.demoForm + '')
        {
            this.setState({
                alert: <div className="alert alert-success" role="alert">
                            Correct
                        </div>,
                demoForm:0
            })
        }
        else
        {
            this.setState({
                alert: <div className="alert alert-danger" role="alert">
                    Wrong, the answer was: {this.state.outputValue} you type {this.state.demoForm}
                </div>,
                demoForm:0
            })
        }
    }

    render() {
        const {code, theme} = this.state;
        const options = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            automaticLayout: false,
        };
        return (
            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/questions">Questions</Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {this.state.name}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <h3>Question id: {this.state.id}</h3>

                <div style={{marginTop:"20px",marginBottom:"50px"}}>
                    {this.state.instructionHTML}
                </div>

                <div style={{marginTop:"20px",marginBottom:"50px"}}>
                    <InputEditor SetInputsEditor={this.SetInputsEditor} ref={this.state.inputRef}/>
                </div>

                <Card style={{marginTop:"20px",marginBottom:"50px"}}>
                    <Card.Body>
                        <Card.Title>JavaScript Editor</Card.Title>
                        <MonacoEditor class={".rounded-lg"}
                                      height="400"
                                      language="javascript"
                                      value={code}
                                      options={options}
                                      onChange={this.onChange}
                                      editorDidMount={this.editorDidMount}
                                      theme={theme}
                        />
                        <div style={{textAlign:"end",margin:"10px"}}>
                            <Button variant="success" onClick={this.run}>Run</Button>
                        </div>
                    </Card.Body>
                </Card>

                <Card style={{height:"400px",marginTop:"20px",marginBottom:"50px"}}>
                    <Card.Body>
                        <Card.Title>Console</Card.Title>
                        <span style={{whiteSpace:" pre-line",overflow:"auto",display:"block"}}>{this.state.logs}</span>
                    </Card.Body>
                </Card>

                <Card style={{marginTop:"20px",marginBottom:"50px"}}>
                    <Card.Body>
                        <Card.Title>Settings</Card.Title>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name of the question</Form.Label>
                            <Form.Control type="text" placeholder="Enter a name" value={this.state.name}
                                          onChange={(e) => this.setState({name:e.target.value})}/>
                            <Form.Text className="text-muted">
                                This name will help you found this question later.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows="3" value={this.state.description}
                                          onChange={(e) => this.setState({description:e.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId="templateCheckbox">
                            <Form.Check type="checkbox" label="This question is a template (public)" checked={!!this.state.isTemplate}
                                        onChange={(e) => this.setState({isTemplate:e.target.checked})}/>

                        </Form.Group>

                        <Form.Group controlId="draftCheckbox">
                            <Form.Check type="checkbox" label="Put in my drafts" checked={!!this.state.isDraft}
                                        onChange={(e) => this.setState({isDraft:e.target.checked})}/>
                        </Form.Group>

                        <div style={{textAlign:"end",margin:"10px"}}>
                            <Button variant="danger" onClick={this.onDelete} disabled={true} >Delete this question</Button>
                            <Button variant="info" style={btnStyle} onClick={this.onDemo} disabled={this.state.saving}>Run demonstration</Button>
                            <Button variant="success" onClick={this.onSave} disabled={this.state.saving}>Save</Button>
                        </div>
                    </Card.Body>
                </Card>

                <Modal
                    show={this.state.showDemoModal}
                    onHide={() => this.setModalDemoShow(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.state.name}
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <p></p>
                        <h5>Instruction</h5>
                        {this.state.alert}
                        {this.state.instructionDEMO}
                        <br />
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Value" value={this.state.demoForm} type="number"
                                onChange={(e) => this.setState({demoForm:e.target.value})}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.onSubmitDemoModal}>Submit</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.setModalDemoShow(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}
