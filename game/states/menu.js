var Scoreboard =  require('../prefabs/scoreboard');

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    // apelle à la Prefabs Bird
    var Bird = require('../prefabs/bird');
    // var de centrage
    var centerX = this.game.width/2;
    var centerY = this.game.height/2;
    // Afficher le Background
    this.background = this.game.add.sprite(0, 0, 'background');
    // Ajouter le ground + le scroll du terrain
    this.ground = this.game.add.tileSprite(0, 770, this.game.width * 2, 193, 'ground');
    this.ground.autoScroll(-200, 0);

    this.titleGroup = this.game.add.group();

    this.title = this.game.add.sprite(190, 70, 'title');
    this.title.scale.setTo(3,3);
    this.titleGroup.add(this.title);

    this.startBtn = this.game.add.button(centerX, centerY-50, 'btn_start', this.startClick, this);
    this.startBtn.animations.add('push');
    this.startBtn.scale.setTo(4,4);
    this.startBtn.anchor.setTo(0.5,0.5);
    this.titleGroup.add(this.startBtn);

    // this.menuBtn = this.game.add.button(centerX, centerY, )




    this.bird = this.add.sprite(100,70,'bird');
    this.bird.width = this.bird.width / 6.5;
    this.bird.height = this.bird.height / 6.5;
    this.bird.animations.add('flap');
    this.bird.animations.play('flap', 12, true);

    this.titleGroup.add(this.bird);

    this.titleGroup.x = 0;
    this.titleGroup.y = 0;

    this.game.add.tween(this.titleGroup).to({y:15}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },

  startClick: function(){
    this.startBtn.animations.play('push', 2, true);
    this.game.state.start('play');
  },

  update: function() {

  }
};

module.exports = Menu;
