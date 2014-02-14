var pipeObject = function(){;
	this.leftNow;
	this.topNow1;
	this.topNow2;
};

var flappyBird = function(){
	//画布属性设定
	this.canvasWidth;
	this.canvasHeight;
	this.canvas = document.getElementById("game");
	this.canvasObj = this.canvas.getContext("2d");
	//图片对象
	this.birdImg = new Array(3);
	this.cityImg;
	this.treesImg;
	this.pipeImg = new Array(2);
	this.groundImg;
	//图片大小
	this.birdImgWidth = 85;
	this.birdImgHeight = 60;
	this.cityImgWidth = 300;
	this.cityImgHeight = 256;
	this.groundImgSize = 48;
	this.pipeImgWidth = 100;
	this.pipeImgHeight = 1664;
	this.treesImgWidth = 300;
	this.treesImgHeight = 216;
	this.screenWidth;
	this.screenHeight;
	this.canvasLeft;
	this.groundMoveLeft = 48;
	this.pipemoveLeft;
	//图片位置
	this.cityImgTop;
	this.treesImgTop;
	this.groundImgTop;
	this.pipeImgTop;
	this.birdLeft;
	//判断是否改变长度
	this.hasChangeWH = false;
	this.hasChangePos = false;
	this.hasSetCanvasSize = false;
	this.hasChangePipe = false;
	//pipe
	this.disBetweenPipes = 230;
	this.disBetweenPipeAndTop = 100;
	this.pipeMoveDis;
	this.pipeNum;
	this.pipeDis = 300;
	this.pipeObj = new Array(20);
	//other
	this.loopTime;
	this.lastPipe;
	this.bird;
	this.score;
	this.passPipeNum;
	this.scoreCount = 5;
	this.canStart = false;
	this.gameStart = false;
	//function!!
	this.init = function(){
		this.changeWH();
		this.setCanvasSize();
		this.changePos();
		this.setPipe();
		this.getImg();
		this.score = 0;
		this.passPipeNum = -1;
		this.setScore();
		var obj = this;
		this.bird = new function (){
			this.imgNum = 0;
			this.Vy = 8;
			this.VyNow = 8;
			this.gravity  = 0.3;
			this.time = 0;
			this.y = (obj.screenHeight - obj.groundImgSize)/2;
			this.yNow = this.y;
			this.count = 2;


			this.changeImgNum = function(){		
				if(this.count<0){
					if(this.imgNum == 2){
						this.imgNum = 0;
					}
					else{
						++this.imgNum;
					};
					this.count = 2;
				}	
				else{
					--this.count;
				}	
				
			};

			this.birdMove = function(){
				this.yNow = this.y - this.Vy*this.time + 0.5*this.gravity*this.time*this.time;
			};
			this.ini = function(){
				this.time = 0;
				this.y = this.yNow;
			};
			this.birdFly = function(){
				if(hasYell()){
					this.ini();
				}
				++this.time;
				this.changeImgNum();
				this.birdMove();
			};
		};
	};

	this.change = function(){
		this.changeWH();
		this.setCanvasSize();
		this.changePos();
		this.changePipe();
	};

	this.draw = function(){
		this.clearCanvas();
		this.drawStaticBg();
		this.drawMoveBg();
		if(!this.gameOverJudge()){
			console.log(this.gameStart);
			this.flashStop();
			this.gameStart = false;
			this.canStart = false;
			document.getElementsByClassName("gameOver")[0].style.display = "inline-block";
		}
	};

	this.flash = function(){
		var obj = this;
		if(this.hasChangePos&&this.hasChangeWH&&this.hasSetCanvasSize&&this.hasChangePipe){
			this.loopTime = setInterval(function(){
								obj.draw();
							},30);
			this.setZero();
		}
		else{
			this.change();
			this.loopTime = setInterval(function(){
								obj.draw();
							},30);
			this.setZero();
		}
	};

	this.flashStop = function(){
		clearInterval(this.loopTime); 
	};
	this.drawStaticBg = function(){
		var leftNow = this.canvasLeft;
		while(leftNow < this.canvasWidth){
			this.canvasObj.drawImage(this.cityImg,leftNow,this.cityImgTop,this.cityImgWidth,this.cityImgHeight);
			this.canvasObj.drawImage(this.treesImg,leftNow,this.treesImgTop,this.treesImgWidth,this.treesImgHeight);
			leftNow += this.cityImgWidth;
		};
		
	};

	this.drawMoveBg = function(){
		if(this.canStart){
			if(this.gameStart){
				this.bird.birdFly();
				for(var i = 0;i<this.pipeNum;++i){
					this.pipeObj[i].leftNow -= 6;
					this.canvasObj.drawImage(this.pipeImg[0],this.pipeObj[i].leftNow,this.pipeObj[i].topNow1,this.pipeImgWidth,this.pipeImgHeight);
					this.canvasObj.drawImage(this.pipeImg[1],this.pipeObj[i].leftNow,this.pipeObj[i].topNow2,this.pipeImgWidth,this.pipeImgHeight);
				};

				for(var i = 0 ; i<this.pipeNum;++i){
					if(this.pipeObj[i].leftNow<this.canvasLeft){
						this.lastPipe = i;
						this.setPipeTop(i);
						switch(i){
							case 0:this.pipeObj[0].leftNow = this.pipeObj[this.pipeNum-1].leftNow + (this.pipeDis+this.pipeImgWidth);break;
							default:this.pipeObj[i].leftNow = this.pipeObj[i-1].leftNow + (this.pipeDis+this.pipeImgWidth);break;
						};
						break;
					};
				};	
			}
			else if(hasYell()){
				this.gameStart = true;
			}

			var groundLeftNow = this.canvasLeft + this.groundMoveLeft;
			while(groundLeftNow < this.canvasWidth){
				this.canvasObj.drawImage(this.groundImg,groundLeftNow,this.groundImgTop,this.groundImgSize,this.groundImgSize);
				groundLeftNow += this.groundImgSize;
			};
			if(this.groundMoveLeft > 6){
				this.groundMoveLeft -= 6;
			}
			else{
				this.groundMoveLeft = 48;
			};

			this.canvasObj.drawImage(this.birdImg[this.bird.imgNum],this.birdLeft,this.bird.yNow,this.birdImgWidth,this.birdImgHeight);
		}
		else{
			var groundLeftNow = this.canvasLeft + this.groundMoveLeft;
			while(groundLeftNow < this.canvasWidth){
				this.canvasObj.drawImage(this.groundImg,groundLeftNow,this.groundImgTop,this.groundImgSize,this.groundImgSize);
				groundLeftNow += this.groundImgSize;
			};
		}
		
	};

	this.clearCanvas = function(){
		this.canvasObj.clearRect(0,0,this.canvasWidth,this.canvasHeight);
	};

	this.getImg = function(){
		for(var i = 0;i <3; ++i){
			this.birdImg[i] = new Image();
			this.birdImg[i].src = "./static/img/bird" + (i+1) +".png";
		}

		this.cityImg = new Image();
		this.cityImg.src = './static/img/city.png';

		this.groundImg = new Image();
		this.groundImg.src = './static/img/ground.png';

		this.treesImg = new Image();
		this.treesImg.src = './static/img/trees.png';

		this.pipeImg[0] = new Image();
		this.pipeImg[0].src = './static/img/pipe1.png';

		this.pipeImg[1] = new Image();
		this.pipeImg[1].src = './static/img/pipe2.png';

	};

	this.changeWH = function(){
		this.canvasWidth = parseFloat(window.getComputedStyle(document.getElementById("game"),false).width);
		this.canvasHeight = parseFloat(window.getComputedStyle(document.getElementById("game"),false).height) - 100;
		this.screenWidth = parseFloat(document.body.clientWidth);
		this.screenHeight = parseFloat(document.body.clientHeight);
		this.hasChangeWH = true;
	};

	this.changePos = function(){
		this.cityImgTop = this.canvasHeight - this.groundImgSize - this.cityImgHeight;
		this.treesImgTop = this.canvasHeight - this.groundImgSize - this.treesImgHeight;
		this.groundImgTop = this.canvasHeight - this.groundImgSize;
		this.pipeMoveDis = this.canvasHeight - this.groundImgSize - this.disBetweenPipes - this.disBetweenPipeAndTop*2;
		this.canvasLeft = (this.canvasWidth - 300 - this.screenWidth)/2.0;
		this.birdLeft = this.canvasWidth/2  - this.screenWidth*0.25;
		this.hasChangePos = true;
	};

	this.changePipe = function(){
		var num = parseInt((this.screenWidth - this.pipeDis)/(this.pipeDis + this.pipeImgWidth)) +2;
		console.log(num,this.pipeNum);
		if(num>this.pipeNum){
			var count = 0;
			this.setPipeLeftbyOrder();
			for(var i = this.pipeNum;i<num;++i,++count){
				this.pipeObj[i] = {};
				this.pipeObj[i].leftNow = this.pipeObj[this.lastPipe] + (this.pipeDis + this.pipeImgWidth)*count;
				this.setPipeTop(i);
			};
			this.pipeNum = num;
			this.lastPipe = this.pipeNum-1;
		}
		else if(num<this.pipeNum){
			this.setPipeLeftbyOrder();
			this.pipeNum = num;
			this.lastPipe = this.pipeNum-1;
		};
		this.hasChangePipe = true;
	};

	this.setCanvasSize = function(){
		this.canvas.width = String(this.canvasWidth);
		this.canvas.height = String(this.canvasHeight);
		this.hasSetCanvasSize = true;
	};

	this.setZero = function(){
		this.hasChangeWH = false;
		this.hasChangePos = false;
		this.hasSetCanvasSize = false;
		this.hasChangePipe = false;
	};

	this.setPipe = function(){
		this.pipeNum = parseInt((this.screenWidth - this.pipeDis)/(this.pipeDis + this.pipeImgWidth)) +2;
		this.lastPipe = this.pipeNum -1;
		//this.pipeObj = new Array(this.pipeNum);
		var leftDis = this.screenWidth * 1.1;
		for(var i = 0;i<this.pipeNum;++i){
			this.pipeObj[i] = {};
			this.pipeObj[i].leftNow = leftDis + (this.pipeDis + this.pipeImgWidth)*i;
			this.setPipeTop(i);
		};
	};

	this.setPipeTop = function(i){
		var top1 = Math.random()*this.pipeMoveDis +this.disBetweenPipeAndTop - this.pipeImgHeight;
		var top2 = top1 + this.pipeImgHeight + this.disBetweenPipes;
		this.pipeObj[i].topNow1 = top1;
		this.pipeObj[i].topNow2 = top2; 
	};

	this.setScore = function(){
		document.getElementsByClassName("score")[0].innerHTML = this.score;
	};

	this.setPipeLeftbyOrder = function(){
		var order = new Array(20);
		//console.log(this.pipeObj,this.lastPipe)
		var count = 1;
		for (var i = 0;i<this.pipeNum;++i){
			if((this.lastPipe - i)>=0){
				order[i] = this.pipeObj[this.lastPipe - i].leftNow;
			}
			else{
				order[i] = this.pipeObj[this.pipeNum - count].leftNow;
				++count;
			};
		};
		for(var i = 0;i<this.pipeNum;++i){
			this.pipeObj[i].leftNow = order[this.pipeNum - i -1];
		};
	};

	this.gameOverJudge = function(){
		if(this.bird.yNow > (this.canvasHeight - this.groundImgSize -this.birdImgHeight)){
			return false;
		}
		else{
			for(var i = 0 ; i<this.pipeNum ; ++i){
				if(this.pipeObj[i].leftNow<(this.birdLeft+this.birdImgWidth - 10)
					&&this.pipeObj[i].leftNow>(this.birdLeft-this.pipeImgWidth+15)){
					if(this.passPipeNum !== i){
						if(this.scoreCount<0){
							++this.score;
							this.scoreCount = 5;
							this.passPipeNum = i;
							this.setScore();
						}
						else{
							--this.scoreCount;
						}
						
					}
					if(this.bird.yNow<(this.pipeObj[i].topNow2-this.disBetweenPipes-7)
						||this.bird.yNow>(this.pipeObj[i].topNow2-this.birdImgHeight)){
						return false;

					}
					break;
				}
				else{
					continue;
				};
			}
		};
		return	true;
	};
};

var game = new flappyBird();

window.onload = function(){
	game.init();
	game.flash();
	
}

window.onresize = function(){
		game.flashStop();
		game.change();
		game.flash();
}

document.getElementsByClassName("startButton")[0].onclick = function(){
	if(hasListen){
		game.flashStop();
		game.canStart = true;
		game.flash();
		document.getElementsByClassName("startButton")[0].style.display = "none";
	};
};

document.getElementsByClassName("restartButton")[0].onclick = function(){
	game.init();
	game.draw();
	game.canStart = true;
	game.flash();
	document.getElementsByClassName("gameOver")[0].style.display = "none";
};

