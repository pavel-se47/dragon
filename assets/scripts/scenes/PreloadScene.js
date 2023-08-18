class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.add.sprite(0, 0, 'bg').setOrigin(0);
    const loadingBar = new LoadingBar(this);
    this.preloadAssets();
  }

  preloadAssets() {
    this.load.atlas(
      'dragon',
      'assets/sprites/dragon.png',
      'assets/sprites/dragon.json'
    );
    this.load.atlas(
      'enemy',
      'assets/sprites/enemy.png',
      'assets/sprites/enemy.json'
    );
    this.load.atlas(
      'boom',
      'assets/sprites/boom.png',
      'assets/sprites/boom.json'
    );
    this.load.image('fire', 'assets/sprites/fire.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');

    this.load.audio('theme', 'assets/sounds/theme.mp3');
    this.load.audio('boom', 'assets/sounds/boom.mp3');
  }

  create() {
    this.scene.start('Start');
  }
}
