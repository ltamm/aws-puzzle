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
var ec2, vpc, public_subnet, private_subnet, nat_gateway_toggle

function preload() {
  this.load.image('vpc', 'assets/vpc.png');
  this.load.image('pub_subnet', 'assets/pub_subnet.png');
  this.load.image('priv_subnet', 'assets/priv_subnet.png');
  this.load.image('nat_gw', 'assets/nat.png');

  // Spritesheets
  this.load.spritesheet('ec2', 
    'assets/ec2.png',
    { frameWidth: 300, frameHeight: 300 });
}

function create() {

  // Create VPC object
  vpc = this.add.sprite(500, 400, 'vpc');
  vpc.setScale(.8);
  vpc.on('drag', on_drag);
  
  create_public_subnet(this);

  // Create private subnet object
  private_subnet = this.add.sprite(610, 475, 'priv_subnet');
  private_subnet.setScale(.8);

  create_ec2(this);
}

function update() {
  if (has_connectivity() ) {
    ec2.anims.play('happy');
  }
  else {
    ec2.anims.play('sad');
  }

  if (nat_gateway_enabled) {
    nat_gateway_toggle.setTint(0xff44ff);
  }
  else {
    nat_gateway_toggle.clearTint();
  }
}

function has_connectivity() {
  var in_public_subnet = public_subnet.getBounds().contains(ec2.x, ec2.y)
  var private_subnet_with_gateway = private_subnet.getBounds().contains(ec2.x, ec2.y) && nat_gateway_enabled;

  return in_public_subnet || private_subnet_with_gateway;
}

function on_drag(pointer, dragX, dragY) {
  this.x = dragX;
  this.y = dragY;
}

function create_ec2(scene) {
  ec2 = scene.add.sprite(500, 325, 'ec2');
  ec2.setScale(0.3);

  // Drag hitbox
  ec2.setInteractive({
    hitArea: new Phaser.Geom.Rectangle(0, 0, 300, 300),
    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    useHandCursor: true,
    draggable: true });
  ec2.on('drag', on_drag);

  // ec2 animations
  scene.anims.create({
    key: 'happy',
    frames: [ { key: 'ec2', frame: 0} ],
    frameRate: 20
  });

  scene.anims.create({
    key: 'sad',
    frames: [ { key: 'ec2', frame: 1} ],
    frameRate: 20
  });
}

function create_public_subnet(scene) {
  bg = scene.add.image(0,0, 'pub_subnet');
  nat_gateway_toggle = scene.add.image(275, 0, 'nat_gw');

  // make toggle interactive
  // where did 40 come from? Good question! I think it's the height/width of
  // the toggle image?
  nat_gateway_toggle.setInteractive({
    hitArea: new Phaser.Geom.Circle(40, 40, 40),
    hitAreaCallback: Phaser.Geom.Circle.Contains,
    useHandCursor: true });
    nat_gateway_toggle.on('pointerup', function() {
      toggleNatGateway();
  });

  public_subnet = scene.add.container(610, 325, [bg, nat_gateway_toggle])
  public_subnet.setSize(bg.width, bg.height);
  public_subnet.setScale(0.8)

  function toggleNatGateway() {
    nat_gateway_enabled = !nat_gateway_enabled
  }
}
