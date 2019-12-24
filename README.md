# DevOps & NodeJS Final Project

## Introduction 

In this project we are asked to use DevOps tools such as:
    1. Git, Branches and Tags
    2. Testing Framework (We have used Chai)
    3.Configuration with CI server
    4.Provide a README file
    5. MIT Licence

In NodeJS part we are asked to create a signin, signup, and login page using API and dealing with metrics

## Installation

```bash
  `git clone` https://github.com/atarela/Node-Devops.git
    npm install
```

## Running instruction
```
   To run the project, on the command prompt line, you have to go to the file directory by taping cd [file directory].
- To buil the project: `npm build`
- To start the project: `npm run dev` or `npm start`
- To check unit tests: `npm test`
```

## Routes For the NodeJS Part

```After that, open http://localhost:8082/ on your browser. 
You can try those different routes:
- Home page: http://localhost:8082/
- Sign up page: http://localhost:8082/signup
- Log in page: http://localhost:8082/login
- User account page: http://localhost:8082/account/Sergei
``` 

## Difficulties
 
        ``` DevOps ```
    We found Some difficulties using Jenkins for The CI serve, as our CI server was in localhost and Github accept only public addresses. And also when we changed The Jenkins URL from http://localhost:8080/github-webhook/ to http://176.138.171.79:8080/github-webhook/ it didn't work well :(

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contributors

    * Atar EL AZIZ
    * Vithusha SIVAKUMARAN
    * ING4 Information System Group 1
