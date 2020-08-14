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
var nat_gateway_enabled = false;

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
    { frameWidth: 300, frameHeight: 300 });
}

function create() {

  // Create VPC object
  vpc = this.add.sprite(500, 400, 'vpc');
  vpc.setInteractive({ pixelPerfect:true, draggable: true });
  vpc.setScale(.8);
  vpc.on('drag', on_drag);
  
  // Create public subnet object
  public_subnet = this.add.sprite(610, 325, 'pub_subnet');
  public_subnet.setInteractive({ pixelPerfect:true, draggable: true });
  public_subnet.setScale(.8);
  public_subnet.on('drag', on_drag);

  // Create private subnet object
  private_subnet = this.add.sprite(610, 475, 'priv_subnet');
  private_subnet.setInteractive({ pixelPerfect:true, draggable: true });
  private_subnet.setScale(.8);
  private_subnet.on('drag', on_drag);

  // Create ec2 object
  ec2 = this.add.sprite(700, 325, 'ec2');
  ec2.setInteractive({ pixelPerfect:true, draggable: true });
  ec2.setScale(0.3);
  ec2.on('drag', on_drag);

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
  return public_subnet.getBounds().contains(ec2.x, ec2.y) && vpc.getBounds().contains(public_subnet.x, public_subnet.y);
}

function on_drag(pointer, dragX, dragY) {
  this.x = dragX;
  this.y = dragY;
}