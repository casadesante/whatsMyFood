// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const async = require('async');
const uuidv4 = require('uuid/v4');
const telegraf = require('telegraf');
const moment = require('moment');

admin.initializeApp();

// Get a database reference to whatsMyFood
var db = admin.database();

// Initializing Telegram Bot
const app = new telegraf(functions.config().telegram.token);

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
  console.log('Received Request for addRestaurantAndFood');
  console.log(req.body);
  console.log('====================================');
  var parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
  var parsedFood = parsedRequest.food;
  
  // check, If all required parameters are passed.
  if (!parsedRequest.hasOwnProperty('firebaseID')) {
    return res.status(500).send('No firebaseID in the request');
  } else if (!parsedRequest.hasOwnProperty('restaurantName')) {
    return res.status(500).send('No restaurantName in the request');
  } else if (!parsedRequest.hasOwnProperty('food')) {
    return res.status(500).send('No food in the request');
  } else if (!parsedFood.hasOwnProperty('foodName')) {
    return res.status(500).send('No food.foodName in the request');
  } else if (!parsedFood.hasOwnProperty('rating')) {
    return res.status(500).send('No food.rating in the request');
  }

  var firebaseID = parsedRequest.firebaseID;
  var readUserRef = db.ref('/users/' + firebaseID);
  // Generate an unique restuarntID for each restaurant
  var restaurantID = uuidv4();
  var restaurant = {};

  async.waterfall(
    [
      callback => {
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
            let userRestaurants = resolvedRestaurants;
            console.log('====================================');
            console.log(`printing user restaurants: ${JSON.stringify(userRestaurants)}`);
            console.log('====================================');
            // checking whether parsedRequest.googlePlacesID is already available or not
            for (var i=0; i<userRestaurants.length; i++) {
              if (userRestaurants[i].hasOwnProperty("googlePlacesID")) {
                if (userRestaurants[i].googlePlacesID === parsedRequest.googlePlacesID) {
                  return res.status(500).send('GooglePlacesID already exists');
                }
              }
            }
            // else calling the next callback to addRestaurant
            return callback(null, userRestaurants);
          })
          .catch((err) => {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
          });
        } else {
          let userRestaurants = [];
          console.log('====================================');
          console.log(`Else part: if user.restaurants is undefined. Printing user restaurants: ${JSON.stringify(userRestaurants)}`);
          console.log('====================================');
          return callback(null, userRestaurants);
        }  
      },
      (emptyMessage, callback) => {
        // Create Restaurant Object
        restaurant[restaurantID] = {
          "restaurantName": parsedRequest.restaurantName,
          "latitude": parsedRequest.latitude || null,
          "longitude": parsedRequest.longitude || null,
          "restaurantPhotoURL": parsedRequest.restaurantPhotoURL || null,
          "googlePlacesID": parsedRequest.googlePlacesID || null,
          "formattedAddress": parsedRequest.formattedAddress || null,
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
    return res.status(500).send("No firebaseID in the request");
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
    return res.status(500).send("No foodName in the request");
  } else if (!parsedRequest.hasOwnProperty("rating")) {
    return res.status(500).send("No food's rating in the request");
  } else if (!parsedRequest.hasOwnProperty("firebaseID")) {
    return res.status(500).send("No firebaseID in the request");
  } else if (!parsedRequest.hasOwnProperty("restaurantID")) {
    return res.status(500).send("No restaurantID in the request");
  }

  var foodsRef = db.ref('/foods');
  var readFoodsRef = db.ref("/foods");
  
  var food = {
    foodName: parsedRequest.foodName,
    rating: parsedRequest.rating,
    firebaseID: parsedRequest.firebaseID,
    restaurantID: parsedRequest.restaurantID,
    createdAt: admin.database.ServerValue.TIMESTAMP
  };

  if (parsedRequest.hasOwnProperty("foodPhotoURL")) {
    food["foodPhotoURL"] = parsedRequest.foodPhotoURL;
  }

  async.waterfall([
    (callback) => {
      // fetching foods based on the restaurantID
      readFoodsRef.orderByChild("restaurantID").equalTo(parsedRequest.restaurantID).once("value", (snapshot, readFoodsError) => {
        if (readFoodsError) {
          console.log(`readFoodsError: ${readFoodsError}`);
          return callback(readFoodsError);
        }
        let foods = snapshot.val();
        console.log('====================================');
        console.log(`Snapshot of foods: ${JSON.stringify(foods)}`);
        console.log('====================================');
        // Make sure the foodName is not duplicated
        for (var key in foods) {
          if (foods.hasOwnProperty(key)) {
            if (foods[key]["foodName"] === parsedRequest.foodName) {
              return res.status(500).send("This food already exists");
            }
          }
        }  
        return callback(null, "Proceed to create the Food");
      });
    },
    (emptyString, callback) => {
      let uniqueFoodKey = foodsRef.push(food);
      console.log('====================================');
      console.log(`Food Key: ${uniqueFoodKey}`);
      console.log('====================================');
      callback(null, uniqueFoodKey);
    },
    (uniqueFoodKey, callback) => {
      console.log(`Food created with unique Key: ${uniqueFoodKey}`);
      // fetching restaurant based on reastaurantID
      db.ref("/restaurants/" + parsedRequest.restaurantID).once("value", (snapshot, readRestaurantError) => {
        if (readRestaurantError) {
          return callback(readUserError);
        }
        let snapshotRestaurant = snapshot.val();
        // console.log('====================================');
        // console.log(`typeof: ${typeof(snapshotRestaurant)}`);      
        // console.log(`Specific Restaurant: ${JSON.stringify(snapshotRestaurant)}`);
        // console.log('====================================');
        snapshotRestaurant["restaurantID"] = parsedRequest.restaurantID;
        console.log('====================================');
        console.log(JSON.stringify('Printing the restaurant here'));
        console.log(JSON.stringify(snapshotRestaurant));
        console.log('====================================');  
        return callback(null, snapshotRestaurant);
      });
    },
    (userRestaurant, callback) => {
      // fetching foods based on restaurantID & firebaseID
      readFoodsRef.orderByChild("firebaseID").equalTo(parsedRequest.firebaseID).once("value", (snapshot, readFoodsError) => {
        if (readFoodsError) {
          console.log(`readFoodsError: ${readFoodsError}`);
          throw readFoodsError;
        }
        console.log(`Snapshot of foods: ${snapshot}`);
        let foods = snapshot.val();
        console.log(`foods: ${JSON.stringify(foods)}`);
        let filteredFoods = [];
        for (var key in foods) {
          if (foods.hasOwnProperty(key)) {
            let modifiedFood = foods[key];
            console.log(`modified food: ${JSON.stringify(modifiedFood)}`);
            if (modifiedFood["restaurantID"] === parsedRequest.restaurantID) {
              modifiedFood["foodId"] = key;
              filteredFoods.push(modifiedFood);
            }
          }
        }  
        userRestaurant["foods"] = filteredFoods;
        return callback(null, userRestaurant);
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

exports.updateFood = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log("Received Request for updateFood");
  console.log(req.body);
  console.log('====================================');
  let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

  // check, If all required parameters are passed.
  if (!parsedRequest.hasOwnProperty("foodName")) {
    return res.status(500).send("No foodName in the request");
  } else if (!parsedRequest.hasOwnProperty("rating")) {
    return res.status(500).send("No food's rating in the request");
  } else if (!parsedRequest.hasOwnProperty("firebaseID")) {
    return res.status(500).send("No firebaseID in the request");
  } else if (!parsedRequest.hasOwnProperty("restaurantID")) {
    return res.status(500).send("No restaurantID in the request");
  } else if (!parsedRequest.hasOwnProperty("foodID")) {
    return res.status(500).send("No foodID in the request");
  } else if (!parsedRequest.hasOwnProperty("createdAt")) {
    return res.status(500).send("No createdAt in the request");
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
        "createdAt": parsedRequest.createdAt,
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
    return res.status(500).send("No restaurantID in the request");
  } else if (!parsedRequest.hasOwnProperty("createdAt")) {
    return res.status(500).send("No createdAt in the request");
  } else if (!parsedRequest.hasOwnProperty("restaurantName")) {
    return res.status(500).send("No restaurantName in the request");
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
        "formattedAddress": parsedRequest.formattedAddress || null,
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
    return res.status(500).send("No foodID in the request");
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

exports.deleteRestaurant = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log("Received Request for deleteRestaurant");
  console.log(req.body);
  console.log('====================================');
  let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

  // check, If all required parameters are passed.
  if (!parsedRequest.hasOwnProperty("restaurantID")) {
    return res.status(500).send("No restaurantID in the request");
  } else if (!parsedRequest.hasOwnProperty("firebaseID")) {
    return res.status(500).send("No firebaseID in the request");
  }

  var deleteRestaurantRef = db.ref('/restaurants/' + parsedRequest.restaurantID);
  var deleteRestaurantsRef = db.ref('/deleteRestaurants');
  var readUserRef = db.ref('/users/' + parsedRequest.firebaseID);
  var readFoodsRef = db.ref('/foods');
  var retrievedRestaurant = {};
  var retrievedFoods = {};

  async.waterfall([
    (callback) => {
      // remove the restaurantID from user.restaurants
      let refactoredUser = {};
      readUserRef.once('value', (snapshot, readUserError) => {
        if (readUserError) {
          return callback(readUserError);
        } else {
          let user = snapshot.val();
          if (user.hasOwnProperty('restaurants')) {
            let userRestaurants = user.restaurants;
            console.log('====================================');
            console.log(`Type of userRestaurants: ${typeof(userRestaurants)}`);
            console.log('====================================');
            console.log('====================================');
            console.log(`Before Deleting the restaurantID: ${JSON.stringify(userRestaurants)}`);
            console.log('====================================');
            let index = userRestaurants.indexOf(parsedRequest.restaurantID);
            console.log('====================================');
            console.log(`Index of the restaurantID: ${index}`);
            console.log('====================================');
            if (index > -1) {
              userRestaurants.splice(index, 1);
            }
            console.log('====================================');
            console.log(`After Deleting the restaurantID: ${JSON.stringify(userRestaurants)}`);
            console.log('====================================');
            refactoredUser[parsedRequest.firebaseID] = user;
            console.log('====================================');
            console.log(`Type of user.restaurants before putting it in object: ${typeof(refactoredUser[parsedRequest.firebaseID]["restaurants"])}`);
            console.log('====================================');
            refactoredUser[parsedRequest.firebaseID]["restaurants"] = userRestaurants;
            return callback(null, refactoredUser);
          }
        }
      });
    },
    (refactoredUser, callback) => {
      // update the user with updated user.restaurants
      let usersRef = db.ref('/users');
      usersRef.update(refactoredUser, userUpdateError => {
        if (userUpdateError) {
          return callback(userUpdateError);
        } else {
          return callback(null, 'User Successfully updated with updatedRestaurants');
        }
      });
    },
    (dummyVariable, callback) => {
      // fetch the restaurant based on restaurantID
      deleteRestaurantRef.once("value", (snapshot, deleteRestaurantError) => {
        if (deleteRestaurantError) {
          return callback(deleteRestaurantError);
        } else {
          retrievedRestaurant = snapshot.val();
          console.log('====================================');
          console.log(`Fetched specific Restaurant: ${JSON.stringify(retrievedRestaurant)}`);
          console.log('====================================');
          return callback(null, parsedRequest.restaurantID);
        }
      });
    },
    (restaurantID, callback) => {
      // delete the restaurant
      deleteRestaurantRef.set(null, deleteRestaurantError => {
        if (deleteRestaurantError) {
          return callback(deleteRestaurantError);
        } else {
          return callback(null, retrievedRestaurant);
        }
      });
    },
    (retrievedRestaurant, callback) => {
      // Add the restaurant to /deleteRestaurants
      let updatedRestaurant = {};
      updatedRestaurant[parsedRequest.restaurantID] = retrievedRestaurant;

      deleteRestaurantsRef.update(updatedRestaurant, updatedRestaurantError => {
        if (updatedRestaurantError) {
          return callback(updatedFoodError);
        } else {
          return callback(null, parsedRequest.restaurantID);
        }
      });
    },
    (emptyString, callback) => {
     // Fetch all the foods associated with the restaurantID
     readFoodsRef.orderByChild("restaurantID").equalTo(parsedRequest.restaurantID).once("value", (snapshot, readFoodsError) => {
      if (readFoodsError) {
        console.log(`readFoodsError: ${readFoodsError}`);
        return callback(readFoodsError);
      }
      retrievedFoods = snapshot.val();
      console.log(`fetched foods based on ${parsedRequest.restaurantID}: ${JSON.stringify(retrievedFoods)}`);
      return callback(null, Object.keys(retrievedFoods));
     });
    },
    (toBeDeletedFoodKeys, callback) => {
      // Delete all the foods with the given key
      let promises = [];
      toBeDeletedFoodKeys.map((foodID) => {
        console.log('====================================');
        console.log(`ToBe deleted FoodID: ${foodID}`);
        console.log('====================================');
        promises.push(deleteFoodByFoodID(foodID));      
      });
      Promise.all(promises).then((resolvedFoods) => {
        console.log('====================================');
        console.log(`printing deleted foods: ${JSON.stringify(resolvedFoods)}`);
        console.log('====================================');
        return callback(null, retrievedFoods);
      })
      .catch((err) => {
        console.log('====================================');
        console.log(`Error in Promise.all: ${err}`);
        console.log('====================================');
        return callback(err);
      });
    },
    (retrievedFoods, callback) => {
      // Save all the deleted foods to /deleteFoods
      let deleteFoodsRef = db.ref('/deleteFoods');
      deleteFoodsRef.update(retrievedFoods, deleteFoodsError => {
        if (deleteFoodsError) {
          return callback(deleteFoodsError);
        } else {
          return callback(null, 'Foods deleted successfully');
        }
      });
    }
  ], (err, result) => {
    if (err) {
      console.log(`error: ${err}`);
      res.status(500).send(err);
    }
    console.log(`Deleted RestaurantID: ${result}`);
    res.status(200).send(result);
  });
});

exports.checkRestaurantIfExists = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log('Received Request for checkRestaurantIfExists');
  console.log(req.body);
  console.log('====================================');
  var parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
  
  // check, If all required parameters are passed.
  if (!parsedRequest.hasOwnProperty('firebaseID')) {
    return res.status(500).send('No firebaseID in the request');
  }

  if (parsedRequest.hasOwnProperty('googlePlacesID')) {
    console.log('====================================');
    console.log('checkRestaurantIfExists will be based on the googlePlacesID');
    console.log('====================================');    
  } else if ((!parsedRequest.hasOwnProperty('googlePlacesID')) && (parsedRequest.hasOwnProperty('restaurantName'))) {
    console.log('====================================');
    console.log('checkRestaurantIfExists will be based on the restaurantName');
    console.log('====================================');    
  } else {
    console.log('====================================');
    console.log('No googlePlacesID or restaurantName');
    console.log('====================================');
    return res.status(500).send('No googlePlacesID or restaurantName');
  }

  var firebaseID = parsedRequest.firebaseID;
  var readUserRef = db.ref('/users/' + firebaseID);

  async.waterfall(
    [
      callback => {
        // fetching restaurantIDs from user
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
        // getting all the restaurants based on the restaurantID
        var promises = [];
        if (restaurants !== undefined) {
          restaurants.map((restaurantID) => {
            // console.log('====================================');
            // console.log(`restaurantID: ${restaurantID}`);
            // console.log('====================================');
            promises.push(getRestaurantByID(restaurantID));
          });
          Promise.all(promises).then((resolvedRestaurants) => {
            let userRestaurants = resolvedRestaurants;
            console.log('====================================');
            console.log(`printing user restaurants: ${JSON.stringify(userRestaurants)}`);
            console.log('====================================');
            // checking whether parsedRequest.googlePlacesID is already available or not
            if (parsedRequest.hasOwnProperty('googlePlacesID')) {
              console.log('====================================');
              console.log(`checkRestaurantIfExists is based on the googlePlacesID`);
              console.log('====================================');
              for (let i=0; i<userRestaurants.length; i++) {
                if (userRestaurants[i].hasOwnProperty("googlePlacesID")) {
                  if (userRestaurants[i].googlePlacesID === parsedRequest.googlePlacesID) {
                    return res.status(500).send('googlePlacesID already exists');
                  }
                }
              }
            } else if ((!parsedRequest.hasOwnProperty('googlePlacesID')) && (parsedRequest.hasOwnProperty('restaurantName'))) {
              console.log('====================================');
              console.log('checkRestaurantIfExists based on the restaurantName');
              console.log('====================================');    
              for (let i=0; i<userRestaurants.length; i++) {
                if (userRestaurants[i].hasOwnProperty("restaurantName")) {
                  if (userRestaurants[i].restaurantName === parsedRequest.restaurantName) {
                    return res.status(500).send('restaurantName already exists');
                  }
                }
              }
            }       
            // else calling the next callback to addRestaurant
            return callback(null, "No issues. It is a completely new restaurant to the user");
          })
          .catch((err) => {
            console.log('====================================');
            console.log(`Error in Promise: ${err}`);
            console.log('====================================');
          });
        } else {
          let userRestaurants = [];
          console.log('====================================');
          console.log(`Else part: if user.restaurants is undefined. Printing user restaurants: ${JSON.stringify(userRestaurants)}`);
          console.log('====================================');
          return callback(null, "No issues. This is the first restaurant for the user");
        } 
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

getRestaurantByID = (restaurantID) =>
  new Promise((resolve, reject) => {
    db.ref("/restaurants/" + restaurantID).once("value", (snapshot, readRestaurantError) => {
      if (readRestaurantError) {
        reject(readRestaurantError);
      }
      let snapshotRestaurant = snapshot.val();
      // console.log('====================================');
      // console.log(`typeof: ${typeof(snapshotRestaurant)}`);      
      // console.log(`Specific Restaurant: ${JSON.stringify(snapshotRestaurant)}`);
      // console.log('====================================');
      snapshotRestaurant["restaurantID"] = restaurantID;
      resolve(snapshotRestaurant); 
    });
  });

deleteFoodByFoodID = (foodID) =>
  new Promise((resolve, reject) => {
    let deleteFoodRef = db.ref(`/foods/` + foodID);
    deleteFoodRef.set(null, deleteFoodError => {
      if (deleteFoodError) {
        reject(deleteFoodError);
      } else {
        resolve(`Given FoodID ${foodID} Deleted!`);
      }
    });
  });

// Listens for new messages added to /users/
exports.sendTelegramNotificationOnAddingUser = functions.database.ref('/users/{userID}')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const newUser = snapshot.val();
    console.log('====================================');
    console.log(`Snapshot Value: ${JSON.stringify(newUser)}`);
    console.log('====================================');
    let telegramMessage = `👨${newUser.userName}(${newUser.emailID}) has joined our app🔥`;
    app.telegram.sendMessage(functions.config().telegram.groupid, telegramMessage, {})
      .then((success, err) =>{
        if (err) {
          throw err;
        } else {
          return 0;
        }
      })
      .catch((err) => {
        console.log('====================================');
        console.log(`Error: ${err}`);
        console.log('====================================');
      });
  });

exports.sendWeeklyUserReportToTelegram = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log("Received Request for sendWeeklyReportToTelegram");
  console.log(req.body);
  console.log('====================================');
  let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

  var readUsersRef = db.ref("/users");
  var userReport = `Here is the List of 👨👨👨 added this week from ${moment().subtract(7, 'days').calendar()} to ${moment().format("MM/DD/YY")}:\n`;

  async.waterfall([
    (callback) => {
      // fetching restaurants from user
      readUsersRef.once("value", (snapshot, readUsersError) => {
        if (readUsersError) {
          return callback(readUsersError);
        } else {
          let users = snapshot.val();
          console.log('====================================');
          console.log(`List of Users: ${JSON.stringify(users)}`);
          console.log('====================================');
          for (var key in users) {
            if (users.hasOwnProperty(key)) {
              let userMomentObj = moment(users[key]["createdAt"]);
              let sevenDaysPastmomentObj = moment().subtract(7, 'days');
              let presentMomentObj = moment();
              if ((userMomentObj <= presentMomentObj) && (userMomentObj >= sevenDaysPastmomentObj)) {
                userReport = userReport + `${users[key]["userName"]}(${users[key]["emailID"]})\n`
              }
            }
          }  
          let telegramMessage = userReport;
          app.telegram.sendMessage(functions.config().telegram.groupid, telegramMessage, {})
            .then((success, err) =>{
              if (err) {
                throw err;
              } else {
                return 0;
              }
            })
            .catch((err) => {
              console.log('====================================');
              console.log(`Error: ${err}`);
              console.log('====================================');
              return callback(err);
            });      
          return callback(null, users)
        }
      })
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
  
exports.sendWeeklyRestaurantReportToTelegram = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log("Received Request for sendWeeklyRestaurantReportToTelegram");
  console.log(req.body);
  console.log('====================================');

  var readRestaurantsRef = db.ref("/restaurants");
  var restaurantReport = `Here is the List of 🏤🏤🏤 added this week from ${moment().subtract(7, 'days').calendar()} to ${moment().format("MM/DD/YY")}:\n`;

  async.waterfall([
    (callback) => {
      // fetching all restaurants
      readRestaurantsRef.once("value", (snapshot, readRestaurantsError) => {
        if (readRestaurantsError) {
          return callback(readRestaurantsError);
        } else {
          let restaurants = snapshot.val();
          console.log('====================================');
          console.log(`List of Restaurants: ${JSON.stringify(restaurants)}`);
          console.log('====================================');
          for (var key in restaurants) {
            if (restaurants.hasOwnProperty(key)) {
              let restaurantMomentObj = moment(restaurants[key]["createdAt"]);
              let sevenDaysPastmomentObj = moment().subtract(7, 'days');
              let presentMomentObj = moment();
              if ((restaurantMomentObj <= presentMomentObj) && (restaurantMomentObj >= sevenDaysPastmomentObj)) {
                restaurantReport = restaurantReport + `${restaurants[key]["restaurantName"]}(${restaurants[key]["formattedAddress"]})\n`;
              }
            }
          }  
          let telegramMessage = restaurantReport;
          app.telegram.sendMessage(functions.config().telegram.groupid, telegramMessage, {})
            .then((success, err) =>{
              if (err) {
                throw err;
              } else {
                return 0;
              }
            })
            .catch((err) => {
              console.log('====================================');
              console.log(`Error: ${err}`);
              console.log('====================================');
              return callback(err);
            });      
          return callback(null, restaurants)
        }
      })
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

exports.sendWeeklyFoodReportToTelegram = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log("Received Request for sendWeeklyFoodReportToTelegram");
  console.log(req.body);
  console.log('====================================');

  var readFoodsRef = db.ref("/foods");
  var foodReport = `Here is the List of 🥑🍙🥐 added this week from ${moment().subtract(7, 'days').calendar()} to ${moment().format("MM/DD/YY")}:\n`;

  async.waterfall([
    (callback) => {
      // fetching all foods
      readFoodsRef.once("value", (snapshot, readFoodsError) => {
        if (readFoodsError) {
          return callback(readFoodsError);
        } else {
          let foods = snapshot.val();
          console.log('====================================');
          console.log(`List of Foods: ${JSON.stringify(foods)}`);
          console.log('====================================');
          for (var key in foods) {
            if (foods.hasOwnProperty(key)) {
              let foodMomentObj = moment(foods[key]["createdAt"]);
              let sevenDaysPastmomentObj = moment().subtract(7, 'days');
              let presentMomentObj = moment();
              if ((foodMomentObj <= presentMomentObj) && (foodMomentObj >= sevenDaysPastmomentObj)) {
                foodReport = foodReport + `${foods[key]["foodName"]}(Rating: ${foods[key]["rating"]})\n`;
              }
            }
          }  
          let telegramMessage = foodReport;
          app.telegram.sendMessage(functions.config().telegram.groupid, telegramMessage, {})
            .then((success, err) =>{
              if (err) {
                throw err;
              } else {
                return 0;
              }
            })
            .catch((err) => {
              console.log('====================================');
              console.log(`Error: ${err}`);
              console.log('====================================');
              return callback(err);
            });      
          return callback(null, foods)
        }
      })
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

exports.addFeedbackAndSendNotificationToTelegram = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log("Received Request for addFeedbackAndSendNotificationToTelegram");
  console.log(req.body);
  console.log('====================================');
  let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);

  // check, If all required parameters are passed.
  if (!parsedRequest.hasOwnProperty("feedback")) {
    return res.status(500).send("No feedback in the request");
  } else if (!parsedRequest.hasOwnProperty("userName")) {
    return res.status(500).send("No userName rating in the request");
  } else if (!parsedRequest.hasOwnProperty("emailID")) {
    return res.status(500).send("No emailID in the request");
  }

  var feedbacksRef = db.ref('/feedbacks');
  var feedbackTelegramMessage = `Here is the feedback that we received from 👨 ${parsedRequest.userName}(${parsedRequest.emailID}) at ${moment().format('MMMM Do YYYY, h:mm:ss a')}:\n`;
  feedbackTelegramMessage = feedbackTelegramMessage + parsedRequest.feedback;

  var feedback = {
    feedback: parsedRequest.feedback,
    userName: parsedRequest.userName,
    emailID: parsedRequest.emailID
  };

  async.waterfall([
    (callback) => {
      // adding feedback received to feedbacks collection
      let uniqueFeedbackKey = feedbacksRef.push(feedback);
      console.log('====================================');
      console.log(`Feedback Key: ${uniqueFeedbackKey}`);
      console.log('====================================');
      callback(null, uniqueFeedbackKey);
    },
    (uniqueFeedbackKey, callback) => {
      // sending a notification to telegram about the added feedback
      let telegramMessage = feedbackTelegramMessage;
      app.telegram.sendMessage(functions.config().telegram.groupid, telegramMessage, {})
        .then((success, err) => {
          if (err) {
            throw err;
          } else {
            return 0;
          }
        })
        .catch((err) => {
          console.log('====================================');
          console.log(`Error: ${err}`);
          console.log('====================================');
          return callback(err);
        });      
      return callback(null, uniqueFeedbackKey)
    }
  ], (err, result) => {
    if (err) {
      console.log(`error: ${err}`);
      res.status(500).send(err);
    }
    console.log(`Feedback has been sucessfully added and notified to telegram with feedbackID: ${result}`);
    res.status(200).send(result);
  });
});