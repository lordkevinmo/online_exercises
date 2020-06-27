## TODO

#### General
- [x] Users can create account and group(s)
- [x] Users can be admin and members in differents groups
- [x] We can have more than one admin in a group (which mean more than one person can create/correct/delete exercises)
- [ ] Make a calendar with a list of coming exercises
- [ ] Templates for each type of question should be available to help people understand HOW to use them
- [ ] Make a better nomenclature
	- [ ] Consistent naming of variables
	- [ ] Make a better usage of Components and make them reusable (merge QuestionList/GroupList/ExerciseList, same for create)
- [ ] Use capcha for login/sign up
- [ ] Generate private key for JsonWebToken
- [ ] During the first launch of the system, a default admin user is created

#### Creator of a group
- [x] They can accept/refuse user
- [x] They can copy an invitation link for groups
- [x] They can create exercises
- [x] They can see the results of any exercises assign to a group per user per question
- [ ] They can change settings of the group
- [x] They can assign an exercise to a group
	- [ ] Check no duplicate exercise in a group

#### User
- [x] User can join group(s)
- [x] User can see exercises in the group
- [x] User can do exercises
- [x] User can see all the groups(s) they are inside
- [ ] User can see their marks
- [ ] User can report a questions/ask for help maybe
- [ ] User can access history (review questions)

# Exercise
An exercise is composed of one or many questions (different type possible)

- [ ] They can define a timelimit
- [ ] They can define a date limit (day/hours/mins/seconds)
- [x] They can define name and description
- [x] They can make the orders of questions randomly (default: true)
- [ ] They can make questions depending on others (then random order will be disable for those questions) (complicated)
- [x] They can allow user to see previous questions (default: true)
- [ ] Search question by tag(s)
- [ ] Make group search non case-sensitive
- [ ] TODO: make an aggreation when quering the questions in an exercises (currently name and description of question are ALSO saved in exercise "question" array which should ONLY be _id.)
- [x] When a question is edited, all exerciseSession which contain this question AND are not finished will be removed.
- [x] Each time a user finish one of the many questions in an exercise it is saved in his userSession (server) and can be recover if he login/logout somewhere else.
- [x] Owner can add question to an exercise (TODO: CHECK THE QUESTION ADDED BELONG TO THE OWNER (server: /update/:id ) )
- [ ] Cannot assign an exercise with 0 question to a group.


# Type of question

### Textual input
The user write in an text area his/her answer and the creator of the question will be able to review it manually

- [ ] Creator can write instruction(s)
- [ ] Creator can review user's answer
- [ ] Creator can limit the maximum number of characters

### Multiple choice questions
The creator can write instructions, and create a list of solution (fake and real) and the user has to choose the right one to have the points

- [ ] Creator can write instruction(s)
- [ ] Creator can put write many answers (fake or real)
- [ ] Creator can put one answsers has real
- [ ] Creator can choose to display only a range of answers over all that they wrote (example they wrote 10 fake answers and 2 real, they only want 4 choices for the user, then the server will choose 1 true and 3 false)

### Computed answer
The creator create a algorithm in JavaScript to computed automatically the answer from procedural input. 
The user will see a instruction text (with random value in specific place), he will write his result in a input box.
Finally the server will run the script of the creator to check if the user answser correspond to the output of the scripts.

- [x] Using **custom** Javascript function(s)
- [x] During creation of the question the creator can run the text and see the console output
- [x] The script will be executed on the server side (using VM2)
- [x] Creator can run the question (Demonstration mode)
- [x] When clicking on demo, the question will be saved before.
- [x] Creator can name and write a description about the question.
- [ ] Creator can delete a question (safely => check it is not used in any exercise)

- [ ] They can allow user to view HOW the value has been computed (when exercises finish and time over for all user)
- [ ] Creator can put tags to classify their questions


#### Instruction editor
The creator can write instruction 

- [x] Creator can mention the name of the inputs, in the final exercise, the mention will be replace by the value. Trigger: '@' [draft-js-mention-plugin](https://www.draft-js-plugins.com/plugin/mention)
- [x] Creator can write mathematical expression using [draft-js-mathjax-plugin](https://github.com/efloti/draft-js-mathjax-plugin)
	- [x] Fix `store.completion is not a function` issue. Using [fixed-draft-js-mathjax-plugin] (https://github.com/axel0070/fixed-draft-js-mathjax-plugin)
	- [ ] Fix readOnly ignored by draft-js-mathjax plugin
	- [x] Own implementation or search/replace in ContentState
	- [ ] Implement autocompletion in draft-js-mathjax-plugin for inputs.

- [ ] ~~The instructions are generated on the server side~~ The **inputs** and the **ContentState** are given to the client and **he** will generate the final text.

#### Advanced
- [ ] Creator can request extra time for script execution (Default: 0.5s)
- [ ] When creating a function they can choose to import lib such as "mathjs" to use advanced mathematical functions
- [ ] They can allow margin error for user's answer
	- [ ] They can write their own verification function (2 inputs : the output of the function, AND what the user wrote)
- [ ] They can create their own inputs function (Defining by themself the inputs and how they will be generated)

### Scripts answer
The creator will create a script to perform an action. 
Then the user will have an intruction which explain that he has to write a script which do something particular.
Finally the server will compare the output of the creator script and the user script for same input(s). 
The code CAN be different but the output should be the same.

- [ ] Creator can write a script
- [ ] Creator can choose the input type and the range for each of them
- [ ] User can write a script and debug it (using the console)
- [x] The script will be executed on the server side (using VM2)
- [ ] Creator can write his own implementation for verification function
- [ ] Creator can allow a margin of error