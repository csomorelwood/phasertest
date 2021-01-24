/*
*
*   Config
*
*/
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  title: 'A Makróvonat elszabadul',
  banner: {
    text: '#ffffff',
    background: [
        '#fff200',
        '#38f0e8',
        '#00bff3',
        '#ec008c'
    ],
    hidePhaser: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var platforms
var player
var stars
var cursors
var score = 0
var scoreText
var bombs
var gameOver = false
var moveCam = false
var bullets
var bulletTime = 0
var game = new Phaser.Game(config);

let playerSpeed = 250

/*
*
*   Preload
*
*   Asset méretek: 500x300
*
*/
function preload (){
  this.load.image('sky', 'assets/img/bg_long.png');
  this.load.image('ground', 'assets/img/ground.png');
  this.load.image('platform', 'assets/img/platform.png');
  this.load.image('star', 'assets/img/star.png');
  this.load.image('bomb', 'assets/img/bomb.png');
  this.load.image('bullet', 'assets/img/faszmakro.png')
  this.load.spritesheet('dude', 
      'assets/img/makrovonat_sprite.png',
      { frameWidth: 83, frameHeight: 50 }
  );
}

/*
*
*   Create
*
*/
function create (){
  this.add.image(3100, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  this.cameras.main.setBounds(0, 0, 800 * 8, 600);

  platforms.create(3100, 575, 'ground');

  platforms.create(600, 400, 'platform');
  platforms.create(50, 250, 'platform');
  platforms.create(750, 220, 'platform');
  
  player = this.physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0,0,5800,600))

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  cursors = this.input.keyboard.createCursorKeys();
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.cameras.main.startFollow(player, true, 0.09, 0.09);
  this.cameras.main.setZoom(1);

  // Bullets
  bullets = this.physics.add.staticGroup();
}

/*
*
*   Update
*
*/
function update (){
  const cam = this.cameras.main;
  if (gameOver){
    return;
  }

  if (cursors.left.isDown){
    if(cursors.shift.isDown){
      player.setVelocityX(-2*playerSpeed);
    }
    else{
      player.setVelocityX(-playerSpeed);
    }
    player.anims.play('left', true);
    if(this.moveCam){
      cam.scrollX -= 4;
    }
  }
  else if (cursors.right.isDown){
    if(cursors.shift.isDown){
      player.setVelocityX(2*playerSpeed);
    }
    else{
      player.setVelocityX(playerSpeed);
    }
    player.anims.play('right', true);
    if(this.moveCam){
      cam.scrollX += 4;
    }
  }
  else if(cursors.space.isDown){
    fireBullet();
  }
  else{
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down){
    player.setVelocityY(-330);
  }
}

function collectStar (player, star){
  star.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
}

function fireBullet(){
  let bullet = bullets.create(player.x, player.y, 'bullet');
  if(bullet){
    bullet.setVelocityX(500);
  }
}