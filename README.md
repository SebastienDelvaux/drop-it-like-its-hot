# Drop it like it's hot

Small project to test out react-beautiful-dnd.
Basically this is a kanban using drag and drop to change the status of a tasks.

## Installation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Type `yarn` to install all the dependencies of this project.

## Starting project

Once installed, you can start the project using `yarn start` a web server will start on *http://localhost:3000*.

## Features

This project is pretty straightforward, to keep it that way a set of limitations are set.

* No tasks creation: you start with a static and immutable set of tasks
* Task can only be dropped from left to right

The features are:

* Task reordering (drag and drop) in a column
* Task dragging & dropping between column
* Column reordering (drag and drop)
* Task drop point highlighting (sky blue)
* Some task is not draggable (lightgrey background)
