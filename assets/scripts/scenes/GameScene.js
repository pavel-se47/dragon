class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.currentLife = 3;
    // this.curentWave = 1;
    this.score = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.createBackground();
    if (!this.sounds) {
      this.createSounds();
    }
    this.createPlayer();
    this.createEnemies();
    this.createCompleteEvents();
    this.addOverlap();
    this.createText();
  }

  addOverlap() {
    this.physics.add.overlap(
      this.player.fires,
      this.enemies,
      this.onOverlap,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.enemies.fires,
      this.player,
      this.onOverlap,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.onOverlap,
      undefined,
      this
    );
  }

  onOverlap(source, target) {
    const enemy = [source, target].find(item => item.texture.key === 'enemy');
    const dragon = [source, target].find(item => item.texture.key === 'dragon');

    if (enemy) {
      this.score += 1;
      this.killed.setText(`Score: ${this.score}`);
      Boom.generate(this, enemy.x, enemy.y);
      this.sounds.boom.play();
    }

    // if (dragon) {
    //   if (this.currentLife > 0) {
    //     this.currentLife -= 1;
    //     this.life.setText(`Lives: ${this.currentLife}`);
    //   }
    // }

    target.setAlive(false);
    source.setAlive(false);

    // if (this.player.active === false && this.currentLife > 0) {
    //   console.log('alive');
    // }
  }

  createCompleteEvents() {
    this.player.on('killed', this.onComplete, this);
    this.events.once('enimies-killed', this.onComplete, this);
  }

  onComplete() {
    // if (this.currentLife <= 0) {
    this.scene.start('Start', {
      score: this.score,
      completed: this.player.active,
    });
    // }
  }

  update() {
    this.player.move();
    this.bg.tilePositionX += 1;
  }

  createBackground() {
    this.bg = this.add
      .tileSprite(0, 0, config.width, config.height, 'bg')
      .setOrigin(0);
  }

  createPlayer() {
    this.player = new Player(this);
  }

  createEnemies() {
    this.enemies = new Enemies(this);
  }

  createText() {
    this.killed = this.add.text(50, 50, 'Score: 0', {
      font: '30px ember',
      fill: 'black',
    });

    this.life = this.add.text(200, 50, `Lives: ${this.currentLife}`, {
      font: '30px ember',
      fill: 'black',
    });

    this.wave = this.add.text(350, 50, `Wave: ${this.curentWave}`, {
      font: '30px ember',
      fill: 'black',
    });
  }

  createSounds() {
    this.sounds = {
      theme: this.sound.add('theme', {
        volume: 0.1,
        loop: true,
      }),
      boom: this.sound.add('boom', {
        volume: 0.1,
      }),
    };
    this.sounds.theme.play();
  }
}
