// Load in bg music and sfx   
var mus = new Audio("aud/fruit_drop_short_LQ.wav"); 
mus.preload = "auto";
mus.loop = true;
var fruitcatch = new Audio("aud/fruit_catch_2.wav");
fruitcatch.preload = "auto";
var lifecatch = new Audio("aud/life_catch.wav");
lifecatch.preload = "auto";
var gameoverfx = new Audio("aud/game_over.wav");
gameoverfx.preload = "auto";
var gameoverflourish = new Audio("aud/fruit_drop_flourish_2.wav");
gameoverflourish.preload = "auto";

// Only get html elements once, and save vars globally - to save repetition/memory
var canvas = document.getElementById("gameCanvas");
var h2 = document.getElementsByTagName("h2")[0];

// AUDIO //
var soundon = true;
var sound = document.getElementById("sound");
sound.addEventListener('click', function () {
    if (soundon === true) {
        sound.innerHTML = "Sound Off";
        mus.muted = true;
        fruitcatch.muted = true;
        lifecatch.muted = true;
        gameoverfx.muted = true;
        gameoverflourish.muted = true;
        soundon = false;
    }
    else {
        sound.innerHTML = "Sound On";
        mus.muted = false;
        fruitcatch.muted = false;
        lifecatch.muted = false;
        gameoverfx.muted = false;
        gameoverflourish.muted = false;
        soundon = true;
    }
});

// KEYBOARD CONTROLS//
var keyPressed = {};

addEventListener("keydown", function (e) {
    keyPressed[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keyPressed[e.keyCode];
}, false);

// --------------- OBJECTS --------------- //

function Paddle(x, y) {
    this.x = x;
    this.y = y;
    this.width = canvas.width * 0.125;    
    this.height = canvas.height * 0.025;
    this.score = 0;
}

function Faller(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.acc = 0.3; 
    this.width = canvas.width / 60;
    this.height = canvas.width / 60;
}

function ExtraLife(x, y, scol) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.acc = 0.2; 
    this.width = canvas.width / 60;
    this.height = canvas.width/  60;   
}

function Disp(x, y) {
    this.x = x;
    this.y = y;
    this.val = "Score: 0";
}

Disp.prototype.draw = function (s) {
    s.fillText(this.val, this.x, this.y);
};

// GAME FUNCTION //

function Game() {
    
    this.width = canvas.width;
    this.height = canvas.height;

    // these next 2 lines get the context of the canvas //
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "black";
    this.context.font = "6pt 'Press Start 2P'";

    // create player
    this.player = new Paddle(this.width/2, 0);
    this.player.x = this.width/2 - this.player.width/2;
    this.player.y = this.height - this.player.height*5.75;
    this.player.speed = 5.75;

    // create method for drawing the paddle/basket
    this.player.draw = function (p) {

        var basketImage = new Image();
        basketImage.src = "img/basket.png";
    canvas.getContext("2d").drawImage(basketImage,this.x,this.y,this.width*1.6,this.height*8);
    };

    //create ball
    this.ball = new Faller(0,0);
    this.ball.x = Math.floor(Math.random() * ((canvas.width-(this.player.width/2)) - this.player.width/2)) + this.player.width/2;
    this.ball.y = 0;
    this.ball.acc = 1.75; //

    this.ball.draw = function () {
    
        var pinkImage = new Image();
        pinkImage.src = "img/pink8bit.png";
    canvas.getContext("2d").drawImage(pinkImage,this.x,this.y,this.width*3.23,this.height*3.23); // 3.23 SEEMS TO BE THE MAGIC NUMBER REGARDING COLLISION DETECTION AND PADDLE SPRITE SIZE
    };

    //create ball2
    this.ball2 = new Faller(0,0);
    this.ball2.x = Math.floor(Math.random() * ((canvas.width-(this.player.width/2)) - this.player.width/2)) + this.player.width/2;
    this.ball2.y = 0;
    this.ball2.acc = 1.75;

    this.ball2.draw = function () {
   
        var pinkImage = new Image();
        pinkImage.src = "img/pink8bit.png";
        canvas.getContext("2d").drawImage(pinkImage,this.x,this.y,this.width*3.23,this.height*3.23);
    };

    //create falling life
    this.xlife = new ExtraLife(0,0,"gold");
    this.xlife.x = Math.floor(Math.random() * ((canvas.width-(this.player.width/2)) - this.player.width/2)) + this.player.width/2;
    this.xlife.y = -this.xlife.height*4;
    this.xlife.acc = 1.35; 

    this.xlife.draw = function () {
        var goldImage = new Image();
        goldImage.src = "img/gold8bit.png";
        canvas.getContext("2d").drawImage(goldImage,this.x,this.y,this.width*3.23,this.height*3.23);
    };

    //create falling baddie
    this.baddie = new ExtraLife(0,0,"brown");
    this.baddie.x = Math.floor(Math.random() * ((canvas.width-(this.player.width/2)) - this.player.width/2)) + this.player.width/2;
    this.baddie.y = -this.baddie.height*4;
    this.baddie.acc = 1.4; // falls bit quicker than a life

    this.baddie.draw = function () {
        
        var brownImage = new Image();
        brownImage.src = "img/brown8bit.png";
        canvas.getContext("2d").drawImage(brownImage,this.x,this.y,this.width*3.23,this.height*3.23);
    };

    // create scoreboard
    this.scoreboard = new Disp(this.width/50, this.height/10);

    // create livesboard
    this.livesboard = new Disp(this.width-(this.width/4.4),this.height/10);
    this.livesboard.val = "Lives: "+ 3; //initial lives num

}

// GAME DRAWING METHOD //
Game.prototype.draw = function () {
    
    this.context.clearRect(0, 0, this.width, this.height);
    this.player.draw(this.context);
    this.ball.draw(this.context);
    this.xlife.draw(this.context);
    this.baddie.draw(this.context);

    if (totalTimer >= 2000) {
        this.ball2.draw(this.context);
    }
    
    this.scoreboard.draw(this.context);
    this.livesboard.draw(this.context);
};

// WHEN IT'S GAMEOVER //
Game.prototype.gameover = function () {

    // pause and reset music, play relevant sfx
    mus.pause();
    mus.currentTime = 0;
    gameoverfx.play();
    gameoverflourish.play();
    
    // Update the final scoreboard
    this.scoreboard.x = canvas.width/8;
    this.scoreboard.y = canvas.height/2;
    this.scoreboard.val = "Game Over! Your score is: " + score + '!';
    this.context.clearRect(0, 0, this.width, this.height);
    this.scoreboard.draw(this.context);

    // hide the 'playing' button
    button.setAttribute("style","display:none;");

    //remove play again button if there's one there
    h2.removeChild(h2.lastChild);

    // New Play Again Button
    var button2 = document.createElement("button");

    h2.appendChild(button2);
    button2.innerHTML = "Game Over...";
    button2.setAttribute("style", "display: block; margin-bottom: -1.1em !important; width: 20%; height: auto; margin-left:0; margin-top: 2.5em !important; text-align: center;font-size: .65em;font-family: 'Press Start 2P'; border-radius: 2%; padding: .5em; color: #e5e5e5; background:#b2b2b2; border-color: #7f7f7f;");
    button2.disabled = true; // don't make it clickable yet

    button2.addEventListener ('click',function() {
        document.getElementById('gameCanvas').style.display = 'block';

        // reset all in-game variables
        timeElapsed = 0;
        timeElapsed2 = 0;
        timeElapsed3 = 0;
        timeElapsed4 = 0
        totalTimer = 0;
        score = 0;
        lives = 3;
        lifefalling = false;
        countframe = 0; // used in the falling life algorithm
        countframe2 = 0;
        badrand = Math.floor(Math.random() * 100) + 1; //chance of life dropping
        badfalling = false;
        
        // reset the game
        game = new Game();

        main();
        button2.innerHTML = "Playing..."
        button2.disabled = true; // can't click in while playing
        mus.play();
    }); 

    gameoverflourish.addEventListener("ended", function(){
        
        gameoverflourish.currentTime = 0;
        button2.innerHTML = "Play Again?"
        button2.setAttribute("style", "display: block; margin-bottom: -1.1em !important; width: 20%; height: auto; margin-left:0; margin-top: 2.5em !important; text-align: center;font-size: .65em;font-family: 'Press Start 2P'; border-radius: 2%; padding: .5em; color: pink; background: green; border-color: pink;")
        button2.disabled = false; // you have to listen to the whole duration of the game over flourish before playing again
    }); 

};

// define all timers and inital scores
var timeElapsed = 0;
var timeElapsed2 = 0;
var timeElapsed3 = 0;
var timeElapsed4 = 0;
var totalTimer = 0;
var score = 0;
var lives = 3;
var liferand = Math.floor(Math.random() * 100) + 1; //chance of life dropping
var lifefalling = false;
var countframe = 0; // used in the falling life algorithm
var countframe2 = 0;
var badrand = Math.floor(Math.random() * 100) + 1; //chance of life dropping
var badfalling = false;

// --- UPDATING THE GAME! --- //
Game.prototype.update = function () {

    if (37 in keyPressed) { // Player holding left
        this.player.x -= this.player.speed;
    }

    if (39 in keyPressed) { // Player holding right
        this.player.x += this.player.speed;
    }

    // pushes paddle back if its hits the wall //
    if (this.player.x <= 0) {
        this.player.x =+ this.player.width/10;
    }

    if (this.player.x >= canvas.width-this.player.width) {
        this.player.x = canvas.width-this.player.width*1.1;
    }

    totalTimer ++;

    // increase the acceleration
    this.ball.acc += 0.00008;
    this.ball2.acc += 0.00008;
    this.xlife.acc += 0.000064;
    this.baddie.acc += 0.000064;

    //BALL 1:

    timeElapsed ++;

    if (this.ball.y >= canvas.height) {
        this.ball.y = -this.ball.height;
        timeElapsed = 0;

        this.ball.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

        // if ball is too far from paddle (30% of canvas width away), reset ball
        while (Math.abs(this.ball.x-this.player.x) > 0.3*canvas.width) {
            this.ball.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
        }

        lives = lives - 1;
        this.livesboard.val = "Lives: " + lives;
        liferand = Math.floor(Math.random() * 100) + 1;

    }

    // COLLISION DETECTION //
    else if (this.ball.y+this.ball.height >= this.player.y && this.ball.x >= this.player.x && this.ball.x+this.ball.width <= this.player.x+this.player.width*1.4) {
        fruitcatch.play();
        this.ball.y = -this.ball.height;
        timeElapsed = 0;

        this.ball.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

        // if ball is too far from paddle (35% of canvas width away), reset ball
        while (Math.abs(this.ball.x-this.player.x) > 0.35*canvas.width) {
            this.ball.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
        } 

        score = score + 1;
        this.scoreboard.val = "Score: " + score;
        liferand = Math.floor(Math.random() * 100) + 1;

    }
    else {
        this.ball.y = this.ball.y + this.ball.acc*(timeElapsed/22);
    }

    //BALL 2:  

    // 2nd ball comes into play only after 2000 frames
    if (totalTimer >= 2000) {

        /* ATTEMPTS TO STOP BALLS FROM BEING TOO CLOSE IN Y DIRECTION*/
        if (Math.abs(this.ball2.y-this.ball.y) < (canvas.height/2)) {
            if (this.ball2.y < this.ball.y && this.ball.y < canvas.height/8) {

                timeElapsed2 =0;
                this.ball2.y = -this.ball2.height; 

            }
            else if (this.ball2.y > this.ball.y && this.ball2.y < canvas.height/8) {
                timeElapsed =0;
                this.ball.y = -this.ball2.height;          
            }
        }

        timeElapsed2 ++;

        if (this.ball2.y >= canvas.height) {
            
            this.ball2.y = -this.ball2.height - canvas.height;
            timeElapsed2 = 0;
            this.ball2.x = Math.floor(Math.random() * ((canvas.width-(this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

            // if ball is too far from paddle (35% of canvas width away) or balls are too far apart, reset ball
            while (Math.abs(this.ball2.x-this.player.x) > 0.35*canvas.width || Math.abs(this.ball2.x-this.ball.x) > 0.4*canvas.width){
                this.ball2.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
            }

            lives = lives - 1;
            this.livesboard.val = "Lives: " + lives;
            liferand = Math.floor(Math.random() * 100) + 1;
        }
        // COLLISION DETECTION //
        else if (this.ball2.y+this.ball2.height >= this.player.y && this.ball2.x >= this.player.x && this.ball2.x+this.ball2.width <= this.player.x+this.player.width*1.4) {
            this.ball2.y = -this.ball2.height - canvas.height;//this.ball2.height; 
            fruitcatch.play();
            timeElapsed2 = 0;
            this.ball2.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

        // if ball is too far from paddle (35% of canvas width away) or balls are too far apart, reset ball
        while (Math.abs(this.ball2.x-this.player.x) > 0.35*canvas.width || Math.abs(this.ball2.x-this.ball.x) > 0.4*canvas.width){
            this.ball2.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
        }     

        score = score + 1;
        this.scoreboard.val = "Score: " + score;
        liferand = Math.floor(Math.random() * 100) + 1;

        }
        else if (this.ball2.y >= -9 && this.ball2.y <= -1) {
            timeElapsed2 = 0;
            this.ball2.y = 0;
        }
        else {
            this.ball2.y = this.ball2.y + this.ball2.acc*(timeElapsed2/22);  

        }    
    }
   
    //FALLING LIVES:

    // Determining the frequency of falling lives
    if (totalTimer <= countframe + 1500) {
        liferand = 11;
        lifefalling = false;
    }

    if (lifefalling != true) {

        // 17.5 seems adequately infrequent probabilty
        if (liferand <= 17.5) {
            lifefalling = true;    
        }
        else {
            lifefalling = false;
        }
    }
    else {  

        timeElapsed3 ++;

        if (this.xlife.y >= canvas.height) {

            this.xlife.y = -this.xlife.height*4;

            timeElapsed3 = 0;

            this.xlife.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

        // if ball is too far from paddle (41% of canvas width away), reset ball
        while (Math.abs(this.xlife.x-this.player.x) > 0.41*canvas.width) {
            this.xlife.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
        }

        lifefalling = false;
        countframe = totalTimer;
    }
    // COLLISION DETECTION //
    else if (this.xlife.y+this.xlife.height >= this.player.y && this.xlife.x >= this.player.x && this.xlife.x+this.xlife.width <= this.player.x+this.player.width*3.23) {
        this.xlife.y = -this.xlife.height*4;
        lifecatch.play();
        timeElapsed3 = 0;

        this.xlife.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

        // if ball is too far from paddle (41% of canvas width away), reset ball
        while (Math.abs(this.xlife.x-this.player.x) > 0.41*canvas.width) {
            this.xlife.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
        }  
        lives = lives + 1;
        this.livesboard.val = "Lives: " + lives;

        lifefalling = false;
        countframe = totalTimer;


    }
    else {

        this.xlife.y = this.xlife.y + this.xlife.acc*(timeElapsed3/22);
    }
    }  

    //FALLING BADDIES:
    
    // Determing the frequency of falling baddies
    if (totalTimer <= countframe2 + 180) {
        badrand = 11;
        badfalling = false;
    }

    if (badfalling != true) {

        // Set to 100% here - can lower probabilty
        if (badrand <= 100) {
            badfalling = true;    
        }
        else {
            badfalling = false;
        }
    }
    else {  

        timeElapsed4 ++;

        if (this.baddie.y >= canvas.height) {

            this.baddie.y = -this.baddie.height*4;
            timeElapsed4 = 0;

            this.baddie.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

        // if ball is too far from paddle (41% of canvas width away), reset ball
        while (Math.abs(this.baddie.x-this.player.x) > 0.41*canvas.width) {
            this.baddie.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
        }

        badfalling = false;
        countframe2 = totalTimer;
    }
    // COLLISION DETECTION //
    else if (this.baddie.y+this.baddie.height >= this.player.y && this.baddie.x >= this.player.x && this.baddie.x+this.baddie.width <= this.player.x+this.player.width) {
        this.baddie.y = -this.baddie.height*4;
        timeElapsed4 = 0;

        this.baddie.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;

        // if ball is too far from paddle (41% of canvas width away), reset ball
        while (Math.abs(this.baddie.x-this.player.x) > 0.41*canvas.width) {
            this.baddie.x = Math.floor(Math.random() * ((canvas.width-(3.23*this.player.width/2)) - 3.23*this.player.width/2)) + 3.23*this.player.width/2;
        }  
        lives = 0;
        this.livesboard.val = "Lives: " + lives;

        badfalling = false;
        countframe2 = totalTimer;


    }
    else {

        this.baddie.y = this.baddie.y + this.baddie.acc*(timeElapsed4/22);
    }
    }
    // --- END OF UPDATE LOOP --- //   
}; 

// --- SETUP THE MAIN GAME LOOP --------//
var game = new Game();
function main() {

    if (lives != 0) {
        requestAnimationFrame(main)     
        //game begins
        game.update();
        game.draw();
    }
    else {
        game.gameover();
    }
}

// Let everything load first before making buttons clickable etc? //
window.onload = function() {

    // Begin the game execution on button click
    var button = document.getElementById('button');
    button.setAttribute("style", "border-color: pink");

    var oneclick = true; // has the button been clicked once?

    button.addEventListener ('click',function() {
        if (oneclick === true) {  
            oneclick = false;
            main();
            button.innerHTML = "Playing...";
            mus.play();
         }
     }); 

};  
