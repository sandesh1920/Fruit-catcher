var key, time,sky,player,rectangle1,rectangle2,arrow,gs = "play";
var MARGIN = 0;
var bomblimit = 50;
var score =0
function preload(){
  load = loadImage("load.gif")
  back = loadImage("back.jpg");
  playerImage = loadImage("galaxy.png");
  bombi = loadImage("bomb.png")
  bombbutoon = loadImage("bombpath.png");
  particleImage = loadImage("rock.png");
  blast = loadImage("blast.png");
  blastS = loadSound("explosion.wav");
  enemyI = loadImage("enemy.png");
  coinI = loadImage("coin.gif");
  gso = loadImage("game over.png");
  won = loadImage("won.png");

}

function setup() {
  canvas = createCanvas(displayWidth-75,displayHeight-75)  
  // put setup code here
  time = 0;
camera.zoom -=0.05
ypos = 2161;
  sky = createSprite(width/2,height/2,displayWidth,height*3);
  sky.addImage(back)
  sky.scale = 5.5;
  player = createSprite(width/2,2161,20,20);
  player.addImage(playerImage);
  player.setCollider("circle",0,0,32.5)

  enemy = createSprite(width/2,-550,20,20);
  enemy.addImage(enemyI);
  enemy.velocity.x= 10;
   enemy.visible = false; 

  coin = createSprite(width/2,-550,20,20);
  coin.addImage(coinI);
  coin.visible = false;
  coin.scale = 0.1;


  rectangle1 = createSprite(0,600,10,displayHeight);
  rectangle1.visible = false;
  
  rectangle2 = createSprite(width,600,10,displayHeight);
  rectangle2.visible = false;
  key = 1;
  
  rct = createSprite(displayWidth-100, player.y - 200, 25,25);
  rct.addImage(bombbutoon);
  rct.scale = 0.3;
  bullets = new Group();
  asteroids = new Group();

  for(var i = 0; i<100; i++) {
    var ang = random(360);
    var px = width/2 + 500 * cos(radians(ang));
    var py = height/2+ 500 * sin(radians(ang));
    createAsteroid(3, px, py);
  }
  

}

function draw() {
  // put drawing code here
  background(25, 31, 38);
  
  // camera.zoom -= .001;

  time+=0.0333;
  rtime = Math.round(time)
  if (rtime < 1){
    image(load, -35,-35,displayWidth,displayHeight+250);
    
  }else{
  drawSprites();
  rct.x = mouseX
  player.y = ypos;
  // console.log(player.y)
  // bullets.bounce(bullets);
  asteroids.overlap(bullets, asteroidHit);
  enemy.overlap(bullets, enemyHit);

  asteroids.overlap(player, playerHit);

  player.rotation +=1;
  for(var i=0; i<asteroids.length; i++) {
    var s = asteroids[i];
    if(s.position.x<-MARGIN) s.position.x = displayWidth+MARGIN;
    if(s.position.x>displayWidth+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = displayHeight+MARGIN;
    if(s.position.y>displayHeight+MARGIN) s.position.y = -MARGIN;
  }
  // console.error("hi");
  // console.warn("hi");
  // console.clear();
  if (enemy.x >= 1290) {
    enemy.velocity.x= -30;
    
  }
  else if (enemy.x <= 0){
    enemy.velocity.x= 30;
  } 
  // console.log(player.x)
      // player.x = mouseX;
      rct.y = player.y - 200;
  player.attractionPoint(0.2, mouseX, ypos);
    if (player.isTouching(coin)){
      bomblimit+=10;
      score+=1000;
      coin.remove()
    }
    if (player.isTouching(enemy)){
      allSprites.destroyEach()
      
      gs = "end";
    }
    if (gs=="end") {
      background(gso);
      allSprites.destroyEach();
    }
    camera.position.y = player.y;
    textSize(32)
    text("Score: "+score,width/2,camera.position.y-330);
      player.maxSpeed = 6;
  getAsteroidNumber();
      player.collide(rectangle1)
      player.collide(rectangle2)
      player.bounce(rectangle1)
      player.bounce(rectangle2)
      if(player.mouseIsOver){
        player.rotation-=100;
      }
      if ((mousePressedOver(rct) || keyWentDown("space")) && bomblimit !== 0 && gs === "play") {
        createBomb(); 
        bomblimit-=1;
      }
      if (camera.position.y < -400) {
        enemy.visible = true;
        coin.visible = true;

      }
      else{
        enemy.visible = false; 
        coin.visible = false;

      }
      if (camera.position.y <- 1479){
        gs = "won";
      }
      if (keyDown("UP")) {
        ypos-=10
      }
      if (keyDown("DOWN") && player.y<2161) {
        ypos+=10;
      }
      // console.log(player.y)
      if (gs == "play")
        text("bomb left:" + bomblimit,player.x-75,player.y-50)
      if (gs === "won"){
        allSprites.destroyEach();
        // sky.velocity.y = 0;
        background(won);
        text("You won",width/2-16,height/2-5);
      }
  }

  
  
}


function createBomb() {
  var bomb= createSprite(100, player.y - 100, 60, 10);
  bomb.addImage(bombi);
  bomb.x=rct.x;
  bomb.velocity.y = -4;
  bomb.lifetime = 150;
  bullets.add(bomb)
  return bomb;
  key = 2
}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img = loadImage('rock.png');
  a.addImage(img);
  a.setSpeed(2.5-(type/2), random(360));
  a.rotationSpeed = 0.5;
  //a.debug = true;
  a.type = type;

  if(type == 2)
    a.scale = 1;
  if(type == 1)
    a.scale = 0.6;

  a.mass = 5+a.scale;
  a.debug = true;
  a.setCollider('circle', 0, 0, 15);
  asteroids.add(a);
  return a;
}

function asteroidHit(asteroid, bullet) {
  var newType = asteroid.type-1;

  if(newType>0) {
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }

  for(var i=0; i<10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(blast);
    p.setSpeed(random(3, 5), random(360));
    // if (newType = 1){
    //   p.scale =0.6
    // }
    p.friction = 0.95;
    p.life = 15;
  }

  bullet.remove();
  asteroid.remove();
  blastS.play();
}

function enemyHit(enemy, bullet) {
  

  for(var i=0; i<10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(blast);
    p.setSpeed(random(3, 5), random(360));
    // if (newType = 1){
    //   p.scale =0.6
    // }
    p.friction = 0.95;
    p.life = 15;
  }

  bullet.remove();
  enemy.remove();
  blastS.play();
}

function playerHit(asteroid, player) {
  gs = "end";
}

async function getAsteroidNumber(){
  var asteroid_no = await asteroids.length
  if (asteroid_no == 0){
    
    

  }
}