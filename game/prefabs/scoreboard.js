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
