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
    "_id": "org.couchdb.user:Eric",
    "name": "Eric",
    "type": "user",
    "roles": ['user'],
    "password": "e1"
}

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