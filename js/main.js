window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('street', 'assets/street.jpg');
    game.load.image('cash', 'assets/cash.jpg');
    game.load.image('lotto', 'assets/lotto.png');
    game.load.spritesheet('guy', 'assets/guyinsuit.png', 30, 32);
    game.load.audio('pickup', 'assets/pickup.mp3');
    game.load.audio('dying', 'assets/dying.mp3');
    game.load.image('enemy', 'assets/leprechaun.png');
}

var player;
var platforms;
var cursors;

var lottos;
var score = 0;
var pickup;
var enemy1; 
var enemy2;
var enemy3;
var dying; 
var scoretext;
    
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2000, 1200);
    var street = game.add.sprite(0,0, 'street');
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'cash');
    ground.scale.setTo(10, 2);

    ground.body.immovable = true;

    var ledge = platforms.create(400, 1000, 'cash');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 850, 'cash');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1000, 900, 'cash');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1100,700, 'cash');
    ledge.body.immovable = true;
    
    ledge = platforms.create(1700,950, 'cash');
    ledge.body.immovable = true;
 
    player = game.add.sprite(32, game.world.height - 150, 'guy');
    enemy1 = game.add.sprite(1500, game.world.height - 97, 'enemy');
    enemy2 = game.add.sprite(30, 816, 'enemy');
    enemy3 = game.add.sprite(1050, 870, 'enemy');

    game.physics.arcade.enable(player);
    game.physics.arcade.enable(enemy1);
    game.physics.arcade.enable(enemy2);
    game.physics.arcade.enable(enemy3);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    enemy1.body.collideWorldBounds = true;
    enemy2.body.collideWorldBounds = true;
    enemy3.body.collideWorldBounds = true;

    player.animations.add('left', [3, 4, 5], 13, true);
    player.animations.add('right', [6, 7, 8], 13, true);

    lottos = game.add.group();

    lottos.enableBody = true;

    for (var i = 0; i < 1; i++)
    {
        var lotto = lottos.create(i * 165, 0, 'lotto');

        lotto.body.gravity.y = 300;
    }

    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
    pickup = game.add.audio('pickup');
    dying = game.add.audio('dying');
    game.time.events.add(Phaser.Timer.SECOND * 60, gameover, this);
    scoretext = game.add.text(10, 10, 'Score: ' + score, { font: '20px Arial', fill: 'Black' });
}

function update() {

    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(lottos, platforms);

    game.physics.arcade.overlap(player, lottos, collectQs, null, this);
    game.physics.arcade.overlap(player, enemy1, Enemy1HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy2, Enemy2HitPlayer, null, this);
    game.physics.arcade.overlap(player, enemy3, Enemy3HitPlayer, null, this);
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 0;
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}

function collectQs (player, lotto) {
    lotto.kill();
    pickup.play();
    score += Math.random()*10;
    scoretext.text = 'Score: ' + parseInt(score);
    lotto = lottos.create(Math.random()*2000, 0, 'lotto');
    lotto.body.gravity.y = 300;
}
function Enemy1HitPlayer(player,enemy1)
    {
        player.kill();
        dying.play();
        game.add.text(enemy1.x-50, enemy1.y-100, 'Game Over, Your score is '+score, {        fontSize: '32px',    fill: 'white' });
    }
function Enemy2HitPlayer(player,enemy2)
    {
        player.kill();
        dying.play();
        game.add.text(enemy2.x, enemy2.y, 'Game Over, Your score is '+parseInt(score), {        fontSize: '32px',    fill: 'white' }); 
     
    }
function Enemy3HitPlayer(player,enemy3)
    {
        player.kill();
        dying.play();
        game.add.text(enemy3.x, enemy3.y, 'Game Over, Your score is '+parseInt(score), {        fontSize: '32px',    fill: 'white' });
        
    }
    function gameover()
    {
        game.add.text(player.x, player.y, 'Game Over, Your score is '+parseInt(score) , {        fontSize: '32px',    fill: 'white' });
        player.kill();
        dying.play();
    }
};