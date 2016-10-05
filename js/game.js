(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(575, 960, Phaser.AUTO, 'flapplomp');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(1.5,1.5);
  this.game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;
  
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  // write your prefab's specific update code here
  
};

module.exports = Pipe;
},{}],5:[function(require,module,exports){
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

},{"./pipe":4}],6:[function(require,module,exports){
'use strict';

var Scoreboard = function(game) {
	var gameover;

	Phaser.Group.call(this,	game);

	gameover = this.create(this.game.width/2, 100, 'gameover');
	gameover.anchor.setTo(0.5,0.5);

	this.scoreboard = this.create(this.game.width / 2, 250, 'scoreboard');
	this.scoreboard.anchor.setTo(0.5, 0.5);

	this.scoreText = this.game.add.bitmapText(365, 230, 'flappyfont', '', 18);
	this.add(this.scoreText);

	this.bestScoreText = this.game.add.bitmapText(365, 280, 'flappyfont', '', 18);
	this.add(this.bestScoreText);

	this.startButton = this.game.add.button(this.game.width/2, this.game.height/2-50, 'startButton', this.startClick, this);
	this.startButton.anchor.setTo(0.5,0.5);

	this.add(this.startButton);

	this.y = this.game.height;
	this.x = 0;
  	// initialize your prefab here

    this.menuSound = this.game.add.audio('menu');
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score){
	var medals, bestScore;

	this.menuSound.play();

	this.scoreText.setText(score.toString());

	if(!!localStorage){
		bestScore = localStorage.getItem('bestScore');

		if(!bestScore || bestScore < score) {
			bestScore = score;
			localStorage.setItem('bestScore', bestScore);
		}
	} else {
		bestScore = 'N/A';
	}

	this.bestScoreText.setText(bestScore, toString());

	if(score >= 20 && score < 50)
	{
		medals = this.game.add.sprite(-65 , 7, 'medal_bronze');
		medals.anchor.setTo(0.5, 0.5);
		this.scoreboard.addChild(medals);
	} else if(score >= 50 && score < 100) {
		medals = this.game.add.sprite(-65 , 7, 'medal_silver');
		medals.anchor.setTo(0.5, 0.5);
		this.scoreboard.addChild(medals);
	} else if(score >= 100 && score < 250){
		medals = this.game.add.sprite(-65 , 7, 'medal_gold');
		medals.anchor.setTo(0.5, 0.5);
		this.scoreboard.addChild(medals);
	} else if(score >= 250){
		medals = this.game.add.sprite(-65 , 7, 'medal_platinum');
		medals.anchor.setTo(0.5, 0.5);
		this.scoreboard.addChild(medals);
	}

	this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

	if (medals) {

		var emitter = this.game.add.emitter(medals.x, medals.y, 400);
		this.scoreboard.addChild(emitter);
		emitter.width = medals.width;
		emitter.height = medals.height;

		emitter.makeParticles('particle');

		emitter.setRotation(-100, 100);
		emitter.setXSpeed(0,0);
		emitter.setYSpeed(0,0);
		emitter.minParticleScale = 0.25;
		emitter.maxParticleScale = 0.5;
		emitter.setAll('body.allowGravity', false);

		emitter.start(false, 1000, 1000);

	}
};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};

Scoreboard.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Scoreboard;

},{}],7:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
	init: function(){
		if (this.game.device.desktop)
		{
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(480, 260, 1024, 768, 360);
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
		}
		else
		{
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(480, 260, 1024, 768, 360);
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.scale.forceOrientation(true, false);
			this.scale.setResizeCallback(this.gameResized, this);
		}

	},
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
	},
	create: function() {
		this.game.input.maxPointers = 1;
		this.game.state.start('preload');
	}
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {

  },
  update: function () {

  }
};
module.exports = GameOver;

},{}],9:[function(require,module,exports){
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

},{"../prefabs/bird":2,"../prefabs/scoreboard":6}],10:[function(require,module,exports){
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
},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipeGroups":5,"../prefabs/scoreboard":6}],11:[function(require,module,exports){

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

},{}]},{},[1])