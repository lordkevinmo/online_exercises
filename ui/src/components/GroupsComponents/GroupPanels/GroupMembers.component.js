import React, {Component} from "react";
import axios from 'axios';
import { Table , Button} from 'react-bootstrap';
import Cookie from "js-cookie"

export default class GroupMembers extends Component {
    constructor(props) {
        super(props);

        this.setUser = this.setUser.bind(this);

        this.state = {
            members: [],
            admins: [],
            pending: [],
            banned: [],
        };

    }

    //Right before anything load the page this is called
    componentDidMount() {
        console.log(this.props.groupId);

        if(!Cookie.get('token'))
        {
            window.location = '/';
            return;
        }

        axios(process.env.REACT_APP_SERVER_URL + 'groups/members/'+ this.props.groupId+ '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'))
            .then(res => {
                console.log(res);
                this.setState({
                    members: res.data[0].members,
                    admins: res.data[0].admins,
                    pending: res.data[0].pending,
                    banned: res.data[0].banned
                })
            })
            .catch(err => {
                console.log("Error: " + err);
                window.location = '/groups/'+this.props.groupId;
            })

    }

    setUser(action)
    {
        console.log(action);

        axios.post(process.env.REACT_APP_SERVER_URL + 'groups/setUser/' + this.props.groupId+ '?token=' + Cookie.get('token') + "&userId="+Cookie.get('userId'),action)
            .then((res) => {
                console.log(res.data);
                this.componentDidMount();
            })
            .catch((err) => {
                alert('Error:' + err);
            })
    }


    render() {
        return (
            <div>
                <div>Members </div>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>University</th>
                        <th>Email</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.members.map((user,i) => {
                        return <tr key={i} >
                            <td>{i}</td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.university}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="outline-warning" onClick={() => { this.setUser({user:user._id,action:"Promote"})}}>Promote to admin</Button>
                                <Button variant="outline-danger" onClick={() => { this.setUser({user:user._id,action:"Ban"})}}>Ban</Button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </Table>

                <div>Admins </div>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>University</th>
                        <th>Email</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.admins.map((user,i) => {
                        return <tr key={i}>
                            <td>{i}</td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.university}</td>
                            <td>{user.email}</td>
                            <td >
                                <Button variant="outline-danger" onClick={() => { this.setUser({user:user._id,action:"Degrade"})}}>Remove rights</Button></td>
                        </tr>
                    })}
                    </tbody>
                </Table>

                <div>Pending </div>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>University</th>
                        <th>Email</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.pending.map((user,i) => {
                        return <tr key={i}>
                            <td>{i}</td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.university}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="outline-primary" onClick={() => { this.setUser({user:user._id,action:"Accept"})}}>Accept</Button>
                                <Button variant="outline-danger" onClick={() => { this.setUser({user:user._id,action:"Ban"})}}>Ban</Button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </Table>

                <div>Banned </div>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>University</th>
                        <th>Email</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.banned.map((user,i) => {
                        return <tr key={i}>
                            <td>{i}</td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.university}</td>
                            <td>{user.email}</td>
                            <td> <Button variant="outline-primary" onClick={() => { this.setUser({user:user._id,action:"UnBan"})}}>UnBan</Button></td>
                        </tr>
                    })}
                    </tbody>
                </Table>

            </div>
        );
    }
}
