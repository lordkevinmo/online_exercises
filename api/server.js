const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connectDb = require('./src/connection');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = 8080;
app.use(cors());
app.use(bodyParser.json()); // <-- this guy!
app.use(cookieParser());

/** Routes **/
const userRoute = require('./src/routes/users');
const groupRoute = require('./src/routes/groups');
const codeRoute = require('./src/routes/code');
const questionsRoute = require('./src/routes/questions');
const exercisesRoute = require('./src/routes/exercises');
const debugRoute = require('./src/routes/debug'); //TODO: Need to be remove for production


app.use('/users',userRoute);
app.use('/groups',groupRoute);
app.use('/code',codeRoute);
app.use('/questions',questionsRoute);
app.use('/exercises',exercisesRoute);
app.use('/debug',debugRoute); //TODO: Need to be remove for production



app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);

  connectDb().then(() => {
    console.log('MongoDb connected');
  });
});
