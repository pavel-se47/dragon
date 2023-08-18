class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create(data) {
    this.createBackground();
    if (data.score !== undefined) {
      this.createStats(data);
    }
    this.createText();
    this.setEvents();
  }

  createBackground() {
    this.add.sprite(0, 0, 'bg').setOrigin(0);
  }

  createStats(data) {
    this.add
      .graphics()
      .fillStyle(0x000000, 0.5)
      .fillRoundedRect(
        config.width / 2 - 200,
        config.height / 2 - 200,
        400,
        400
      );

    const textTitle = data.completed ? 'Level Completed!' : 'Game Over!';
    const textScore = `Score: ${data.score}`;
    const textStyle = {
      font: '40px ember',
      fill: 'white',
    };

    this.add.text(config.width / 2, 250, textTitle, textStyle).setOrigin(0.5);
    this.add.text(config.width / 2, 350, textScore, textStyle).setOrigin(0.5);
  }

  createText() {
    this.add
      .text(config.width / 2, 500, 'Tap to Start', {
        font: '40px ember',
        fill: 'white',
      })
      .setOrigin(0.5);
  }

  setEvents() {
    this.input.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}
