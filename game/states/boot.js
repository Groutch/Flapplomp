
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
