import React, {Component} from "react";
import axios from 'axios';
import { Card , Breadcrumb,Button,Nav} from 'react-bootstrap';
import Cookie from "js-cookie"
import GroupMembers from "./GroupPanels/GroupMembers.component";
import GroupExercises from "./GroupPanels/GroupExercises.component";
import GroupResults from "./GroupPanels/GroupResults.component";
import GroupAdvancedResults from "./GroupPanels/GroupAdvancedResults.component";


const cardStyle = {
  'width': '90%'
};

export default class GroupSection extends Component {
    constructor(props) {
        super(props);

        this.onNavUpdate = this.onNavUpdate.bind(this);
        this.displayExerciseResults = this.displayExerciseResults.bind(this);

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

        switch (this.state.navigation[index].name) {
            case "Exercises":
                this.setState({
                    navPos: index,
                    body: <Card.Body><GroupExercises exercises={this.state.group.exercises} groupId={this.state.group._id}/></Card.Body>
                });
                break;

            case "Members":
                this.setState({
                    navPos: index,
                    body: <Card.Body><GroupMembers groupId={this.state.group._id}/></Card.Body>
                });
                break;

            case "Results":
                this.setState({
                    navPos: index,
                    body: <Card.Body><GroupResults groupId={this.state.group._id} displayExerciseResults={(exercise) => this.displayExerciseResults(exercise)}/></Card.Body>
                });
                break;

            case "Settings":
                this.setState({
                    navPos: index,
                    body: <Card.Body>Settings</Card.Body>
                });
                break;

            default:
                this.setState({
                    navPos: index,
                    body: <Card.Body>Error nothing selected</Card.Body>
                });
                break;

        }

    }

    //Communication between the tab Results and the section component.
    displayExerciseResults(exercise)
    {
        this.setState({
            navPos: -1,
            body: <Card.Body><GroupAdvancedResults groupId={this.state.group._id} exercise={exercise}/></Card.Body>
        });
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
                    this.state.navigation.push({url:"#Results",name:"Results"});
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
