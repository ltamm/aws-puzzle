var config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  backgroundColor: '#2d2d2d',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var debugtext
var ec2

// Components
var vpc
var subnet

function preload() {
  this.load.image('vpc', 'assets/vpc.png');
  this.load.image('pub_subnet', 'assets/pub_subnet.png');
  this.load.spritesheet('ec2', 
    'assets/ec2.png',
    { frameWidth: 300, frameHeight: 300 }
    );
}

function create() {

  // Create VPC object
  vpc = this.add.sprite(500, 400, 'vpc');
  vpc.setInteractive({ pixelPerfect:true, draggable: true });
  vpc.setScale(0.4);
  vpc.on('drag', function (pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
  });

  // Create subnet object
  subnet = this.add.sprite(500, 400, 'pub_subnet');
  subnet.setInteractive({ pixelPerfect:true, draggable: true });
  // subnet.setScale(0.3);
  subnet.on('drag', function (pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
  });

  // Create ec2 object
  ec2 = this.add.sprite(500, 400, 'ec2_sad');
  ec2.setInteractive({ pixelPerfect:true, draggable: true });
  ec2.setScale(0.3);
  ec2.on('drag', function (pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
  });

  // ec2 animations
  this.anims.create({
    key: 'happy',
    frames: [ { key: 'ec2', frame: 0} ],
    frameRate: 20
  });

  this.anims.create({
    key: 'sad',
    frames: [ { key: 'ec2', frame: 1} ],
    frameRate: 20
  });

  debugtext = this.add.text(16, 16, has_connectivity().toString(), {fontSize: '32px', fill: '#000' });

}

function update() {
  if (has_connectivity() ) {
    ec2.anims.play('happy');
  }
  else {
    ec2.anims.play('sad');
  }
}

function has_connectivity() {
 return subnet.getBounds().contains(ec2.x, ec2.y) && vpc.getBounds().contains(subnet.x, subnet.y);
}