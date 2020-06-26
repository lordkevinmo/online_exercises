import React from 'react';
import { BrowserRouter as Router, Route ,useParams,useRouteMatch,Switch,useLocation} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Navigation from "./components/navbar.component";
import Login from "./components/Login.component";
import SignUp from "./components/SignUp.component";

//Group
import GroupsList from "./components/GroupsComponents/GroupsList.component";
import CreateGroup from "./components/GroupsComponents/CreateGroup.component";
import GroupSection from "./components/GroupsComponents/GroupSection.component"

//Question
import QuestionsList from "./components/QuestionsComponents/QuestionsList.component";
import CreateQuestion from "./components/QuestionsComponents/CreateQuestion.component";
import QuestionEditor from "./components/QuestionsComponents/QuestionEditor.component";

//Exercise
import CreateExercise from "./components/ExercisesComponents/CreateExercise.component";
import ExercisesList from "./components/ExercisesComponents/ExercisesList.component";
import EditExercise from "./components/ExercisesComponents/EditExercises.component";

//Attendance
import Attendance from "./components/AttendComponents/Attendance.component";


const containerStyle = {
    'maxWidth': '100%',
    'paddingLeft': '0px',
    'paddingRight': '0px'
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function App() {
  return (
      <Router>
          <div className="container" style={containerStyle}>
            <Navigation />
            <br/>
            <Route path="/login" component={Login}/>
            <Route path="/Signup" component={SignUp}/>

              <Route path="/groups">
                  <GroupsRoute/>
              </Route>

            <Route path="/questions">
                <QuestionsRoute/>
            </Route>

              <Route path="/exercises">
                  <ExercicesRoute/>
              </Route>

              <Route path="/attend">
                  <Attend />
              </Route>

          </div>
      </Router>
  );
}

/**
 * Groups routing
 * **/
function GroupsRoute() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <GroupsList/>
                </Route>
                <Route exact path={`${path}/new`}>
                    <CreateGroup/>
                </Route>
                <Route path={`${path}/:id`}>
                    <Group />
                </Route>
            </Switch>
        </div>
    );
}
function Group() {
    let { id } = useParams();
    return (
        <GroupSection
            params={id}
        />
    );
}

/**
 * Questions routing
 * **/
function QuestionsRoute() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <QuestionsList/>
                </Route>
                <Route exact path={`${path}/new`}>
                    <CreateQuestion/>
                </Route>
                <Route path={`${path}/:id`}>
                    <Question />
                </Route>
            </Switch>
        </div>
    );
}
function Question() {
    let { id } = useParams();
    return (
        <div>
            <QuestionEditor params={id}/>
        </div>
    );
}

/**
 * Exercices routing
 * **/
function ExercicesRoute() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <ExercisesList/>
                </Route>
                <Route exact path={`${path}/new`}>
                    <CreateExercise/>
                </Route>
                <Route path={`${path}/:id`}>
                    <Exercice/>
                </Route>
            </Switch>
        </div>
    );
}
function Exercice() {
    let {id} = useParams();
    return (
        <div>
            <EditExercise params={id}/>
        </div>
    );
}

function Attend() {
    let query = useQuery();
    return (
        <Attendance groupId={query.get("groupId")} exerciseId={query.get("exerciseId")}/>
    );
}
export default App;
