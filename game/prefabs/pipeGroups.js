'use strict';

var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.topPipe = new Pipe(this.game, 0, 0, 0);
  this.bottomPipe = new Pipe(this.game, 0, 660, 1);
  this.add(this.topPipe);
  this.add(this.bottomPipe);
  this.hasScored = false;

  // this.setAll('body.velocity.x', -200);
  this.topPipe.body.velocity.x = -200;
  this.bottomPipe.body.velocity.x = -200;
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
  this.checkWorldBounds();
};

PipeGroup.prototype.checkWorldBounds = function() {
  if(!this.topPipe.inWorld) {
    this.exists = false;
  }
};

// PipeGroup.prototype.stopPipe = function(){
//   if(this.gameover == true){
//     console.log('here');
//     this.topPipe.body.velocity.x = 0;
//     this.bottomPipe.body.velocity.x = 0;
//   }
// }

PipeGroup.prototype.reset = function(x, y) {
  this.topPipe.reset(0,0);
  this.bottomPipe.reset(0,660);
  this.x = x;
  this.y = y;
  this.topPipe.body.velocity.x = -200;
  this.bottomPipe.body.velocity.x = -200;
  // this.setAll('body.velocity.x', -200);
  this.hasScored = false;
  this.exists = true;
};


module.exports = PipeGroup;
