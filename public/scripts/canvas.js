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

// Components
var ec2
var vpc
var public_subnet
var private_subnet

function preload() {
  this.load.image('vpc', 'assets/vpc.png');
  this.load.image('pub_subnet', 'assets/pub_subnet.png');
  this.load.image('priv_subnet', 'assets/priv_subnet.png');
  this.load.spritesheet('ec2', 
    'assets/ec2.png',
    { frameWidth: 300, frameHeight: 300 }
    );
}

function create() {

  // Create VPC object
  vpc = this.add.sprite(500, 400, 'vpc');
  vpc.setInteractive({ pixelPerfect:true, draggable: true });
  vpc.setScale(.8);
  vpc.on('drag', function (pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
  });
  
  // Create public subnet object
  subnet_public = this.add.sprite(600, 325, 'pub_subnet');
  subnet_public.setInteractive({ pixelPerfect:true, draggable: true });
  subnet_public.on('drag', function (pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
  });

  // Create private subnet object
  subnet_private = this.add.sprite(600, 475, 'priv_subnet');
  subnet_private.setInteractive({ pixelPerfect:true, draggable: true });
  subnet_private.on('drag', function (pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
  });

  // Create ec2 object
  ec2 = this.add.sprite(700, 325, 'ec2_sad');
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
  return subnet_public.getBounds().contains(ec2.x, ec2.y) && vpc.getBounds().contains(subnet_public.x, subnet_public.y);
}