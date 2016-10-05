
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    // Chargement de Tous les Sprites et images
    this.load.image('background', 'assets/img/background.png');
    this.load.image('startButton', 'assets/img/button-play.png');
    this.load.image('gameover', 'assets/img/game-over.png');
    this.load.image('ground', 'assets/img/ground.png');
    this.load.image('title', 'assets/img/title.png');
    this.load.image('ready', 'assets/img/ready.png');
    this.load.image('scoreboard', 'assets/img/scoreboard.png');
    this.load.image('particle', 'assets/img/particle.png');
    this.load.image('medal_bronze', 'assets/img/medal_bronze.png');
    this.load.image('medal_silver', 'assets/img/medal_silver.png');
    this.load.image('medal_gold', 'assets/img/medal_gold.png');
    this.load.image('medal_platinum', 'assets/img/medal_platinum.png');

    this.load.spritesheet('pipe', 'assets/img/pipes.png', 54, 320);
    this.load.spritesheet('btn_start', 'assets/img/btn_play.png', 40, 14);
    this.load.spritesheet('btn_pause', 'assets/img/btn_pause.png', 13, 14);

    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont.png', 'assets/fonts/flappyfont.fnt');

    this.game.load.atlasJSONHash('bird', 'assets/img/bird.png', 'assets/data/bird.json');

    this.game.load.audio('score', 'assets/sounds/point.wav');
    this.game.load.audio('hit', 'assets/sounds/hit.wav');
    this.game.load.audio('flap', 'assets/sounds/flap.wav');
    this.game.load.audio('menu', 'assets/sounds/menu.wav');
    this.game.load.audio('fall', 'assets/sounds/fall.wav');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
