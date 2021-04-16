# Walrus

This project is a hydroponics controlling software for the Raspberry Pi. 

## Description

This project has 2 folders, app and api.
app - Angular front end application
api - Backend Nodejs express web server that serves up the Angular app and services api calls from the Angular front end.

## Getting Started

To start, we need to build the Angular application first, so while in the app folder do the following:
```
app> npm install
app> npm install -g @angular/cli
app> ng build
```

Next, navigate to the api folder and start the express web server:
```
api> npm install
api> npm install -g nodemon
api> nodemon npm start
```

When the webserver starts you can navigate to http://localhost:3000 at which point the express web server will serve up the Angular index.html file from the Angular app/dist/automation/ folder along with the other application files referenced by index.html. 

## Issue
Although the index.html is served up and its file are all served up (main.js, styles.css, etc.), the home page component is shown which has an image referencing /assets/images/walrus.jpg. This image is being returned as a plaintext file. Figure this out and I owe you a beer. 

# Walrus Angular project (under app folder)

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

