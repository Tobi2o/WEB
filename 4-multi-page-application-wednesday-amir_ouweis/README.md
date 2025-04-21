[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/oYs0nMpO)
# Labo 5

This assignement will be graded.

In this assignment, you are asked to implement a multi-page application with
Express and SQLite. The goal is to create a small web site for managing french
[dictons](https://fr.wiktionary.org/wiki/Annexe:Liste_de_proverbes_fran%C3%A7ais).

The `dictons.sqlite` file contains the SQLite database. It has been added to the
gitignore file to prevent unexpected changes.

The pages displayed by the applications are described in the `server.js` file.
All your changes should take place in this file.

You must use a template engine to render the Web pages.

A few unit tests have been included in the `test/tests.js` file to guide you
through the assignment and validate your progress.

To complete this assignment, you will probably have to read some documentation
and to include some modules. Remember that the simplest and boring solutions are
often the best (i.e. You can have fun with an ORM but it is not a requirement).

## Prerequisites

- Node 21 (LTS)

## Setup

Install project dependencies

```sh
npm install
```

Start the server

```sh
npm run start

# or start server in watch mode
# so it automatically restarts on file changes
npm run watch
```

The website is available at [http://localhost:3000](http://localhost:3000)

Run tests

```
npm run test
```

## Additionnal information

It will require a bit more research and autonomy.

I advise you to have a look at the ExpressJS documentation, to do the hello
world guide. Search for "ExpressJS + Sqlite" tutorials using your favourite
search engine.

The theoretical example is https://github.com/web-classroom/example-express

The tests available will help you to find out what is expected of you, i.e. a
website accessible to :

- [localhost:3000/](localhost:3000/): a page that gives you a random saying
- [localhost:3000/list](localhost:3000/list): a page that shows you a list of
  sayings
- [localhost:3000/create](localhost:3000/create): a page that lets you create a
  saying
- [localhost:3000/:id](localhost:3000/:id): a page that shows you a saying by
  its id

The keywords for this type of application are :

- "CRUD": Short for "Create, Read, Update and Delete", we're looking to read and
  create sayings.
- "ExpressJS": this is the framework we use.
- "Sqlite3": this is the database we provide that contains sayings.
- "template engines": we no longer use HTML, but templates such as "pug",
  "nunjucks" or "ejs".
