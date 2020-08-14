var config = {
  type: Phaser.AUTO,
  width: 838,
  height: 550,
  backgroundColor: '#ff9900',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var nat_gateway_enabled = false;
var flavourText
var solutionText

// Components
var ec2, vpc, public_subnet, private_subnet, nat_gateway_toggle

function preload() {
  this.load.image('vpc',         'assets/vpc.png');
  this.load.image('pub_subnet',  'assets/pub_subnet.png');
  this.load.image('priv_subnet', 'assets/priv_subnet.png');
  this.load.image('nat_gw',      'assets/nat.png');

  // Spritesheets
  this.load.spritesheet('ec2', 
    'assets/ec2.png', {
      frameWidth: 300,
      frameHeight: 300
    }
  );
}


/*
 *  Create the world!
 */

function create() {

  createVPC(this);
  createEC2(this);

  flavourText = this.add.text(20, 350, "", { fontSize: '32px', fill: '#232f3e' });
  solutionText = this.add.text(20, 400, "", { fontSize: '16px', fill: '#232f3e' });
}

function createVPC(scene) {
  vpc = scene.add.sprite(418.8, 179.6, 'vpc');
  vpc.setScale(.8);
  vpc.setInteractive();
  registerFlavourtext(vpc, "Virtual Private Cloud (VPC)");
  
  createPublicSubnet(scene);

  private_subnet = scene.add.sprite(528.8, 254.6, 'priv_subnet');
  private_subnet.setScale(.8);
  private_subnet.setInteractive();
  registerFlavourtext(private_subnet, "Private Subnet");
}

function createPublicSubnet(scene) {
  bg = scene.add.image(0, 0, 'pub_subnet');
  nat_gateway_toggle = createNATGatewayToggle(scene);

  public_subnet = scene.add.container(528.8, 104.6, [bg, nat_gateway_toggle])
  public_subnet.setSize(bg.width, bg.height);
  public_subnet.setScale(0.8)

  public_subnet.setInteractive()
  registerFlavourtext(public_subnet, "Public Subnet");
}

function createNATGatewayToggle(scene) {
  toggle = scene.add.image(275, 0, 'nat_gw');

  // make toggle interactive
  // where did 40 come from? Good question! I think it's the height/width of
  // the toggle image?
  toggle.setInteractive({
    hitArea:         new Phaser.Geom.Circle(40, 40, 40),
    hitAreaCallback: Phaser.Geom.Circle.Contains,
    useHandCursor:   true
  });

  toggle.on('pointerup', function() {
    toggleNatGateway();
  });

  registerFlavourtext(toggle, "NAT Gateway");

  return toggle;
}

function createEC2(scene) {
  ec2 = scene.add.sprite(418.8, 254.6, 'ec2');
  ec2.setScale(0.3);

  // Drag hitbox
  ec2.setInteractive({
    hitArea:         new Phaser.Geom.Rectangle(0, 0, 300, 300),
    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    useHandCursor:   true,
    draggable:       true
  });

  ec2.on('drag', function(pointer, dragX, dragY) {
    this.x = dragX;
    this.y = dragY;
  });

  registerFlavourtext(ec2, "EC2 (Compute Instance)");

  // ec2 animations
  scene.anims.create({
    key: 'happy',
    frames: [ { key: 'ec2', frame: 0} ],
  });

  scene.anims.create({
    key: 'sad',
    frames: [{ key: 'ec2', frame: 1}],
  });
}


/*
 *  Update the world!
 */

function update() {
  if (text = has_connectivity() ) {
    ec2.anims.play('happy');
    solutionText.setText(text);
  }
  else {
    ec2.anims.play('sad');
    solutionText.setText("");
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

  var solution = ""

  if (in_public_subnet) {
    solution = "Hooray 🎉 Instances in public subnets can send traffic to the internet"
  }
  else if (private_subnet_with_gateway) {
    solution = "Hooray 🎉 Instances in private subnets can send traffic to the interent using a\nNetwork Address Translation (NAT) Gateway that resides in the public subnet"
  }

  return solution
}


/*
 *  Helpers
 */

function toggleNatGateway() {
  nat_gateway_enabled = !nat_gateway_enabled
}

function registerFlavourtext(component, text) {
  component.on('pointerover', function () {
    flavourText.setText(text);
  });
  component.on('pointerout', function () {
    flavourText.setText("");
  });
}