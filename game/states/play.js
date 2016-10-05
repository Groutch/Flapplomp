'use strict';
var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');
var PipeGroup = require('../prefabs/pipeGroups');
var Scoreboard =  require('../prefabs/scoreboard');

function Play() {}
Play.prototype = {
  create: function() {
    // Ajoût de la physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Ajout de la gravitée
    this.game.physics.arcade.gravity.y = 1200;
    // Ajout du Background
    this.background = this.game.add.sprite(0,0,'background');

    // this.btn_pause = this.game.add.sprite(10,10,'btn_pause');
    // this.btn_pause.scale.setTo(3,3);

    // Ajout du Sprite de l'oiseau
    this.bird = new Bird(this.game, 100, this.game.height/2);
    this.bird.width = this.bird.width / 6.5;
    this.bird.height = this.bird.height / 6.5;
    this.bird.body.collideWorldBounds= true;
    this.game.add.existing(this.bird);


    this.pipes = this.game.add.group();

    this.ground = new Ground(this.game, 0, 770, this.game.width * 2, 193);
    this.game.add.existing(this.ground);

    this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.flapKey.onDown.addOnce(this.startGame, this);
    this.flapKey.onDown.add(this.bird.flap, this.bird);

    this.game.input.onDown.addOnce(this.startGame, this)
    this.game.input.onDown.add(this.bird.flap, this.bird);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);


    this.score = 0;
    this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);
    this.scoreText.scale.setTo(2,2);

    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, this.game.height/2, 'ready'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    this.pipeGenerator = null;

    this.gameover = false;

    this.hitSound = this.game.add.audio('hit');
    this.fallSound = this.game.add.audio('fall');
    this.scoreSound = this.game.add.audio('score');

  },

  update: function() {
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
    if(!this.gameover){
      this.pipes.forEach(function(pipeGroup) {
        this.checkScore(pipeGroup);
        this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
      }, this);
    }
    // console.log(this.gameover);

    if(this.ground.x + this.ground.width / 2 <= 0) {
      this.ground.x = 0;
    }
  },

  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.pipes.destroy();
    this.scoreboard.destroy();
  },

  startGame: function(){
    if(!this.bird.alive && !this.gameover) {
      this.bird.body.allowGravity = true;
      this.bird.alive = true;

      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
      this.pipeGenerator.timer.start();

      this.instructionGroup.destroy();
    }
  },

  checkScore: function(pipeGroup){
    if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x){
      pipeGroup.hasScored = true;
      this.score++
      this.scoreText.setText(this.score.toString());
      this.scoreSound.play();
    }
  },


  deathHandler: function(enemy, bird, pipeGroup) {
    console.log('death');
    this.fallSound.play();
    this.bird.alive = false;
    this.flapKey.onDown.remove(this.bird.flap, this.bird);
    this.game.input.onDown.remove(this.bird.flap, this.bird);
    this.scoreboard = new Scoreboard(this.game);
    this.game.add.existing(this.scoreboard);
    this.scoreboard.show(this.score);


    if(!this.gameover) {
      this.gameover = true;
      this.bird.kill();
      this.pipes.callAll('stop');
      this.pipeGenerator.timer.stop();
      this.ground.body.velocity.x = 0;
      this.scoreText.visible = false;
    }
  },

  generatePipes: function() {
    console.log('generate pipe')
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if(!pipeGroup) {
      pipeGroup = new PipeGroup(this.game, this.pipes);
    }
    pipeGroup.reset(this.game.width, pipeY);
  }
};

module.exports = Play;