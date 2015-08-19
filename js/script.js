var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var player;
var body;
var sy;
var legs;
var background;
var score;
var style;
var numlegs = 0;
var score;
var highscore;
var jumping;
var hazards;
var space;
var powerup;
var scrollspeed = 3.0;
var cooldown = 0;
var trapped;
var usedHazards;
var gameover;
var aspeed;
var gameoverSprite;
var difficulty = 75;
var difficultyIncrease = 0;

function preload() {
   
  //same  
  game.load.image("background", "assets/duddleSpace.png");
  game.load.image("player", "assets/duddle.png");
  game.load.image("leg", "assets/leg.png");
  game.load.image("bear trap", "assets/bearTrap.png");
  game.load.spritesheet("legsBearTrap", "assets/gotLegsBearTrap.png", 150, 150);
  game.load.spritesheet("mine", "assets/mine.png", 75, 50);
  game.load.spritesheet("mine-explode", "assets/mine-explode.png", 175, 225);
  game.load.image("power", "assets/powerup.png");
  game.load.image("sand", "assets/sand.png");
  game.load.spritesheet("sandfall", "assets/sandfall.png", 125, 126);
  game.load.image("gameover", "assets/gameover2.png");
}

function reset() {
  numlegs = 0;
  jumping = false;
  body = game.add.sprite(0, 0, "player");
  body.anchor.setTo(0.5, 0.5);
  body.scale.setTo(0.7, 0.7);
  legs = game.add.group();
  player = game.add.group();
  player.add(legs);
  player.add(body);
  player.x = 100;
  player.y = 200;
  body.anchor.setTo(0.5, 0.5);
  addLeg();
  addLeg();
  addLeg();
  gameoverSprite = game.add.sprite(400, 300, "gameover");
  gameoverSprite.anchor.setTo(0.5, 0.5);
  gameoverSprite.alpha = 0;
}

function create() {
  gameover = false;
  aspeed = 3;
  cursors = game.input.keyboard.createCursorKeys();
  sy = 5;
  background = game.add.tileSprite(0, 0, 800, 600, 'background');
  space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  space.onDown.add(jump, this);
  style = { font: 'bold 12pt Arial', fill: 'white', align: 'left'};
  score = game.add.text(10, 10, numlegs.toString(), style);
  hazards = game.add.group();
  
  powerup = game.add.group();
  //player.animations.add("run", [0, 1, 2, 3, 4, 5], 30, true);
  reset();
  addHazard();
  usedHazards = game.add.group();
}

function addHazard() { 
  var spawn = Math.random();
  if (spawn <= .33) {
    var hazard = hazards.create(800, Math.random()*400+200, "mine");
    hazard.animations.add("beep", [0, 1, 2, 3], 30, true);
    hazard.animations.play("beep");
    hazard.tag = "mine";
  } 
  else if (spawn <= .66) {
    var hazard = hazards.create(800, Math.random()*400+200, "bear trap");
    hazard.tag = "bear trap";
  }
  else {
    var hazard = hazards.create(800, Math.random()*400+200, "sand")
;  }
  cooldown = 0;
}

function addPowerUp() { 
  if (getRandomNumber() == 0) {
    var power = powerup.create(800, Math.random()*400+200, "power");
  }
}

function jump() {
  if (!gameover) {
    scrollspeed = 30;
    sy = 10;
  }
}

function getRandomNumber() {
  return parseInt(Math.random()*2);
}

function addLeg() {
  var angle = Math.random()*(Math.PI*2);
  var leg = legs.create(50*Math.cos(angle) + body.x, 50*Math.sin(angle) + body.y, "leg");
  //var scale = Math.random()*0.5 + 0.5;
  var scale = 1;
  
  //if (getRandomNumber() == 0) {
    //leg.scale.setTo(scale, scale);
  //} else {//this is my code get outta here // same // lol no.
    leg.scale.setTo(-scale, scale);
  //}
  
  leg.angle = game.math.radToDeg(angle);/*
  leg.anchor.x = player.x;
  leg.anchor.y = player.y;*/
  numlegs++;
}

function update() {
  usedHazards.forEach(function(h) {
    h.x -= scrollspeed;
    
  });
  console.log(scrollspeed);
  difficultyIncrease++;
  if (difficultyIncrease > 200) {
    difficulty--;
    difficultyIncrease = 0;
    scrollspeed += .1;
  }
  score.text = "Limbs: " + numlegs.toString();
  cooldown++;
  if (cooldown >= difficulty) {
    if (Math.random() > .99) {
      addPowerUp();
    } else if (Math.random() <= .02) {
      addHazard();
    }
  }
  
  var br;
  legs.forEach(function(leg) {
    var overlapped = false;
    hazards.forEach(function (hazard) {
      if (leg.overlap(hazard)) {
        overlapped = true;
        numlegs--;
        if (hazard.key == "bear trap" ) {
          trapped = game.add.sprite(hazard.x -20 , hazard.y-100, 'legsBearTrap');
          trapped.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, true);
          trapped.animations.play('walk', 20, false);
          usedHazards.add(trapped);
        }
        
        if (hazard.key == "mine" ) {
          trapped = game.add.sprite(hazard.x -20 , hazard.y-140, 'mine-explode');
          trapped.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 10, true);
          trapped.animations.play('walk', 20, false);
          usedHazards.add(trapped);
        }
        
        if (hazard.key == "sand" ) {
          trapped = game.add.sprite(hazard.x -15 , hazard.y-85, 'sandfall');
          trapped.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 10, true);
          trapped.animations.play('walk', 20, false);
          usedHazards.add(trapped);
        }
        
        hazard.destroy();
      }
      
    });
    if (overlapped) { 
      leg.destroy(); 
      
      if (numlegs == 0) {
        gameover = true;
      }
    }
  });
  
  console.log(gameover);
  
  if (game.input.keyboard.isDown(Phaser.Keyboard.R) && gameover) {
    scrollspeed = 3;
    gameover = false;
    hazards.destroy();
    addLeg();addLeg();addLeg();
    numlegs = 3;
    player.y = 200;
    hazards = game.add.group();
    powerup.destroy();
    powerup = game.add.group();
    aspeed = 3;
    gameoverSprite.alpha = 0;
  }
  
  if (gameover) {
    gameoverSprite.alpha = 1;
    scrollspeed += (-scrollspeed)/50;
    aspeed += (-aspeed)/30
  }
  
  powerup.forEach(function (power) {
    power.x -= scrollspeed;
    if (power.overlap(body)) {
      power.destroy();
      addLeg();
      return;
    } 
  });
  
  
  hazards.forEach(function (hazard) {
    hazard.x -= scrollspeed;
  });
  
  background.tilePosition.x -= scrollspeed;
  
  player.angle += aspeed;
  
  if (cursors.up.isDown && player.y > 200) {
    player.y -= sy;
  }
  

  
  if (cursors.down.isDown && player.y < 700 - player.height) {
    player.y += sy;
  }
}
