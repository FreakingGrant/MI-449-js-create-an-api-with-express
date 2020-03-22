// Get the TODO list
var todoList = require('./todo.js')

var express = require('express')
var app = express()
var port = process.env.PORT || 8080

var bodyParser = require('body-parser')
app.use(bodyParser.json())

// Base site
app.get('/', function (request, response) {
  response.redirect('/todo')
})

app.get('/todo', function (request, response) {
  response.json(todoList)
})

app.get('/todo/:id', function (request, response) {
  if (!todoList[request.params.id]) {
    response.status(404).json({
      "error": "Sorry, no such task: " + request.params.id
    })
    return
  }

  response.json(todoList[request.params.id])
})

app.post('/todo', function (request, response) {
  var text = request.body.text.trim().toLowerCase().split(' ').join('-')
  todoList[text] = {
    text: request.body.text.trim(),
    completed: request.body.completed.trim().toLowerCase()
  }
  response.redirect('/todo/' + text)
})

app.delete('/todo/:id', function (request, response) {
  if (!todoList[request.params.id]) {
    response.status(404).json({
      "error": "Sorry, no such task: " + request.params.id
    })
    return
  }

  delete todoList[request.params.id]
  response.redirect('/todo')
})

app.put('/todo/:id', function (request, response) {
  if (!todoList[request.params.id]) {
    response.status(404).json({
      "error": "Sorry, no such task: " + request.params.id
    })
    return
  }
  
  var todo = todoList[request.params.id]
  if (request.body.text !== undefined) {
    todo.text = request.body.text.trim()
  }
  if (request.body.completed !== undefined) {
    todo.completed = request.body.completed.trim().toLowerCase()
  }
  response.redirect('/todo/' + request.params.id)
})

// Handle any bad requests
app.use(function (request, response, next) {
  response.status(404).json({
    "error": request.url + ' not found'
  })
})

app.listen(port)
