# Walrus

This project is a hydroponics controlling software for the Raspberry Pi. 

![alt text](https://github.com/gregcummines/walrus/blob/master/client/src/assets/images/walrus.jpeg?raw=true)

## Description

This project has 2 folders, client and server.
client - Angular front end application
server - Backend Nodejs express web server that serves up the Angular app and provides a web server for REST calls from the Angular front end.

## Getting Started

To start, we need to build the Angular application first, so while in the client folder do the following:
```
client> npm install
client> npm install -g @angular/cli
client> ng build
```

Next, navigate to the server folder and start the express web server:
```
server> npm install
server> npm install -g webpack
server> npm install -g webpack-cli
server> npm install -g typescript
server> npm start
```

When the webserver starts you can navigate to http://localhost:3000 at which point the express web server will serve up the Angular index.html file from the Angular client/dist/automation/ folder along with the other application files referenced by index.html. 

# Walrus Angular project (under client folder)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.9. All of the remaining information is related to the Angular app running in its own web server using ng serve.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Authors

Greg Cummines  
email: gregcummines@gmail.com

## Version History

* 0.1
    * Initial Release

