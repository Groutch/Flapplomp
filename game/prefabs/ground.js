'use strict';

var Ground = function(game, x, y, width, height, frame) {
	Phaser.TileSprite.call(this, game, x, y, width, height, 'ground', frame);

  // initialize your prefab here
  // this.autoScroll(-200,0);

  this.game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;

  this.body.velocity.x = -200;
  this.body.rebound = false;
};

Ground.prototype = Object.create(Phaser.Sprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Ground;
