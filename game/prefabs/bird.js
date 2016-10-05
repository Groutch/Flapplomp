'use strict';

var Bird = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);

  // initialize your prefab here
  this.anchor.setTo(0.5,0.5);

  this.animations.add('fly');
  this.animations.play('fly', 8, true);

  this.alive = false;
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.flapSound = this.game.add.audio('flap');
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;
Bird.prototype.flap = function(){
	this.flapSound.play();

  this.body.velocity.y = -400;

	this.game.add.tween(this).to({angle: -40}, 100).start();
}
Bird.prototype.update = function() {

  // write your prefab's specific update code here
  if(this.angle < 90 && this.alive) {
    this.angle += 2.5;
  }
};

module.exports = Bird;