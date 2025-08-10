/*****************/
/* WRITE CONCERN */
/*****************/

db.collection.insertOne(
    {
        name: "name"
    },
    {
        ordered: false, // do not skip after encountering error
        writeConcern: {
            w: 0, // deafult 1
            j: true, // default false
            wtimeout: 200 // in ms
        }
    }
)

/****************/
/* MONGO IMPORT */
/****************/

// import json in db

/************************/
/* COMPARISON OPERATORS */
/************************/

// $eq, $ne, $lt, $gt, $lte, $gte, $in & $nin

/*********************/
/* LOGICAL OPERATORS */
/*********************/

// $and. $or, $not, $nor

/***************************/
/* ELEMENT QUERY OPERATORS */
/***************************/

db.collection.find({
    field: {
        $exists: true,
        $type: "int",
        $eq: 10
    }
})

/******************************/
/* EVALUATION QUERY OPERATORS */
/******************************/

// $expr
db.collection.find({
    $expr: {
        $gt: ["$field1", "$field2"]
    }
})


db.collection.find({
    $expr: {
        $gt: ["$price", { $avg: "$price" }]
    }
})

db.collection.aggregate({
    $project: {
        sum: {
            $expr: {
                $add: ["$a", "$b"]
            }
        }
    }
})

// $regex
db.collection.find({
    name: {
        $regex: /a/
    }
})

// $text, searches in all indexed fields, db.students.createIndex({ bio: $text })
db.collection.find({
    $text: {
        $search: "test"
    }
})

// $mod
db.collection.find({
    price: {
        $mod: [10, 0]
    }
})

/*******************/
/* QUERYING ARRAYS */
/*******************/

// Filter in list, experience is a list
db.students.find({ "experience.company": "Amazon" }).size()

// Find experience == 3
db.students.find({
    experience: {
        $size: 3
    }
})

// Find experience > 3
db.students.find({
    $and: [
        {
            experience: {
                $exists: true
            }
        },
        {
            $expr: {
                $gte: [
                    { $size: "$experience" },
                    3
                ]
            }
        }
    ]
})

// Find where hobbies list is exactly like "walking" then "reading"
db.students.find({ 
    hobbies: ["walking", "reading"] 
})

// Find where hobbies list is contains "walking" and "reading"
db.students.find({ 
    hobbies: {
        $all: ["walking", "reading"]
    }
})

// Find where hobbies list contains "walking" or "reading"
db.students.find({ 
    hobbies: {
        $in: ["walking", "reading"] 
    }
})

// Find documents in which the products list contains an element which has name as Apple and quantity > 10
db.productsCollection.find({
    products: {
        $eleMatch: {
            quantity: { $gt: 10 },
            name: "Apple"
        }
    }
})

/******************/
/* SORT DOCUMENTS */
/******************/

db.teachers.find().sort(
    {
        age: 1, // 1 ascending, -1 descending 
        name: 1 // first by age then name
    }
).skip(20).limit(10).forEach(x => printjson(x))

/********************/
/* UPDATE OPERATORS */
/********************/

// $inc, $min, $max, $mul, $unset, $rename & Upsert

// set age to 1, add field if not present
db.students.update({}, {
    $set: {
        age: 1
    }
})

// increase by 2, -2 for decrease
db.students.update({ name: "sita" }, {
    $inc: {
        age: 2
    }
})

// max -> increase to 50
db.students.update({ name: "sita" }, {
    $max: {
        age: 50
    }
})

// min -> decrease to 20
db.students.update({ name: "sita" }, {
    $max: {
        age: 20
    }
})

// mul -> multiply by 2
db.students.update({ name: "sita" }, {
    $mul: {
        age: 2
    }
})

// min -> decrease to 20
db.students.update({ name: "sita" }, {
    $unset: {
        age: 123 // any random value
    }
})

// renmae field
db.students.updateMany({}, {
    $rename: {
        age: "newName"
    }
})

// upsert
db.students.updateOne(
    { name: "golu" },
    {
        $set: { age: 10 }
    },
    { upsert: true }
)

/************************/
/* UPDATE NESTED ARRAYS */
/************************/

// find in list and update the first matched entries (or all)
db.students.updateMany(
    {
        experience: {
            $eleMatch: {
                duration: { $lte: 1 }
            }
        }
    },
    {
        $set: {
            "experience.$.neglect": true // For first item match, "experience.$[].neglect" for all items in list, whether list item matches or not
        }
    }
)

// find in list and update all matched entries
db.students.updateMany(
    {
        experience: {
            $eleMatch: {
                duration: { $lte: 1 }
            }
        }
    },
    {
        $set: {
            "experience.$[e].neglect": true
        }
    },
    {
        arrayFilters: [
            {
                "e.duration": { $lte: 1 }
            }
        ]
    }
)

// find and add one more entry in list, $push
db.students.updateOne(
    { name: "Ram" },
    {
        $push: {
            experience: { company: "amason", duration: 2 }
        }
    }
)

// find and add one more entry in list, if not already present, $addToSet
db.students.updateOne(
    { name: "Ram" },
    {
        $addToSet: {
            experience: { company: "amason", duration: 2 }
        }
    }
)

// find and remove entry from list, $pull
db.students.updateOne(
    { name: "Ram" },
    {
        $pull: {
            experience: { company: "amason", duration: 2 }
        }
    }
)

// find and remove entry from list, $pop
db.students.updateOne(
    { name: "Ram" },
    {
        $pop: {
            experience: 1 // -1 for first
        }
    }
)

/************/
/* INDEXING */
/************/

// COLLSCAN, IXSCAN

// Single field indexes
db.teachers.find({age: {$lte: 10}}).explain()
db.teachers.find({age: {$lte: 10}}).explain("executionStats")
db.teachers.createIndex({age: 1})
db.teachers.dropIndex({age: 1})
db.teachers.getIndexes({age: 1})

// Compound indexes
db.teachers.createIndex({age: 1, gender: 1})

db.teachers.createIndex({name: 1}, {unique: true})
db.teachers.createIndex({name: 1}, {partialFilterExpression: {age: {$gt: 10}}})
db.teachers.createIndex({name: 1}, {partialFilterExpression: {gender: {$exists: true}}})
db.teachers.createIndex({"expiringDateFiled": 1}, {expireAfterSeconds: 3600}) // works on date fields and single index

// Covered query
db.teachers.find({name: "Mike"}, {_id: 0, name: 1}) // PROJECTION_COVERED if indexed on name, it is a covered query, return directly from the B-tree
db.teachers.find({name: "Mike"}, {name: 1}) // FETCH

// Winning plan, compares and saves better index in cache
db.teachers.find({name: "Mike"}).explain("allPlansExecution") // see winning and rejected plans

// Multi-key index
db.teachers.createIndex({names: 1}) // names is list, index on each element of names 

// Text indexes
db.teachers.createIndex({name: "text", bio: "text"}) // only one text index per collection
db.teachers.find({$text: {$search: "youtube actor"}}) // youtube and actor
db.teachers.find({$text: {$search: "youtube -actor"}}) // youtube but not actor

db.teachers.find({$text: {$search: "youtube -actor"}}, {theScore: {$meta: "textScore"}}) // adds score

db.teachers.createIndex({name: "text", bio: "text"}, {weights: {name: 100, bio: 1}})
db.teachers.find({$text: {$search: "youtube Sita"}}, {theScore: {$meta: "textScore"}}).sort({theScore: {$meta: "textScore"}})

db.teachers.createIndex({name: "text", bio: "text"}, {background: true}) // create query in background

/****************************/
/* AGGREGATION AND PIPELINE */
/****************************/

db.collection.aggregate(pipeline, options) // Syntax, pipeline is array of operations

db.teachers.aggregate([{$match: {gender: "male"}}])
db.teachers.aggregate([{$group: {_id: "$age"}}])
db.teachers.aggregate([
    {$group: {_id: "$age", names: {$push: "$name"}}}
])

db.teachers.aggregate([
    {$group: {_id: "$age", allDocs: {$push: "$$ROOT"}}}
]) // To list all documents in the group

db.teachers.aggregate([
    {$match: {gender: "male"}},
    {$group: {_id: "$age", groupSize: {$sum: 1}}}, // 1 means increase by 1 for each document
    {$sort: {groupSize: -1}},
    {$group: {_id: null, maxGroupSize: {$max: "$groupSize"}}}
])

db.teachers.aggregate([
    {$match: {gender: "male"}},
    {$group: {_id: "$age", groupAgeSum: {$sum: {$toDouble: "$age"}}}}
])

db.teachers.aggregate([
    {$group: {_id: "$age", hobbies: {$push: "$hobbies"}}} // but gives a nested array
])

db.teachers.aggregate([
    {$unwind: "$hobbies"}, // create copies of document for each element of hobbies array
    {$group: {_id: "$age", hobbies: {$push: "$hobbies"}}} // now gives a normal array
])

db.teachers.aggregate([
    {$unwind: "$hobbies"},
    {$group: {_id: "$hobbies", groupSize: {$sum: 1}}}
])

db.teachers.aggregate([
    {$group: {_id: null, averageAge: {$avg: "$age"}}}
])

db.teachers.aggregate([
    {$unwind: "$hobbies"},
    {$group: {_id: null, allHobbiesCount: {$sum: 1}}}
])

// Above alternate
db.teachers.aggregate([
    {$group: {_id: null, allHobbiesCount: {$sum: {$size: {$ifNull: ["$hobbies", []]}}}}}
])

db.teachers.aggregate([
    {$unwind: "$hobbies"},
    {$group: {_id: null, allHobbies: {$push: "$hobbies"}}} // for distinct do addToSet
])

// filter
db.students.aggregate([
    {
        $group: {
            _id: null,
            avgScore: {
                $avg: {
                    $filter: {
                        input: "$scores",
                        as: "score",
                        cond: {$gt: ["$age", 20]}
                    }
                }
            }
        }
    }
])

/**********/
/* BUCKET */
/**********/

db.teachers.aggregate([
    {$match: {gender: "male"}},
    {$bucket: {
        groupBy: "$age",
        boundaries: [0, 30, 40],
        default: "Greater than 40", // Name of group
        output: {
            count: {$sum: 1}, // count is output field name
            names: {$push: "$names"}
        }
    }}
])

/**********/
/* LOOKUP */
/**********/

db.customers.aggregate([
    {
        $lookup: {
            from: "orders", 
            localField: "id",
            foreignField: "customerId",
            as: "orderDetail"
        }
    }
])

/***********/
/* PROJECT */
/***********/

db.emp.find({}, {name: 1, _id: 0})
db.emp.aggregate([
    {$project: {
        name: 1, // takes name, if only 0s, rejects them and takes others
        _id: 0,
        dept: "$department"
    }} 
])

db.emp.aggregate([
    {$project: {
        _id: 0,
        name: 1,
        monthlySalary: "$salary",
        annualSalary: {$multiply: [12, "$salary"]}
    }}
])

/*********************/
/* CAPPED COLLECTION */
/*********************/

// has order, can make an existing collection capped
db.createCollection("orderLogs", {capped: true, max: 4, size: 10000}) // size in bytes

/******************/
/* AUTHENTICATION */
/******************/

// Add below to config file
// security:
//    authorization: enabled

// restart service
// >> use admin // go to admin database
db.getUsers() // gives error
db.createUser({
    user: "adminUser",
    pwd: "password",
    roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})
db.auth("adminUser", "password")
db.getUsers() // works after authorization
db.logout()

db.dropUser("username")
// mongo --authenticationDatabase adminDB -u adminUser -p adminPassword // logs into adminDB with credentials

db.createUser({
    user: "ram",
    pwd: "ram",
    roles: [
        {role: "read", db: "students"},
        {role: "readWrite", db: "college"}
    ]
})

db.runCommand({connectionStatus: 1}) // current login info

// Roles
read
readWrite

dbAdmin
userAdmin

readAnyDatabase
readWriteAnyDatabase

dbAdminAnyDatabase
userAdminAnyDatabase

dbOwner
clusterManager
clusterMonitor
hostManager
clusterAdmin
backup
restore

/************/
/* Sharding */
/************/

sh.shardCollection("database.collection", {"shardingKey": 1})

/***************/
/* Replication */
/***************/

// replica set contains many servers

// >> mongod --host hostName --port 27018 --dbPath /var/lib/mongo/db1 --replSet replicaSetName
//  start server   host         port           path in host                 setName

rs.initiate({
    _id: "replicaSetName",
    members: [
        {_id: 0, host: "hostName1:port1"},
        {_id: 1, host: "hostName2:port2"},
        {_id: 2, host: "hostName3:port3"}
    ]
})

rs.status()

// by defauly secondary nodes can't even read
// >> use admin
db.getMongo().setSecondaryOk()

/****************/
/* Transactions */
/****************/

var session = db.getMongo().startSession();
session.startTransaction();

var cust = session.getDatabase("bank").cust;
cust.updateOne({_id: 1}, {$inc: {bal: -100}});
cust.updateOne({_id: 2}, {$inc: {bal: 100}});

session.commitTransaction(); // session.abortTransaction();
session.endSession();

/*********/
/* Dates */
/*********/

db.insert({name: "Shyam", dob: new Date()}) // add current time
db.students.find({dob: {$gte: ISO("2012-12-12")}})
db.students.sort({dob: -1})
db.students.aggregate([
    {$group: {_id: {$year: "$dob"}, names: {$push: "$name"}}}
])

db.collection.aggregate([
    {
        $project: {
            month: {$month: "$dateField"},
            dayOfMonth: {$dayOfMonth: "$dateField"},
            dayOfYear: {$dayOfYear: "$dateField"},
            hour: {$hour: "$dateField"},
            minute: {$minute: "$dateField"},
            second: {$second: "$dateField"},
            ms: {$millisecond: "$dateField"}
        }
    }
])

db.students.aggregate([
    {$project: {
        _id: 0,
        name: 1,
        dob: {$dateToString: {format: "%d/%m/%Y", date: "$dob"}}
    }}
])

/*********/
/* Atlas */
/*********/

// Fully managed
// Scalability
// High Availability
// Security
// Monitoring and analytics
// Global Deployment
// Integration with other cloud services
 