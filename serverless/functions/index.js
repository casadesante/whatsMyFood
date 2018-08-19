// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const async = require('async');
const uuidv4 = require('uuid/v4');

admin.initializeApp();

// Get a database reference to whatsMyFood
var db = admin.database();

exports.addUser = functions.https.onRequest((req, res) => {
    console.log('====================================');
    console.log('Received Request for adduser');
    console.log(req.body);
    console.log('====================================');

    let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
    var firebaseID = parsedRequest.firebaseID;
    var readRef = db.ref('/users/' + firebaseID);
    var user = {};

    readRef
        .once('value')
        .then((snapshot, readError) => {
            if (readError) {
                throw readError;
            }
            console.log('====================================');
            console.log('snapshot value');
            console.log(snapshot.val());
            console.log('====================================');
            return snapshot.val() !== null;
        })
        .then(exists => {
            if (!exists) {
                user[firebaseID] = {
                    userName: parsedRequest.userName,
                    emailID: parsedRequest.emailID,
                    profilePictureURL: parsedRequest.profilePicURL,
                    restaurants: [],
                    createdAt: admin.database.ServerValue.TIMESTAMP,
                };
                console.log('====================================');
                console.log('printing user');
                console.log(user);
                console.log('====================================');
                let usersRef = db.ref('/users');
                return usersRef.update(user);
            }
            return res.status(200).send('User Already exists');
        })
        .then(err => {
            if (err) {
                throw err;
            } else {
                return res.status(200).send(user);
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
        });
});

exports.addRestaurantAndFood = functions.https.onRequest((req, res) => {
    console.log('====================================');
    console.log('Received Request for addRestaurant');
    console.log(req.body);
    console.log('====================================');
    var parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
    var parsedFood = parsedRequest.food;

    // check, If all required parameters are passed.
    if (!parsedRequest.hasOwnProperty('firebaseID')) {
        res.status(500).send('No firebaseID in the request');
    } else if (!parsedRequest.hasOwnProperty('restaurantName')) {
        res.status(500).send('No restaurantName in the request');
    } else if (!parsedRequest.hasOwnProperty('food')) {
        res.status(500).send('No food in the request');
    } else if (!parsedFood.hasOwnProperty('foodName')) {
        res.status(500).send('No food.foodName in the request');
    } else if (!parsedFood.hasOwnProperty('rating')) {
        res.status(500).send('No food.rating in the request');
    }

    var firebaseID = parsedRequest.firebaseID;
    var readUserRef = db.ref('/users/' + firebaseID);
    // Generate an unique restuarntID for each restaurant
    var restaurantID = uuidv4();
    var restaurant = {};

    async.waterfall(
        [
            callback => {
                // Create Restaurant Object
                restaurant[restaurantID] = {
                    "restaurantName": parsedRequest.restaurantName,
                    "latitude": parsedRequest.latitude || null,
                    "longitude": parsedRequest.longitude || null,
                    "restaurantPhotoURL": parsedRequest.restaurantPhotoURL || null,
                    "googlePlacesID": parsedRequest.googlePlacesID || null,
                    "createdAt": admin.database.ServerValue.TIMESTAMP
                };
                console.log('====================================');
                console.log('printing Restaurant');
                console.log(restaurant);
                console.log('====================================');
                let restaurantsRef = db.ref('/restaurants');
                restaurantsRef.update(restaurant, restaurantUpdateError => {
                    if (restaurantUpdateError) {
                        return callback(restaurantUpdateError);
                    } else {
                        return callback(null, restaurantID);
                    }
                });
            },
            (restaurantID, callback) => {
                // update the restaurant in user.restaurants
                readUserRef.once('value', (snapshot, readUserError) => {
                    let user = snapshot.val();
                    let refactoredUser = {};
                    if (user.hasOwnProperty('restaurants')) {
                        user.restaurants.push(restaurantID);
                        refactoredUser[firebaseID] = user;
                        return callback(null, refactoredUser);
                    } else {
                        user.restaurants = [restaurantID];
                        refactoredUser[firebaseID] = user;
                        return callback(null, refactoredUser);
                    }
                });
            },
            (refactoredUser, callback) => {
                // update the updatedUser in /users
                let usersRef = db.ref('/users');
                usersRef.update(refactoredUser, userUpdateError => {
                    if (userUpdateError) {
                        return callback(userUpdateError);
                    } else {
                        return callback(null, 'Restaurant Successfully added');
                    }
                });
            },
            (emptyMessage, callback) => {
                // push a new food in the /foods
                let foodsRef = db.ref('/foods');
                let food = {
                    "foodName": parsedRequest.food.foodName,
                    "rating": parsedRequest.food.rating,
                    "firebaseID": parsedRequest.firebaseID,
                    "restaurantID": restaurantID,
                    "createdAt": admin.database.ServerValue.TIMESTAMP
                };

                if (parsedRequest.hasOwnProperty("food")) {
                    if (parsedFood.hasOwnProperty("foodPhotoURL")) {
                        food["foodPhotoURL"] = parsedRequest.food.foodPhotoURL;
                    }
                }

                let uniqueFoodKey = foodsRef.push(food);
                console.log('====================================');
                console.log(`Food Key: ${uniqueFoodKey}`);
                console.log('====================================');
                callback(null, 'Added Restaurant & Food');
            },
        ], (err, result) => {
            if (err) {
                console.log(`error: ${err}`);
                res.status(500).send(err);
            }
            console.log(`result: ${result}`);
            res.status(200).send(result);
        });
});

exports.fetchRestaurantsAndFoods = functions.https.onRequest((req, res) => {
    console.log('====================================');
    console.log("Received Request for fetchRestaurantsAndFoods");
    console.log(req.body);
    console.log('====================================');
    let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

    // check, If all required parameters are passed.
    if (!parsedRequest.hasOwnProperty("firebaseID")) {
        res.status(500).send("No firebaseID in the request");
    }

    var firebaseID = parsedRequest.firebaseID;
    var readUserRef = db.ref("/users/" + firebaseID);
    var readFoodsRef = db.ref("/foods");
    var userRestaurants;

    async.waterfall([
        (callback) => {
            // fetching restaurants from user
            readUserRef.once("value", (snapshot, readUserError) => {
                if (readUserError) {
                    return callback(readUserError);
                } else {
                    let user = snapshot.val();
                    return callback(null, user.restaurants)
                }
            })
        },
        (restaurants, callback) => {
            var promises = [];
            if (restaurants !== undefined) {
                restaurants.map((restaurantID) => {
                    console.log('====================================');
                    console.log(`restaurantID: ${restaurantID}`);
                    console.log('====================================');
                    promises.push(getRestaurantByID(restaurantID));
                });
                Promise.all(promises).then((resolvedRestaurants) => {
                    userRestaurants = resolvedRestaurants;
                    console.log('====================================');
                    console.log(`printing user restaurants: ${JSON.stringify(userRestaurants)}`);
                    console.log('====================================');
                    return callback(null, userRestaurants);
                })
                    .catch((err) => {
                        console.log('====================================');
                        console.log(err);
                        console.log('====================================');
                    });
            } else {
                userRestaurants = [];
                console.log('====================================');
                console.log(`Else part: if user.restaurants is undefined. Printing user restaurants: ${JSON.stringify(userRestaurants)}`);
                console.log('====================================');
                return callback(null, userRestaurants);
            }
        },
        (userRestaurants, callback) => {
            readFoodsRef.orderByChild("firebaseID").equalTo(firebaseID).once("value", (snapshot, readFoodsError) => {
                if (readFoodsError) {
                    console.log(`readFoodsError: ${readFoodsError}`);
                    throw readFoodsError;
                }
                console.log(`Snapshot of foods: ${snapshot}`);
                let foods = snapshot.val();
                console.log(`foods: ${JSON.stringify(foods)}`);
                for (var i=0; i<userRestaurants.length; i++) {
                    let filteredFoods = [];
                    for (var key in foods) {
                        if (foods.hasOwnProperty(key)) {
                            let modifiedFood = foods[key];
                            console.log(`modified food: ${JSON.stringify(modifiedFood)}`);
                            if (modifiedFood["restaurantID"] === userRestaurants[i].restaurantID) {
                                modifiedFood["foodId"] = key;
                                filteredFoods.push(modifiedFood);
                            }
                        }
                    }
                    userRestaurants[i]["foods"] = filteredFoods;
                }
                return callback(null, userRestaurants);
            });
        }
    ], (err, result) => {
        if (err) {
            console.log(`error: ${err}`);
            res.status(500).send(err);
        }
        console.log(`result: ${result}`);
        res.status(200).send(result);
    });
});

exports.addFood = functions.https.onRequest((req, res) => {
    console.log('====================================');
    console.log("Received Request for addFood");
    console.log(req.body);
    console.log('====================================');
    let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

    // check, If all required parameters are passed.
    if (!parsedRequest.hasOwnProperty("foodName")) {
        res.status(500).send("No foodName in the request");
    } else if (!parsedRequest.hasOwnProperty("rating")) {
        res.status(500).send("No food's rating in the request");
    } else if (!parsedRequest.hasOwnProperty("firebaseID")) {
        res.status(500).send("No firebaseID in the request");
    } else if (!parsedRequest.hasOwnProperty("restaurantID")) {
        res.status(500).send("No restaurantID in the request");
    }

    var foodsRef = db.ref('/foods');
    var food = {
        foodName: parsedRequest.foodName,
        rating: parsedRequest.rating,
        firebaseID: parsedRequest.firebaseID,
        restaurantID: parsedRequest.restaurantID,
    };

    if (parsedRequest.hasOwnProperty("foodPhotoURL")) {
        food["foodPhotoURL"] = parsedRequest.foodPhotoURL;
    }

    async.waterfall([
        (callback) => {
            let uniqueFoodKey = foodsRef.push(food);
            console.log('====================================');
            console.log(`Food Key: ${uniqueFoodKey}`);
            console.log('====================================');
            callback(null, uniqueFoodKey);
        }
    ], (err, result) => {
        if (err) {
            console.log(`error: ${err}`);
            res.status(500).send(err);
        }
        console.log(`Food created with unique Key: ${result}`);
        res.status(200).send(result);
    });
});

exports.updateFood = functions.https.onRequest((req, res) => {
    console.log('====================================');
    console.log("Received Request for updateFood");
    console.log(req.body);
    console.log('====================================');
    let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

    // check, If all required parameters are passed.
    if (!parsedRequest.hasOwnProperty("foodName")) {
        res.status(500).send("No foodName in the request");
    } else if (!parsedRequest.hasOwnProperty("rating")) {
        res.status(500).send("No food's rating in the request");
    } else if (!parsedRequest.hasOwnProperty("firebaseID")) {
        res.status(500).send("No firebaseID in the request");
    } else if (!parsedRequest.hasOwnProperty("restaurantID")) {
        res.status(500).send("No restaurantID in the request");
    } else if (!parsedRequest.hasOwnProperty("foodID")) {
        res.status(500).send("No foodID in the request");
    }

    var readFoodRef = db.ref('/foods/' + parsedRequest.foodID);
    var foodRef = db.ref('/foods');

    async.waterfall([
        (callback) => {
            // fetch the food based on foodID
            readFoodRef.once("value", (snapshot, readFoodError) => {
                if (readFoodError) {
                    return callback(readFoodError);
                } else {
                    let food = snapshot.val();
                    console.log('====================================');
                    console.log(`Fetched specific food: ${JSON.stringify(food)}`);
                    console.log('====================================');
                    return callback(null, food);
                }
            });
        },
        (food, callback) => {
            // updating the food
            let updatedFood = {};
            updatedFood[parsedRequest.foodID] = {
                "foodName": parsedRequest.foodName,
                "rating": parsedRequest.rating,
                "firebaseID": parsedRequest.firebaseID,
                "restaurantID": parsedRequest.restaurantID,
                "updatedAt": admin.database.ServerValue.TIMESTAMP
            };

            if (parsedRequest.hasOwnProperty("foodPhotoURL")) {
                updatedFood[parsedRequest.foodID]["foodPhotoURL"] = parsedRequest.foodPhotoURL;
            }

            foodRef.update(updatedFood, updatedFoodError => {
                if (updatedFoodError) {
                    return callback(updatedFoodError);
                } else {
                    return callback(null, updatedFood);
                }
            });
        }
    ], (err, result) => {
        if (err) {
            console.log(`error: ${err}`);
            res.status(500).send(err);
        }
        console.log(`Final updated Food: ${result}`);
        res.status(200).send(result);
    });
});

exports.updateRestaurant = functions.https.onRequest((req, res) => {
    console.log('====================================');
    console.log("Received Request for updateRestaurant");
    console.log(req.body);
    console.log('====================================');
    let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

    // check, If all required parameters are passed.
    if (!parsedRequest.hasOwnProperty("restaurantID")) {
        res.status(500).send("No restaurantID in the request");
    } else if (!parsedRequest.hasOwnProperty("createdAt")) {
        res.status(500).send("No createdAt in the request");
    } else if (!parsedRequest.hasOwnProperty("restaurantName")) {
        res.status(500).send("No restaurantName in the request");
    }

    var readRestaurantRef = db.ref('/restaurants/' + parsedRequest.restaurantID);
    var restaurantRef = db.ref('/restaurants');

    async.waterfall([
        (callback) => {
            // fetch the restaurant based on restaurantID
            readRestaurantRef.once("value", (snapshot, readRestaurantError) => {
                if (readRestaurantError) {
                    return callback(readRestaurantError);
                } else {
                    let restaurant = snapshot.val();
                    console.log('====================================');
                    console.log(`Fetched specific Restaurant: ${JSON.stringify(restaurant)}`);
                    console.log('====================================');
                    return callback(null, restaurant);
                }
            });
        },
        (restaurant, callback) => {
            // updating the restaurant
            let updatedRestaurant = {};
            updatedRestaurant[parsedRequest.restaurantID] = {
                "restaurantName": parsedRequest.restaurantName,
                "latitude": parsedRequest.latitude || null,
                "longitude": parsedRequest.longitude || null,
                "restaurantPhotoURL": parsedRequest.restaurantPhotoURL || null,
                "googlePlacesID": parsedRequest.googlePlacesID || null,
                "createdAt": parsedRequest.createdAt,
                "updatedAt": admin.database.ServerValue.TIMESTAMP
            };

            restaurantRef.update(updatedRestaurant, updatedRestaurantError => {
                if (updatedRestaurantError) {
                    return callback(updatedFoodError);
                } else {
                    return callback(null, updatedRestaurant);
                }
            });
        }
    ], (err, result) => {
        if (err) {
            console.log(`error: ${err}`);
            res.status(500).send(err);
        }
        console.log(`Final updated Restaurant: ${result}`);
        res.status(200).send(result);
    });
});

exports.deleteFood = functions.https.onRequest((req, res) => {
    console.log('====================================');
    console.log("Received Request for deleteFood");
    console.log(req.body);
    console.log('====================================');
    let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

    // check, If all required parameters are passed.
    if (!parsedRequest.hasOwnProperty("foodID")) {
        res.status(500).send("No foodID in the request");
    }

    var deleteFoodRef = db.ref('/foods/' + parsedRequest.foodID);
    var deleteFoodsRef = db.ref('/deleteFoods');
    var retrievedFood = {};

    async.waterfall([
        (callback) => {
            // fetch the food based on foodID
            deleteFoodRef.once("value", (snapshot, deleteFoodError) => {
                if (deleteFoodError) {
                    return callback(deleteFoodError);
                } else {
                    retrievedFood = snapshot.val();
                    console.log('====================================');
                    console.log(`Fetched specific Food: ${JSON.stringify(retrievedFood)}`);
                    console.log('====================================');
                    return callback(null, parsedRequest.foodID);
                }
            });
        },
        (foodID, callback) => {
            // delete the food
            deleteFoodRef.set(null, deleteFoodError => {
                if (deleteFoodError) {
                    return callback(deleteFoodError);
                } else {
                    return callback(null, retrievedFood);
                }
            });
        },
        (retrievedFood, callback) => {
            // push the food to /deleteFoods
            let deleteFoodUniqueKey = deleteFoodsRef.push(retrievedFood);
            console.log('====================================');
            console.log(`Deleted FoodID: ${deleteFoodUniqueKey}`);
            console.log('====================================');
            callback(null, parsedRequest.foodID);
        }
    ], (err, result) => {
        if (err) {
            console.log(`error: ${err}`);
            res.status(500).send(err);
        }
        console.log(`Deleted foodID: ${result}`);
        res.status(200).send(result);
    });
});

getRestaurantByID = (restaurantID) =>
    new Promise((resolve, reject) => {
        db.ref("/restaurants/" + restaurantID).once("value", (snapshot, readRestaurantError) => {
            if (readRestaurantError) {
                reject(readRestaurantError);
            }
            let snapshotRestaurant = snapshot.val();
            console.log('====================================');
            console.log(`typeof: ${typeof(snapshotRestaurant)}`);
            console.log(`Specific Restaurant: ${JSON.stringify(snapshotRestaurant)}`);
            console.log('====================================');
            snapshotRestaurant["restaurantID"] = restaurantID;
            resolve(snapshotRestaurant);
        });
    });

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database
    .ref('/users/{pushId}/name')
    .onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        console.log('====================================');
        console.log('snapshot');
        console.log(snapshot);
        console.log('====================================');
        console.log('====================================');
        console.log('context');
        console.log(context);
        console.log('====================================');
        const original = snapshot.val();
        console.log('Uppercasing', context.params.pushId, original);
        const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return snapshot.ref.parent.child('uppercase').set(uppercase);
    });