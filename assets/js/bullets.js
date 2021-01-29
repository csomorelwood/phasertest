class Bullet extends Phaser.Physics.Arcade.Sprite{
  constructor (scene, x, y){
    super(scene, x, y, 'bullet');
  }

  fire (x, y){
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityY(1000);
  }
  fireDown (x, y){
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityY(-1000);
  }
  fireRight (x,y){
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(1000);
  }
  fireLeft (x,y){
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(-1000);
  }

  preUpdate (time, delta){
    super.preUpdate(time, delta);

    if (this.x <= 32){
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class Bullets extends Phaser.Physics.Arcade.Group{
  constructor (scene){
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet
    });
  }

  fireBullet (x, y, z){
    let bullet = this.getFirstDead(true);

    if (bullet){
      if(z==='left'){
        bullet.fireLeft(x, y);
      }
      else if(z==='right'){
        bullet.fireRight(x, y);
      }
      else if(z==='up'){
        bullet.fire(x, y);
      }
      else {
        bullet.fireDown(x, y);
      }
    }
  }
}