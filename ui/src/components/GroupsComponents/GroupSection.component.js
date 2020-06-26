import React, {Component} from "react";
import axios from 'axios';
import { Card , Breadcrumb,Button,Nav} from 'react-bootstrap';
import Cookie from "js-cookie"
import GroupMembers from "./GroupMembers.component";
import GroupExercises from "./GroupExercises.component";



const cardStyle = {
  'width': '90%'
};

export default class GroupSection extends Component {
    constructor(props) {
        super(props);

        this.onNavUpdate = this.onNavUpdate.bind(this);

        this.state = {
            name: this.props.params,
            body: <div></div>,
            group: {},
            navigation: [
                {url:"#Exercises",name:"Exercises"}],
            isAdmin: false,
            navPos:0
        };

    }

    onNavUpdate(index)
    {
        console.log(index);


        if(this.state.navigation[index].name==='Members')
        {
            this.setState({
                navPos: index,
                body: <Card.Body><GroupMembers groupId={this.state.group._id}/></Card.Body>
            });
        }
        else
        {
            this.setState({
                navPos: index,
                body: <Card.Body><GroupExercises exercises={this.state.group.exercises} groupId={this.state.group._id}/></Card.Body>
            });
        }

        /*this.setState({navPos:index,
            body:
                <Card.Body>
                    <Card.Title>{this.state.navigation[index].name}</Card.Title>
                    <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>});*/

    }



    //Right before anything load the page this is called
    componentDidMount() {

        axios(process.env.REACT_APP_SERVER_URL + 'groups/' + this.state.name + '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then((response) => {
                const group = response.data[0];

                group.admin.forEach((user,i) => {
                    if(user===Cookie.get('userId'))
                    {
                        this.setState({isAdmin:true});
                    }
                }) ;

                if(this.state.isAdmin)
                {
                    this.state.navigation.push({url:"#Members",name:"Members"});
                    this.state.navigation.push({url:"#Settings",name:"Settings"});
                }

                this.setState({
                     group:group
                });
                this.onNavUpdate(0);
            })
            .catch((err) => {
                alert('Error: ' + err);
                window.location = '/groups';
            })

    }

    render() {
        return (
            <div className="mx-auto" >
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/groups">Groups</Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {this.state.group.name}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Card style={cardStyle} className="mx-auto">
                    <Card.Header>
                        <Nav variant="tabs" defaultActiveKey={this.state.navigation[0].url}>
                            {this.state.navigation.map((nav,i) => {
                                return  <Nav.Item key={i}>
                                    <Nav.Link href={nav.url} onClick={() => this.onNavUpdate(i)}>{nav.name}</Nav.Link>
                                </Nav.Item>
                            })}
                        </Nav>
                    </Card.Header>
                    {this.state.body}
                </Card>
            </div>
        );
    }
}
