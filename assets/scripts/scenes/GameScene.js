class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.currentLife = 3;
    this.currentWave = 1;
    this.score = 0;
    this.lifeEnemy1 = null;
    this.lifeEnemy2 = null;
    this.lifeEnemy3 = null;
    this.lifeEnemy4 = null;
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

    target.countLife -= 1;

    if (enemy) {
      if (target.health === 3 && target.countLife === 0) {
        this.score += 3;
      } else if (target.health === 2 && target.countLife === 0) {
        this.score += 2;
      } else if (target.health === 1 && target.countLife === 0) {
        this.score += 1;
      }
      this.killed.setText(`Score: ${this.score}`);
      Boom.generate(this, enemy.x, enemy.y);
      this.sounds.boom.play();
    }

    if (target.countLife === 0) {
      target.setAlive(false);
    }

    source.setAlive(false);
  }

  createCompleteEvents() {
    this.player.once('killed', this.onCompletePlayerKilled, this);
    this.events.once('enimies-killed', this.onCompleteEnimiesKilled, this);
  }

  onCompletePlayerKilled() {
    if (this.currentLife <= 1 || this.currentWave >= 5) {
      this.goToStatistics();
    } else if (this.currentLife > 0 && !this.player.active) {
      this.nextLife();
    }
  }

  onCompleteEnimiesKilled() {
    if (this.player.active && this.currentWave < 5) {
      this.nextWave();
    } else if (this.currentLife <= 1 || this.currentWave >= 5) {
      this.goToStatistics();
    }
  }

  goToStatistics() {
    this.scene.start('Start', {
      score: this.score,
      completed: this.player.active,
    });
  }

  nextLife() {
    this.currentLife -= 1;
    this.life.setText(`Lifes: ${this.currentLife}`);
    this.createPlayer();
    this.player.once('killed', this.onCompletePlayerKilled, this);
    this.addOverlap();
  }

  nextWave() {
    this.currentWave += 1;
    this.wave.setText(`Waves: ${this.currentWave}`);
    this.createEnemies();
    this.events.once('enimies-killed', this.onCompleteEnimiesKilled, this);
    this.addOverlap();
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

    this.life = this.add.text(200, 50, `Lifes: ${this.currentLife}`, {
      font: '30px ember',
      fill: 'black',
    });

    this.wave = this.add.text(350, 50, `Waves: ${this.currentWave}`, {
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
