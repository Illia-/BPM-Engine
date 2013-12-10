var a = {
 "type": "person",
 "role": "user",
 "login": "user1",
 "password": "pas1",
 "name": "Eric"
 }

a = {
 "type": "person",
 "role": "user",
 "login": "user2",
 "password": "pas2",
 "name": "Mark"
 }
a =  {
 "type": "person",
 "role": "user",
 "login": "user3",
 "password": "pas3",
 "name": "Jeff"
 }
a = {
	"type": "person",
	"role": "admin",
	"login": "admin1",
	"password": "pass1",
	"name": "Loren"
}


  ["root"] - ["root"]


["Eric", "Jeff", "Bryan"] - ["r1", "j1", "b1"]


{
  "_id": "org.couchdb.user:Andrey",
  "name": "Andrey",
  "type": "user",
  "roles": ["admin"],
  "password": "a1"
}

{
    "_id": "org.couchdb.user:Jeff",
    "name": "Eric",
    "type": "user",
    "roles": ['user'],
    "password": "e1"
}
{
  "_id": "org.couchdb.user:Jeff",
  "name": "Jeff",
  "type": "user",
  "roles": ["user"],
  "password": "j1"
}

{
  "_id": "org.couchdb.user:Nick",
  "name": "Nick",
  "type": "user",
  "roles": ["user"],
  "password": "n1"
}

{
  "_id": "org.couchdb.user:Peter",
  "name": "Peter",
  "type": "user",
  "roles": ["user"],
  "password": "p1"
}

{
  "_id": "org.couchdb.user:Olivia",
  "name": "Olivia",
  "type": "user",
  "roles": ["user"],
  "password": "o1"
}

Eric   -  e1
Jeff   -  j1
Nick   -  n1
Peter   -  p1
Olivia -  o1
/////////////////////////////////////

 {
   "_id": "_design/block_by_id",
   "views": {
       "all": {
           "map": "function(doc) { if (doc.type === 'block'){ emit([doc.id, doc.workflowId], doc) } }"
       }
   }
}

{
  "_id": "_design/blocks",
  "views": {
  "all": {
    "map": "function(doc) { if (doc.type === 'block'){ emit(doc._id, doc) } }"
  }
}
}

{
   "_id": "_design/tasks_by_user",
   "views": {
       "all": {
           "map": "function(doc) { if (doc.type === 'block'){ emit([doc.users, doc.workflowId], doc) } }"
       }
   }
}

 {
   "_id": "_design/templates",
   "views": {
       "all": {
           "map": "function(doc) { if (doc.type === 'template'){ emit(doc._id, doc) } }"
       }
   }
}

{
   "_id": "_design/variable_by_name",
   "views": {
       "all": {
           "map": "function(doc) { if (doc.type === 'variable'){ emit([doc.name, doc.workflowId], doc) } }"
       }
   }
}

{
   "_id": "_design/variables",
   "views": {
       "all": {
           "map": "function(doc) { if (doc.type === 'variable'){ emit(doc._id, doc) } }"
       }
   }
}

{
   "_id": "_design/workflow_blocks",
   "views": {
       "all": {
           "map": "function(doc) { if (doc.type === 'block'){ emit(doc.workflowId, doc) } }"
       }
   }
}

{
   "_id": "_design/workflows",
   "views": {
       "all": {
           "map": "function(doc) { if (doc.type === 'workflow'){ emit(doc._id, doc) } }"
       }
   }
}



{
  "_id": "b39a10d39242373069c6d891060097c0",
  "title": "Template for test",
  "type": "template",
  "vars": [
  {
    "name": "result",
    "val": "0"
  }
],
  "blocks": [
  {
    "id": "block1",
    "title": "Начало",
    "type": "start",
    "x": 22,
    "y": 16,
    "linesFrom": [
      {
        "id": "line1"
      }
    ],
    "linesTo": [
    ]
  },
  {
    "id": "block2",
    "title": "Конец",
    "type": "end",
    "x": 400,
    "y": 500,
    "linesFrom": [
    ],
    "linesTo": [
      {
        "id": "line6"
      },
      {
        "id": "line7"
      }
    ]
  },
  {
    "id": "block3",
    "title": "Задание 1-1",
    "type": "task",
    "x": 1189,
    "y": 31,
    "linesFrom": [
      {
        "id": "line2"
      }
    ],
    "linesTo": [
      {
        "id": "line1"
      }
    ],
    "users": [
      "Jeff"
    ]
  },
  {
    "id": "block4",
    "title": "Функция 1",
    "type": "function",
    "x": 76,
    "y": 186,
    "linesFrom": [
      {
        "id": "line3"
      }
    ],
    "linesTo": [
      {
        "id": "line2"
      }
    ],
    "func": "testFunc"
  },
  {
    "id": "block5",
    "title": "Условие 1",
    "type": "condition",
    "x": 1170,
    "y": 178,
    "linesFrom": [
      {
        "id": "line4",
        "type": "true"
      },
      {
        "id": "line5",
        "type": "false"
      }
    ],
    "linesTo": [
      {
        "id": "line3"
      }
    ],
    "variable": "result",
    "val": "0"
  },
  {
    "id": "block6",
    "title": "Задание 2",
    "type": "task",
    "x": 200,
    "y": 400,
    "linesFrom": [
      {
        "id": "line6"
      }
    ],
    "linesTo": [
      {
        "id": "line4"
      }
    ],
    "users": [
      "Nick"
    ]
  },
  {
    "id": "block7",
    "title": "Задание 3",
    "type": "task",
    "x": 600,
    "y": 400,
    "linesFrom": [
      {
        "id": "line7"
      }
    ],
    "linesTo": [
      {
        "id": "line5"
      }
    ],
    "users": [
      "Peter"
    ]
  }
],
  "createDate": 1386455312723,
  "updateDate": 1386533398971
}