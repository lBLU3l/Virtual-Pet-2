//Create variables here
var dog, dogImg;
var happyDogImg;
var database;
var foodS, foodStock;

var feedButton, addFoodButton;
var fedTime, lastFed;
var foodObj;

function preload()
{
  //loading images
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happydog.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1000, 500);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  //adding the dog
  dog = createSprite(820, 270, 75, 75);
  dog.addImage(dogImg);
  dog.scale = 0.25;

  //creating the feed button
  feedButton = createButton("Feed");
  feedButton.position(650, 430);
  feedButton.mousePressed(feedDog);

  //creating the add food button
  addFoodButton = createButton("Add Food");
  addFoodButton.position(950, 430);
  addFoodButton.mousePressed(addFood);

  
}


function draw() {  
  background(46, 139, 87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });
  
  textSize(20);
  fill("blue");
  stroke("black");
  text("Food: " + foodS, 220, 470);

  //calculating when the dog was last fed
  fill(255, 255, 254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed: " + lastFed%12 + " PM", 350, 30);
  }else if(lastFed == 0){
    text("Last Feed: 12 AM", 350, 30);
  }else{
    text("Last Feed: " + lastFed + " AM", 350, 30);
  }

  drawSprites();

}



function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to add food
function addFood(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

//function to feed the dog
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })

}