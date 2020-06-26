import React, {Component} from "react";
import axios from 'axios';
import { Card , CardColumns,Button,InputGroup,FormControl,Form} from 'react-bootstrap';
import Cookie from "js-cookie"

const tableStyle = {
    'width': '90%',
    'textAlign': 'center'
};

const cardStyle = {
    'color': 'black',
    'margin':'15px'
};

export default class Groups extends Component {
    constructor(props) {
        super(props);

        this.onInviteGroupIdChange = this.onInviteGroupIdChange.bind(this);
        this.onClickJoin = this.onClickJoin.bind(this);

        this.state = {
            groups: [],
            isGroupIdInputDisable: false,
            invitationGroupId: ''
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {

        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }

        axios(process.env.REACT_APP_SERVER_URL + 'groups?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {

                this.setState({
                    groups: res.data
                })
            })
            .catch(err => {
                alert("Error: " + err);
            })

    }

    onClickJoin()
    {
        if(this.state.invitationGroupId==='')
            return;

        this.setState({
            isGroupIdInputDisable:true
        });

        //Check the token written doesn't belong to one of the group the user is already inside

        let end = false;
        this.state.groups.forEach((item,i) => {
           if(item._id===this.state.invitationGroupId)
           {
               alert("You are already in this group.");
               end = true;
               this.setState({
                   invitationGroupId: '',
                   isGroupIdInputDisable:false
               })

           }
        });

        if(end)
            return;

        const group = {
            GroupId: this.state.invitationGroupId
        };

        axios.post(process.env.REACT_APP_SERVER_URL + 'groups/join?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),group)
            .then(res => {
                console.log(res.data);
                window.location = "/groups"
            })
            .catch(err => {
                alert("Error: " + err);
            })
    }

    onInviteGroupIdChange(e)
    {
        console.log(e.target.value);
        this.setState({
            invitationGroupId:e.target.value
        })
    }

    render() {
        return (
            <div style={tableStyle} className="mx-auto" >
                <div style={{width:'60%'}} className="mx-auto">
                    <Form.Label>Join a group</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Invitation Id</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Group Id"
                            aria-describedby="basic-addon1"
                            onChange={this.onInviteGroupIdChange}
                            disabled={this.state.isGroupIdInputDisable}
                            value={this.state.invitationGroupId}
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={this.onClickJoin} disabled={this.state.isGroupIdInputDisable}>Join</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            <CardColumns >
                {this.state.groups.map(function(item, i){
                    return <a href={"/groups/" + item._id} style={{ width: '18rem' }} key={i}>
                                <Card border="primary">
                                <Card.Body style={cardStyle}>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>

                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">Last updated 3 mins ago</small>
                                </Card.Footer>
                                </Card>
                            </a>
                })}
            </CardColumns>
                <Button variant="primary" size="lg" className="mx-auto" style={{'margin':'30px'}} href={"/groups/new"}>
                    Create a group
                </Button>
            </div>
        );
    }
}
