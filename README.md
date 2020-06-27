# Description

The aim of this project is to offer a solution for teachers and student to have safer exercises online. The solution we are offering is for mathematical exercises (or exercises where the answer can be computed). For a same exercise all the student will get different input value, and the right answer will be automatically computed in the background, then compare to the user result, everything is then automatic and safe.

# Installation

### Instruction

This project is using [Docker-Compose](https://docs.docker.com/compose/) it allows us to run multi-container Docker application. In this repository the backend, frontend and the database will run in different containers.

```
git clone https://github.com/axel0070/online_exercises
docker-compose up --build
```

Then open [localhost](http://localhost/)

### Database

#### Default
In the `docker-compose` file, we are creating a container for a mongodb. Therefore there are no need to setup any external database. During the first start, the database will be created.

#### Manual
If you want to setup your own database for the backend, first you need to edit the docker-compose file and remove the mongo service and the dependency on it. Then you will need to edit the file located in `./api/src/connection.js` and change the connection URL.

# Features
You can see all of the feature and coming functionality in the [FEATURES](https://github.com/axel0070/online_exercises/blob/master/FEATURES.md) file.

# License
Online Exercise is GNU AGPLv3 licensed.
