var Nature = Nature || {
	VERSION : "1.1.0"
};

(function () {
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                callback();
            };
    }());
    
    window.cancelAnimationFrame = (function () {
        return window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function () {
            };
    }());
    
	Nature = function (functions ,width, height) {
        this.Tool = new Nature.Tool();
        this.Space = new Nature.Space(functions);
        this.Space.init(width, height);  
        this.Space.update()
        this.Space.run();
    };

    Nature.Space = function(functions){
        Space = this;
        this.Physic = new Nature.Space.Physic();
        window.addEventListener("keydown", this.onKeyDown.bind(this), false);
        window.addEventListener("keyup", this.onKeyUp.bind(this), false);
        window.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        window.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        window.addEventListener("touchstart", this.onTouchStart.bind(this), false);
        window.addEventListener("touchmove", this.onTouchMove.bind(this), false);
        window.addEventListener("touchend", this.onTouchEnd.bind(this), false);
        this.load = functions.preload;
        this.create = functions.create;
        this.update = functions.userUpdate;
        this.gameUpdate = functions.gameUpdate;
        this.renderListUpdate = functions.render;
        this.load();
        this.loading();
        this.create();
    };
    
    // -----key manager-----
    
    Nature.Space.prototype.keyboardState = new Array(); 
    Nature.Space.prototype.touchstart=false;
    Nature.Space.prototype.touching=false;
    Nature.Space.prototype.touchEnd=false;
	Nature.Space.prototype.touchMove=false;
	Nature.Space.prototype.mousetype='none';
    Nature.Space.prototype.onKeyDown = function (e) {
        if(this.keyboardState[e.keyCode] == 'start') this.keyboardState[e.keyCode] = 'pressed';
		else if (this.keyboardState[e.keyCode] == 'pressed') this.keyboardState[e.keyCode] = 'pressed';
		else if (this.keyboardState[e.keyCode] == 'none') this.keyboardState[e.keyCode] = 'start'; 
		else this.keyboardState[e.keyCode] = 'start'; 
    };
    
    Nature.Space.prototype.onKeyUp = function (e) {
        this.keyboardState[e.keyCode] = 'end';
    };
    
    Nature.Space.prototype.touchPos = {
        X : 0, Y : 0,
        endX : 0, endY : 0
    };
    
    Nature.Space.prototype.onTouchStart = function (e) {
        var touch = e.changedTouches[0];
        this.touchPos.X = touch.clientX;
        this.touchPos.Y = touch.clientY;
        e.preventDefault();
        this.touchstart = true;
        this.touching = true;
        this.touchEnd = false;
		this.touchMove = false;
    };
    
    Nature.Space.prototype.onTouchMove = function (e) {
        var touch = e.changedTouches[0];
        this.touchPos.X = touch.clientX;
        this.touchPos.Y = touch.clientY;
        e.preventDefault();
		this.touchMove = true;
    };    
    
    Nature.Space.prototype.onTouchEnd = function (e) {
        var touch = e.changedTouches[0];
        this.touchPos.endX = touch.clientX;
        this.touchPos.endY = touch.clientY;
        e.preventDefault();
        this.touchstart = false;
        this.touching = false;
		this.touchMove = false;
        this.touchEnd = true;
    };
    
    Nature.Space.prototype.onMouseDown = function (e) {
        this.touchPos.X = e.clientX;
        this.touchPos.Y = e.clientY;
        e.preventDefault();
        this.touchstart = true;
        this.touching = true;
        this.touchEnd = false;
		this.touchMove = false;
		this.mousetype = e.which;
    };
    
    Nature.Space.prototype.onMouseMove = function (e) {
        this.touchPos.X = e.clientX;
        this.touchPos.Y = e.clientY;
        e.preventDefault();
		this.touchMove = true;
		this.mousetype = e.which;
    };    
    
    Nature.Space.prototype.onMouseUp = function (e) {
        this.touchPos.endX = e.clientX;
        this.touchPos.endY = e.clientY;
        e.preventDefault();
        this.touchstart = false;
        this.touching = false;
		this.touchMove = false;
        this.touchEnd = true;
		this.mousetype = e.which;
    };
    
    Nature.Space.prototype.pressKey = "";
    
    Nature.Space.prototype.pressKeyManager = function () {
        this.pressKey = "";
        for(var i=0; i<this.keyboardState.length; ++i)
            if(this.keyboardState[i] == 'pressed')
                if(i <= 90 && i >= 48)
                    this.pressKey = String(this.pressKey) + " " + String.fromCharCode(i);
                else
                    this.pressKey = String(this.pressKey) + " " + this.keycodeToString(i);
    };
    
    Nature.Space.prototype.keycodeToString = function (key) {
        switch (key) {
            case 8 : return "backspace";
            case 9 : return "tab";
            case 13: return "enter";   
            case 16: return "shift";  
            case 17: return "ctrl";  
            case 18: return "alt";    
            case 19: return "pause/break";    
            case 20: return "caps lock";  
            case 21: return "한/영";
            case 25: return "한자";
            case 27: return "esc";  
            case 32: return "space";
            case 33: return "page up";    
            case 34: return "page down";   
            case 35: return "end";   
            case 36: return "home";   
            case 37: return "←";   
            case 38: return "↑";   
            case 39: return "→";   
            case 40: return "↓";   
            case 45: return "insert";   
            case 46: return "delete";   
            case 91: return "left window key";   
            case 92: return "right window key";   
            case 93: return "select key";   
            case 96: return "numpad 0";   
            case 97: return "numpad 1";   
            case 98: return "numpad 2";   
            case 99: return "numpad 3";   
            case 100: return "numpad 4";   
            case 101: return "numpad 5";   
            case 102: return "numpad 6";   
            case 103: return "numpad 7";   
            case 104: return "numpad 8";   
            case 105: return "numpad 9";   
            case 106: return "*";   
            case 107: return "+";   
            case 109: return "-";   
            case 110: return ".";   
            case 111: return "/";   
            case 112: return "f1";   
            case 113: return "f2";   
            case 114: return "f3";   
            case 115: return "f4";   
            case 116: return "f5";   
            case 117: return "f6";   
            case 118: return "f7";   
            case 119: return "f8";   
            case 120: return "f9";   
            case 121: return "f10";   
            case 122: return "f11";  
            case 123: return "f12";   
            case 144: return "num lock";  
            case 145: return "scroll lock";  
            case 186: return ";";  
            case 187: return "=";  
            case 188: return ",";  
            case 189: return "-";  
            case 190: return ".";  
            case 191: return "/";  
            case 192: return "`";  
            case 219: return "[";  
            case 220: return "\\";  
            case 221: return "]";  
            case 222: return "\'";  
        }
    };

    // ---------------------
    
    Nature.Space.prototype.init = function (width, height) {
        this.canvas = document.getElementById("Nature");
        this.context = this.canvas.getContext("2d");
        this.width = width || window.innerWidth;
        this.height = height || window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.fpsStruct = { count:59, time:0, fps:0 };
        this.state = true;
    };

    Nature.Space.prototype.run = function () {
        if(this.loadEnd) {
            this.systemUpdate();
            this.update();
            if(this.state) {
                this.gameUpdate();
            }
            this.renderListUpdate();
            this.render();
            this.keyUpdate();
        } else { this.loadDo(); }
        this.requestID = window.requestAnimationFrame(this.run.bind(this));
    };
    
    Nature.Space.prototype.loadDo = function () {
        if(this.loadCount == this.loadedCount) { this.loadEnd = true; }
        if(this.loading_text) document.body.removeChild(this.loading_text); 
        this.loading_text = document.createElement("h2");
        this.loading_text.innerHTML = String(" " + this.loadedCount + " / " + this.loadCount + " Loading..");
        document.body.insertBefore(this.loading_text, document.body.firstChild);
        if(this.loadCount == this.loadedCount) { this.loadEnd = true; 
        if(this.loading_text) document.body.removeChild(this.loading_text);  }    
    };
    
    Nature.Space.prototype.pause = function () { this.state = false; };
    Nature.Space.prototype.resume = function () { this.state = true; };

    Nature.Space.prototype.update = function () {};
    Nature.Space.prototype.create = function () {};
    Nature.Space.prototype.gameUpdate = function () {};
    Nature.Space.prototype.renderListUpdate = function () {};
    Nature.Space.prototype.systemUpdate = function () {
        this.fpsManager();
        this.pressKeyManager();
        this.checkButton();
        this.audioManager();
    };

    Nature.Space.prototype.render = function () {
        this.flowchart_head();
        this.flowchart_body();
        this.flowchart_foot();
    };
    
    Nature.Space.prototype.keyUpdate = function () {
        for(var i=0; i<this.keyboardState.length; ++i) {
            if(this.keyboardState[i] == 'end')
                this.keyboardState[i] = 'none';
			else if(this.keyboardState[i] == 'start')
				this.keyboardState[i] = 'pressed';
		}
        this.touchstart = false;
        this.touchEnd = false;
        this.touchMove = false;
    };
    
    Nature.Space.prototype.fpsManager = function () {
        this.fpsStruct.count++;
        var tmpDate = new Date();
        if( this.fpsStruct.time+1000 < tmpDate.getTime() ) {
            this.fpsStruct.fps = this.fpsStruct.count;
            this.fpsStruct.count = 0;
            this.fpsStruct.time = tmpDate.getTime();
        }
        delete tmpDate;
    };
    
    // ----  Load Image  ----
    
    Nature.Space.prototype.load = function () {};
    
    Nature.Space.prototype.loadCount = 0;
    Nature.Space.prototype.loadedCount = 0;
    Nature.Space.prototype.loadEnd = false;
    
    Nature.Space.prototype.imageSrcList = new Array();
    Nature.Space.prototype.imageList = new Array();
    
    Nature.Space.prototype.addImage = function (name,src) {
        this.imageSrcList.push({src:src, name:name});
        this.loadCount++;
    };
    
    Nature.Space.prototype.setImage = function (src) {
        var tmpImage = new Image();
        tmpImage.src = src;
        
        return tmpImage;
    };
    
    Nature.Space.prototype.loading = function () {
        for(var i in this.imageSrcList) {
            this.imageList[this.imageSrcList[i].name] = this.setImage(this.imageSrcList[i].src);
            this.imageList[this.imageSrcList[i].name].addEventListener("load", this.loaded.bind(this), false);
        }
        for(var i in this.audioSrcList) {
            this.audioList[this.audioSrcList[i].name] = this.setAudio(this.audioSrcList[i].src);
            this.audioList[this.audioSrcList[i].name].addEventListener('canplaythrough', this.loaded.bind(this), false);
        }
    };
    
    Nature.Space.prototype.loaded = function () {
        this.loadedCount++;
    };
    
    // ----------------------
    // ----  load Audio  ----
    
    Nature.Space.prototype.audioSrcList = new Array();
    Nature.Space.prototype.audioList = new Array();
    
    Nature.Space.prototype.addAudio = function (name,src) {
        this.audioSrcList.push({src:src, name:name});
        this.loadCount++;
    };
    
    Nature.Space.prototype.setAudio = function (src) {
        var tmpAudio = new Audio();
        tmpAudio.src = src;
        
        return tmpAudio;
    };
    
    // ----------------------
    // -------- Timer -------
    
    
    
    // ----------------------
    // ---- make  sprite ----
    
    Nature.Space.prototype.buttonList_render = new Array();
    Nature.Space.prototype.buttonList_manager = new Array();
    
    Nature.Rectangular = function (x, y, width, height, color, alpha) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color || '#344';
        this.alpha = alpha || 1;
        this.border = {width:1, switchFlag:false, color:'#000', alpha:1, type:'out'};
    };
    
    Nature.Rectangular.prototype.getEdge = function () {
      return {left : this.x-this.width/2,
              top : this.y-this.height/2,
              right : this.x+this.width/2,
              bottom : this.y+this.height/2};  
    };
    
    Nature.Rectangular.prototype.setBorder = function(switchFlag, type/*(in/out)*/, width, color, alpha) {
        this.border.alpha = alpha || 1;
        this.border.color = color || '#000';
        this.border.width = width || 1;
        this.border.switchFlag = switchFlag;
        this.border.type = type;
    };
    
    Nature.Circle = function (x, y, radius, color, alpha) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color || '#344';
        this.alpha = alpha || 1;
        this.border = {width:1, switchFlag:false, color:'#000', alpha:1, type:'out'};
    };
    
    Nature.Circle.prototype.setBorder = function(switchFlag, type/*(in/out)*/, width, color, alpha) {
        this.border.alpha = alpha || 1;
        this.border.color = color || '#000';
        this.border.width = width || 1;
        this.border.switchFlag = switchFlag;
        this.border.type = type;
    };
    
    Nature.Space.prototype.Button = function (IMAGE, func, x, y, width, height, rotate, alpha) {
        this.image = IMAGE;
        this.do = func;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotate = rotate || 0;
        this.alpha = alpha || 1;
        this.activate = false;
        this.on = function () { this.activate = true; };
        this.off = function () { this.activate = false; };
    };
    
    Nature.Space.prototype.renderButton = function (BUTTON) {
        this.buttonList_render.push({
            image : BUTTON.image,
            x : BUTTON.x,
            y : BUTTON.y,
            width : BUTTON.width,
            height : BUTTON.height,
            rotate : BUTTON.rotate,
            alpha : BUTTON.alpha
        });
    };
    
    Nature.Space.prototype.manageButton = function (BUTTON) {
        this.buttonList_manager.push({
            x : BUTTON.x,
            y : BUTTON.y,
            width : BUTTON.width,
            height : BUTTON.height,
            play : BUTTON.do
        });
    };
    
    Nature.Space.prototype.checkButton = function () {
        for(var i in this.buttonList_manager) {
            if(this.touchstart) {
                if((this.buttonList_manager[i].x - this.buttonList_manager[i].width/2 <= this.touchPos.X 
                    && this.touchPos.X <= this.buttonList_manager[i].x + this.buttonList_manager[i].width/2)
                  &&(this.buttonList_manager[i].y - this.buttonList_manager[i].height/2 <= this.touchPos.Y 
                     && this.touchPos.Y <= this.buttonList_manager[i].y + this.buttonList_manager[i].height/2)) {
                    this.buttonList_manager[i].play();
                    this.touchstart = false;
                }
            }
        }
        while(this.buttonList_manager.length) { this.buttonList_manager.pop(); }
    };
    
    Nature.Sprite = function (IMAGE, x, y, width, height, rotate, alpha, timer, temp) {
        this.image = IMAGE;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotate = rotate;
        this.alpha = alpha;
        this.vX = 0;
        this.vY = 0;
        this.flipX;
        this.flipY;
        this.state = "normal";
        this.frameX = 0;
        this.frameY = 0;
        this.timer = timer || 0;
        this.time = 0;
        this.temp = temp || 0;
    };
    
    Nature.Sprite.prototype.getEdge = function () {
      return {left : this.x-this.width/2,
              top : this.y-this.height/2,
              right : this.x+this.width/2,
              bottom : this.y+this.height/2};  
    };
    
    Nature.Sprite.prototype.flip = function (value, state) {
        if(value == 'x') this.flipX = state;
        else if(value == 'y') this.flipY = state;
    };
    Nature.Sprite.prototype.setFrameY = function (index) {
        if(!(this.frameY == index))
            this.frameX = 0;
        this.frameY = index;
    };
    Nature.Sprite.prototype.move = function (option, friction, minSpeed) {
        var tmpFriction = friction || 0.98;
        var tmpMinSpeed = minSpeed || 0.1;
        this.x += this.vX;
        this.y += this.vY;
        if(option) {
            this.vX *= tmpFriction;
            this.vY *= tmpFriction;
        }
        if(Math.abs(this.vX) < tmpMinSpeed) this.vX = 0;
        if(Math.abs(this.vY) < tmpMinSpeed) this.vY = 0;
    };
	
	Nature.Sprite.prototype.confine = function () {
            if(this.x + this.vX < Nature.camera.minx) {
                this.vX *= -1;
                this.x = Nature.camera.minx;
                Nature.camera.shake(this.x, this.y, Space.Physic.measureSpeed(0,0,this.vX,0)*2, 200);
            }
            else if(this.x + this.vX > Nature.camera.maxx) {
                this.vX *= -1;
                this.x = Nature.camera.maxx;
                Nature.camera.shake(this.x, this.y, Space.Physic.measureSpeed(0,0,this.vX,0)*2, 200);
            }
            if(this.y + this.vY < Nature.camera.miny) {
                this.vY *= -1;
                this.y = Nature.camera.miny;
                Nature.camera.shake(this.x, this.y, Space.Physic.measureSpeed(0,0,0,this.vY)*2, 200);
            }
            else if(this.y + this.vY > Nature.camera.maxy) {
                this.vY *= -1;
                this.y = Nature.camera.maxy;
                Nature.camera.shake(this.x, this.y, Space.Physic.measureSpeed(0,0,0,this.vY)*2, 200);
            }
	};
    
    Nature.Sprite.prototype.setVector = function (vX, vY) {
        this.vX = vX;
        this.vY = vY;
    };
    
    Nature.Sprite.prototype.addVector = function (vX, vY) {
        this.vX += vX;
        this.vY += vY;
    };
    
    Nature.Vector = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    
    Nature.ParticleSprite = function (IMAGE, x, y, width, height, rotate, rotateSpeed, startAlpha, alphaSpeed, vecX, vecY, vvX, vvY, scale) {
        this.image = IMAGE;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotate = rotate;
        this.rotateSpeed = rotateSpeed || 0;
        this.alpha = startAlpha || 1;
        this.alphaSpeed = alphaSpeed || 0.01;
        this.vX = vecX || 0;
        this.vY = vecY || 0;
        this.vvX = vvX;
        this.vvY = vvY;
        this.frameX = 0;
        this.frameY = 0;
        this.scale = 1;
        this.scaling = scale || 1;
    };
    
    Nature.ParticleSprite.prototype.activate = function () {
        this.x += this.vX;
        this.y += this.vY;
        this.vX += this.vvX;
        this.vY += this.vvY;
        this.scale *= this.scaling;
        this.rotate += this.rotateSpeed;
        this.alpha -= this.alphaSpeed;
    };
    
    Nature.ParticleSprite.prototype.randomize = function (radian, speed, alphaSpeed, scale, rotateSpeed) {
        var tmpRad = Space.random(radian.min*100,radian.max*100)/100;
        var tmpSpeed = Space.random(speed.min, speed.max);
        this.vX = Math.cos(tmpRad)*speed;
        this.vY = Math.sin(tmpRad)*speed;
        this.alphaSpeed = Space.random(alphaSpeed.min*1000, alphaSpeed.max*1000)*1000;
        this.scaling = Space.random(scale.min*1000,scale.max*1000)*1000;
        this.rotateSpeed = Space.random(rotateSpeed.min*1000,rotateSpeed.max*1000)*1000;
    }
    
    Nature.minmax = function (min,max) {
        this.min = min;
        this.max = max;
    }
    
    Nature.Space.prototype.particleList = new Array();
    
    Nature.Space.prototype.createParticle = function (SPRITE, index) {
        this.particleList.push({
            sprite : new Nature.ParticleSprite(
                SPRITE.image,
                SPRITE.x,
                SPRITE.y,
                SPRITE.width,
                SPRITE.height,
                SPRITE.rotate,
                SPRITE.rotateSpeed,
                SPRITE.alpha,
                SPRITE.alphaSpeed,
                SPRITE.vX,
                SPRITE.vY,
                SPRITE.vvX,
                SPRITE.vvY,
                SPRITE.scaling
            ), index : index
        });
    };
    
    Nature.Space.prototype.activateParticle = function () {
        for(var i in this.particleList) 
            if(this.particleList[i].sprite.alpha <= 0) {
                this.particleList.splice(i,1); 
                continue;
            }
        
        for(var i in this.particleList) {
            this.particleList[i].sprite.activate();
            //this.particleList[i].index += this.particleList[i].sprite.alpha;
            this.renderParticle(this.particleList[i].sprite,this.particleList[i].index);
        }
    }
    
    //Nature.initSprite = function () {
    //    return this.Sprite.call(this,IMAGE, x, y, width, height, rotate, alpha, timer, temp);
    //};
    
    Nature.Pad = function (IMAGE, x, y, width, minR, maxR, alpha) {
        this.image = IMAGE;
        this.x = x || 0;
        this.y = y || 0;
        this.virX;
        this.virY;
        this.minR = minR;
        this.maxR = maxR;
        this.mainX = x;
        this.mainY = y;
        this.width = width || 100;
        this.height = width || 100;
        this.activate = false;
        this.alpha = alpha;
    };
    
    Nature.Pad.prototype.managePad = function ( option_ ) {
        var option = option_ || false;
        if(Space.touchEnd) {
            this.virX = this.mainX;
            this.virY = this.mainY;
            this.x = this.mainX;
            this.y = this.mainY;
            this.activate = false;
        } else if(Space.touching) { 
            this.virX = Space.touchPos.X;
            this.virY = Space.touchPos.Y;
            if(this.activate == false) {
                this.virX = Space.touchPos.X;
                this.virY = Space.touchPos.Y;
                if(option) {
                    this.mainX = this.virX;
                    this.mainY = this.virY;
                }
                this.activate = true;
            }
        }
        if(((Space.Physic.getDistance(this.mainX,this.mainY,this.virX,this.virY) <= this.maxR) && Space.touching) && this.activate) {
            this.x = this.virX;
            this.y = this.virY;
        } else {
            this.x = this.mainX;
            this.y = this.mainY;
            if(Space.touching) {
                var tmpV = Space.Physic.getGoto(this.mainX,this.mainY,this.virX,this.virY);
                while(Space.Physic.getDistance(this.mainX,this.mainY,this.x,this.y) < this.maxR) {
                    this.x += tmpV.x;
                    this.y += tmpV.y;
                }
            }
        }
    };
    
    Nature.Pad.prototype.getPadValue = function () {
        var value = Space.Physic.getGoto(this.mainX,this.mainY,this.x,this.y);
        if(Space.Physic.getDistance(this.mainX,this.mainY,this.x,this.y) < this.minR) value.x = value.y = 0;
        return value;
    };
    
    Nature.Space.prototype.padContents = {};
    Nature.Space.prototype.padActivate = false;
    Nature.Pad.prototype.render = function ( option_ ) {
        Space.padActivate = true;
        var option = option_ || false;
        Space.padContents = {
            sprite : this,
            option : option
        };
    };
    
    Nature.Space.prototype.objectList = new Array();
    
    Nature.Space.prototype.renderParticle = function (SPRITE, index) {
        var tempIndex = index || 0;
        if(SPRITE.alpha < 0) SPRITE.alpha = 0;
        else if(SPRITE.alpha > 1) SPRITE.alpha = 1;
        if(SPRITE.width < 0) SPRITE.width = 0;
        if(SPRITE.height < 0) SPRITE.height = 0;
        this.objectList.push({
            type : 2,
            image : SPRITE.image,
            x : SPRITE.x,
            y : SPRITE.y,
            width : SPRITE.width,
            height : SPRITE.height,
            rotate : SPRITE.rotate,
            alpha : SPRITE.alpha,
            scale : SPRITE.scale,
            index : tempIndex
        });
    };
    
    Nature.Space.prototype.renderSprite = function (SPRITE, index) {
        var tempIndex = index || 0;
        if(SPRITE.alpha < 0) SPRITE.alpha = 0;
        else if(SPRITE.alpha > 1) SPRITE.alpha = 1;
        if(SPRITE.width < 0) SPRITE.width = 0;
        if(SPRITE.height < 0) SPRITE.height = 0;
        this.objectList.push({
            type : 0,
            image : SPRITE.image,
            x : SPRITE.x,
            y : SPRITE.y,
            width : SPRITE.width,
            height : SPRITE.height,
            rotate : SPRITE.rotate,
            alpha : SPRITE.alpha,
            flipX : SPRITE.flipX,
            flipY : SPRITE.flipY,
            index : tempIndex
        });
    };
    
    Nature.Space.prototype.renderAniSprite = function (SPRITE, imgWid, imgHei, max, delay, stack, index) {
        var tempIndex = index || 0;
        if(SPRITE.alpha < 0) SPRITE.alpha = 0;
        else if(SPRITE.alpha > 1) SPRITE.alpha = 1;
        if(SPRITE.width < 0) SPRITE.width = 0;
        if(SPRITE.height < 0) SPRITE.height = 0;
        var tmpStack = stack || 1;
        if(this.state) {
            if(SPRITE.time > delay) { SPRITE.time = 0; SPRITE.frameX += 1; }
            if(SPRITE.frameX >= max) SPRITE.frameX = 0;
            SPRITE.time += (1000 / this.fpsStruct.fps)/tmpStack;
        }
        this.objectList.push({
            type : 1,
            image : SPRITE.image,
            x : SPRITE.x,
            y : SPRITE.y,
            imgWid : imgWid,
            imgHei : imgHei,
            width : SPRITE.width,
            height : SPRITE.height,
            rotate : SPRITE.rotate,
            alpha : SPRITE.alpha,
            flipX : SPRITE.flipX,
            flipY : SPRITE.flipY,
            frameX : SPRITE.frameX,
            frameY : SPRITE.frameY,
            maxFrame : max,
            delay : delay,
            index : tempIndex
        });
    };
    
    Nature.Space.prototype.renderRectangular = function (SPRITE, index) {
        var tempIndex = index || 0;
        if(SPRITE.alpha < 0) SPRITE.alpha = 0;
        else if(SPRITE.alpha > 1) SPRITE.alpha = 1;
        if(SPRITE.width < 0) SPRITE.width = 0;
        if(SPRITE.height < 0) SPRITE.height = 0;
        this.objectList.push({
            type : 3,
            x : SPRITE.x,
            y : SPRITE.y,
            width : SPRITE.width,
            height : SPRITE.height,
            color : SPRITE.color,
            alpha : SPRITE.alpha,
            border : {
                sFlag : SPRITE.border.switchFlag,
                type : SPRITE.border.type,
                color : SPRITE.border.color,
                width : SPRITE.border.width,
                alpha : SPRITE.border.alpha
            },
            index : tempIndex
        });
    };
    
    Nature.Space.prototype.renderCircle = function (SPRITE, index) {
        var tempIndex = index || 0;
        if(SPRITE.alpha < 0) SPRITE.alpha = 0;
        else if(SPRITE.alpha > 1) SPRITE.alpha = 1;
        if(SPRITE.radius < 0) SPRITE.radius = 0;
        this.objectList.push({
            type : 4,
            x : SPRITE.x,
            y : SPRITE.y,
            width : SPRITE.radius*2,
            height : SPRITE.radius*2,
            radius : SPRITE.radius,
            color : SPRITE.color,
            alpha : SPRITE.alpha,
            border : {
                sFlag : SPRITE.border.switchFlag,
                type : SPRITE.border.type,
                color : SPRITE.border.color,
                width : SPRITE.border.width,
                alpha : SPRITE.border.alpha
            },
            index : tempIndex
        });
    };
    
    Nature.Space.prototype.renderLine = function (data, index) {
        var tempIndex = index || 0;
        this.objectList.push({
            type : 5,
            x1 : data[0],
            y1 : data[1],
            x2 : data[2],
            y2 : data[3],
            width : data[4],
            color : data[5] || '#FFF',
            index : tempIndex
        });
    };
    
    Nature.Space.prototype.renderText = function (data, index) {
        var tempIndex = index || 0;
        this.objectList.push({
            type : 6,
            content : data[0],
            x : data[1],
            y : data[2],
            size : data[3],
            color : data[4],
            font : data[5],
            index : tempIndex
        });
    };
    
    // --     camera     --
    
    function _CAMERA_ () {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.maxSpeed = 0;
        this.minx = 0;
        this.miny = 0;
        this.maxx = window.innerWidth;
        this.maxy = window.innerHeight;
        this.time = 0;
        this.force = 0;
        this.tx = 0;
        this.ty = 0;
        this.getScreenX = function () {
            return this.x + window.innerWidth/2;
        };
        this.getScreenY = function () {
            return this.y + window.innerHeight/2;
        };
        this.setMaxSpeed = function ( speed ) {
            this.maxSpeed = speed;
        };
        this.setVector = function (vx, vy) {
            this.vx = vx;
            this.vy = vy;
        };
        this.addVector = function (vx, vy) {
            this.vx += vx;
            this.vy += vy;
        };
		this.setPos = function (x, y) {
			if(this.minx + window.innerWidth/2 <= x && this.maxx - window.innerWidth/2 >= x) {
				this.x = x - window.innerWidth/2;
				console.log('x-success');
			}
			else
				if(this.minx + window.innerWidth/2 > x){ this.x = this.minx;
				console.log('x-min');}
				else {this.x = this.maxx - window.innerWidth; 
				console.log('x-max');}
			if(this.miny + window.innerHeight/2 <= y && this.maxy - window.innerHeight/2 >= y)
				this.y = y - window.innerHeight/2;
			else
				if(this.miny + window.innerHeight/2 > y) this.y = this.miny;
				else this.y = this.maxy - window.innerHeight;
		}
		this.addPos = function (x, y) {
			if(this.minx <= this.x + x && this.maxx - window.innerWidth >= this.x + x)
				this.x += x;
			if(this.miny <= this.y + y && this.maxy - window.innerHeight >= this.y + y)
				this.y += y;
		}
        this.setBox = function (x1, y1, x2, y2) {
            this.minx = x1;
            this.miny = y1;
            this.maxx = x2;
            this.maxy = y2;
            if(this.minx >= this.maxx || this.miny >= this.maxy) this.minx = this.miny = this.maxx = this.maxy = 0; 
        };
        this.activate = function ( e ) {
            if(this.time > 0) {
                this.time -= 1000/Space.fpsStruct.fps;
                if(this.tx < this.minx + window.innerWidth/2) this.tx = this.minx + window.innerWidth/2 + this.force;
                else if(this.tx > this.maxx - window.innerWidth/2) this.tx = this.maxx - window.innerWidth/2 - this.force;
                if(this.ty < this.miny + window.innerHeight/2) this.ty = this.miny + window.innerHeight/2 + this.force;
                else if(this.ty > this.maxy - window.innerHeight/2) this.ty = this.maxy - window.innerHeight/2 - this.force;
                this.x = this.tx + Space.random(-this.force*10,this.force*10)/10 - window.innerWidth/2;
                this.y = this.ty + Space.random(-this.force*10,this.force*10)/10 - window.innerHeight/2;
            } else if(Space.Physic.measureSpeed(0,0,this.vx,this.vy) > this.maxSpeed) {
                this.vx *= this.maxSpeed / Space.Physic.measureSpeed(0,0,this.vx,this.vy);
                this.vy *= this.maxSpeed / Space.Physic.measureSpeed(0,0,this.vx,this.vy);
            }
            if(this.x + this.vx <= this.maxx - window.innerWidth && this.x + this.vx >= this.minx) {this.x += this.vx;}
            else if(this.x + this.vx < this.minx) this.x = this.minx;
            else this.x = this.maxx - window.innerWidth;
            if(this.y + this.vy <= this.maxy - window.innerHeight && this.y + this.vy >= this.miny) {this.y += this.vy;}
            else if(this.y + this.vy < this.miny) this.y = this.miny;
            else this.y = this.maxy - window.innerHeight;
            if(e) {
                this.vx *= e;
                this.vy *= e;
            }
        };
        this.shake = function ( x, y, force, time ) {
            this.tx = x;
            this.ty = y;
            this.time = time;
            this.force = force;
        };
		this.goto = function (x, y, speed_, dspeed_) {
			var speed = speed_ || 3; 
			var dspeed = dspeed_ || 8;
            this.setMaxSpeed(Space.Physic.getDistance(this.getScreenX(),this.getScreenY(),x,y)/dspeed);
            var tmpVec = Space.Physic.getGoto(this.getScreenX(),this.getScreenY(),x,y,speed);    
            if(this.time <= 0) this.addVector(tmpVec.x,tmpVec.y);
		};
    }
    
    Nature.camera = new _CAMERA_();
    
    // --renderStruct lib--
    
    Nature.Space.prototype.renderStruct_button = function (BUTTON) {
        for(var i in this.buttonList_render) {
            this.context.save();
            this.context.translate(this.buttonList_render[i].x,this.buttonList_render[i].y);
            this.context.rotate(this.buttonList_render[i].rotate);
            this.context.translate(-this.buttonList_render[i].width/2,-this.buttonList_render[i].height/2);
            this.context.globalAlpha = this.buttonList_render[i].alpha;
            this.context.drawImage(
                this.buttonList_render[i].image,0,0,this.buttonList_render[i].width,this.buttonList_render[i].height
            );
            this.context.restore();
        }
        while(this.buttonList_render.length) { this.buttonList_render.pop(); }
    };
    
    Nature.Space.prototype.renderStruct_vitualPad = function (PAD) {
        if((this.touching || !this.padContents.option) && this.padActivate) {
            this.context.save();
            this.context.translate(this.padContents.sprite.mainX,this.padContents.sprite.mainY);
            this.context.rotate(0);
            this.context.translate(-this.padContents.sprite.maxR,-this.padContents.sprite.maxR);
            this.context.globalAlpha = this.padContents.sprite.alpha;
            this.context.drawImage(
                this.padContents.sprite.image,0,0,this.padContents.sprite.maxR*2,this.padContents.sprite.maxR*2
            );
            this.context.restore();
            this.context.save();
            this.context.translate(this.padContents.sprite.x,this.padContents.sprite.y);
            this.context.rotate(0);
            this.context.translate(-this.padContents.sprite.width/2,-this.padContents.sprite.width/2);
            this.context.globalAlpha = this.padContents.sprite.alpha;
            this.context.drawImage(
                this.padContents.sprite.image,0,0,this.padContents.sprite.width,this.padContents.sprite.width
            );
            this.context.restore();
        }   
    };
    
    Nature.Space.prototype.renderStruct_object = function () {
        this.objectList.sort(function (a, b) {
            return b.index - a.index;
        });
        for(var i in this.objectList) {
			if(Space.Physic.collision(new Nature.Sprite('',Nature.camera.getScreenX(),Nature.camera.getScreenY(),window.innerWidth,window.innerHeight),this.objectList[i],1) || (this.objectList[i].type === 5 || this.objectList[i].type === 6)) {
				if(this.objectList[i].type === 0) this.renderStruct_sprite(this.objectList[i]);
				else if(this.objectList[i].type === 1) this.renderStruct_aniSprite(this.objectList[i]);
				else if(this.objectList[i].type === 2) this.renderStruct_particle(this.objectList[i]);
				else if(this.objectList[i].type === 3) this.renderStruct_rectangular(this.objectList[i]);
				else if(this.objectList[i].type === 4) this.renderStruct_circle(this.objectList[i]);
				else if(this.objectList[i].type === 5) this.renderStruct_lineTo(this.objectList[i]);
				else if(this.objectList[i].type === 6) this.renderStruct_text(this.objectList[i]);
                else console.log('this.objectList[i]');
			}
        }
        while(this.objectList.length) { this.objectList.pop(); }
    };
    
    Nature.Space.prototype.renderStruct_particle = function (object) {
        this.context.save();
        this.context.translate(object.x - Nature.camera.x, object.y - Nature.camera.y);
        this.context.scale(object.scale,object.scale);
        this.context.rotate(object.rotate);
        this.context.translate(-object.width/2,-object.height/2);
        this.context.globalAlpha = object.alpha;
        this.context.drawImage(
            object.image,0,0,object.width,object.height
        );
        this.context.restore();
    };
    
    Nature.Space.prototype.renderStruct_sprite = function (object) {
        var tmpX=1, tmpY=1; 
        if(object.flipX) tmpX = -tmpX;
        if(object.flipY) tmpY = -tmpY;
        this.context.save();
        this.context.translate(object.x - Nature.camera.x, object.y - Nature.camera.y);
        this.context.scale(tmpX,tmpY);
        this.context.rotate(object.rotate);
        this.context.translate(-object.width/2,-object.height/2);
        this.context.globalAlpha = object.alpha;
        this.context.drawImage(
            object.image,0,0,object.width,object.height
        );
        this.context.restore();
    };
    
    Nature.Space.prototype.renderStruct_aniSprite = function (object) {
        var tmpX=1, tmpY=1; 
        if(object.flipX) tmpX = -tmpX;
        if(object.flipY) tmpY = -tmpY;
        this.context.save();
        this.context.translate(object.x - Nature.camera.x, object.y - Nature.camera.y);
        this.context.scale(tmpX,tmpY);
        this.context.rotate(object.rotate);
        this.context.translate(-object.width/2,-object.height/2);
        this.context.globalAlpha = object.alpha;
        this.context.drawImage(
            object.image,
            object.frameX * object.imgWid,
            object.frameY * object.imgHei,
            object.imgWid, object.imgHei,
            0,0,object.width, object.height
        );
        this.context.restore();
    };
    
    Nature.Space.prototype.renderStruct_rectangular = function (object) {
        this.context.save();
        this.context.translate(object.x - Nature.camera.x, object.y - Nature.camera.y);
        this.context.translate(-object.width/2,-object.height/2);
        this.context.globalAlpha = object.alpha;
        this.context.fillStyle = object.color;
        this.context.fillRect( 0, 0, object.width, object.height );
        this.context.restore();
        if (object.border.sFlag) {
            this.context.save();
            this.context.translate(object.x - Nature.camera.x, object.y - Nature.camera.y);
            this.context.translate(-object.width/2,-object.height/2);
            this.context.globalAlpha = object.border.alpha;
            this.context.beginPath();
            this.context.lineWidth = object.border.width;
            this.context.strokeStyle = object.border.color;
            switch (object.border.type) {
                case 'out': this.context.rect(
                    -object.border.width/2, -object.border.width/2,
                    object.width + object.border.width,object.height + object.border.width
                ); break;
                case 'in': this.context.rect(
                    object.border.width/2, object.border.width/2,
                    object.width - object.border.width, object.height - object.border.width
                ); break;
                default: console.error('rectangular border type error'); break;
            }
            this.context.stroke();
            this.context.restore();
        }
    };
    
    Nature.Space.prototype.renderStruct_circle = function (object) {
        this.context.save();
        this.context.translate(object.x - Nature.camera.x, object.y - Nature.camera.y);
        this.context.translate(0,0);
        this.context.globalAlpha = object.alpha;
        this.context.beginPath();
        this.context.strokeStyle = object.color;
        this.context.fillStyle = object.color;
        this.context.arc(0, 0, object.radius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
        this.context.restore();
        if (object.border.sFlag) {
            this.context.save();
            this.context.translate(object.x - Nature.camera.x, object.y - Nature.camera.y);
            this.context.translate(0,0);
            this.context.globalAlpha = object.border.alpha;
            this.context.beginPath();
            this.context.lineWidth = object.border.width;
            this.context.strokeStyle = object.border.color;
            switch (object.border.type) {
                case 'out' : this.context.arc(0, 0, object.radius + object.border.width/2, 0, 2 * Math.PI);break;
                case 'in' : this.context.arc(0, 0, object.radius - object.border.width/2, 0, 2 * Math.PI); break;
            }
            this.context.stroke();
            this.context.restore();
        }
    };
    
    Nature.Space.prototype.renderStruct_text = function (object) {
        var tmpSize = object.size || 11;
        var tmpFont = object.font || "Arial";
        var tmpColor = object.color || "#FFFFFF";
        var tmpStyle = String(tmpSize + "px " + tmpFont);
        this.context.save();
        this.context.font = tmpStyle;
        this.context.fillStyle = tmpColor;
        this.context.textAlign = 'center';
        this.context.fillText(object.content,object.x - Nature.camera.x,object.y - Nature.camera.y+tmpSize/3);
        this.context.restore();
    };
    
    Nature.Space.prototype.renderStruct_lineTo = function (object) {
        this.context.save();
        this.context.beginPath();
        this.context.globalAlpha = object.alpha;
        this.context.lineWidth = object.width;
        this.context.moveTo(object.x1 - Nature.camera.x,object.y1 - Nature.camera.y);
        this.context.lineTo(object.x2 - Nature.camera.x,object.y2 - Nature.camera.y);
        this.context.strokeStyle = object.color;
        this.context.stroke();
        this.context.restore();
    };
    
    Nature.Space.prototype.renderStruct_background = function () {
        this.context.save();
        this.context.fillStyle = "#3d3d3d";
        this.context.fillRect(0,0,this.width,this.height);
        this.context.restore();
    };
    Nature.Space.prototype.renderStruct_fps = function () {
        this.context.save();
        this.context.fillStyle = "#ffffff";
        this.context.font = "15px Arial";
        this.context.textBaseline = "top";
        this.context.fillText("FPS : " + this.fpsStruct.fps,0,0);
        this.context.restore();
    };
    Nature.Space.prototype.renderStruct_key = function () {
        this.context.save();
        this.context.fillStyle = "#ffffff";
        this.context.font = "15px Arial";
        this.context.textBaseline = "top";
        this.context.fillText("press key :" + this.pressKey,70,0);
        this.context.restore();
    };
    Nature.Space.prototype.renderList = new Array();
    
    // --------------------
    // --flowchart   node--
    
    Nature.Space.prototype.flowchart_head = function () {
        this.renderStruct_background();
    };
    Nature.Space.prototype.flowchart_body = function () {
        this.renderStruct_object();
        this.renderStruct_button();
        this.renderStruct_vitualPad();
    };
    Nature.Space.prototype.flowchart_foot = function () {
        //this.renderStruct_fps();
        //this.renderStruct_key();
    };
    
    // --------------------
    // --   user tools   --
    
    Nature.Tool = function () {};
    
    /*Nature.Space.prototype.Vars;
    
    Nature.Space.prototype.MakeVar = function (ARRAY) {
        this.Vars = ARRAY;
    };*/
    
    Nature.Space.prototype.random = function (min, max) { return Math.floor(Math.random()*(max-min+1)+min); };
    
    Nature.Space.prototype.Screen = function (option) {
        var max,min;
        if(window.innerWidth > window.innerHeight) {
            max = window.innerWidth;
            min = window.innerHeight;
        } else {
            min = window.innerWidth;
            max = window.innerHeight;
        }
        if(option) return min;
        else return max;
    };
    
    Nature.Space.prototype.keyboard = {
        a : 65, b : 66, c : 67,
        d : 68, e : 69, f : 70,
        g : 71, h : 72, i : 73,
        j : 74, k : 75, l : 76,
        m : 77, n : 78, o : 79,
        p : 80, q : 81, r : 82,
        s : 83, t : 84, u : 85,
        v : 86, w : 87, x : 88,
        y : 89, z : 90,
        Backspace : 8,
        Tab : 9, 
        Enter : 13, 
        Shift : 16, 
        Control : 17,
        Alt : 18,
        PauseBreak : 19,
        CapsLock : 20,
        ESC : 27,
        Space : 32,
        PageUp : 33,
        PageDown : 34,
        End : 35,
        Home : 36, 
        Left : 37, 
        Up : 38, 
        Right : 39, 
        Down : 40,
        Insert : 45,
        Delete : 46,
        LeftWindows : 91,
        RightWindows : 92,
        Menu : 93,
        F1 : 112, F2 : 113, F3 : 114,
        F4 : 115, F5 : 116, F6 : 117,
        F7 : 118, F8 : 119, F9 : 120,
        F10 : 121, F11 : 122, F12 : 123,
        NumLock : 144,
        ScrollLock : 145
    };

    // --------------------

    // --  function list --
    
    // --physics function--
    
    Nature.Space.Physic = function () {};
    
    Nature.Space.Physic.prototype.discriminPos = function (SPRITE1, SPRITE2, option) {
        var tmpOption = option || 'x';
        if(tmpOption == 'x') {
            if(SPRITE1.x < SPRITE2.x) return "left";
            else return "right";
        } else if(tmpOption == 'y') {
            if(SPRITE1.y < SPRITE1.y) return "top";
            else return "bottom";
        } else return "same";
    };
    
    Nature.Space.Physic.prototype.collision = function (SPRITE1, SPRITE2, option) {
        var tmpOption = option || 1;
        var left1 = SPRITE1.x - SPRITE1.width/2;
        var right1 = SPRITE1.x + SPRITE1.width/2;
        var top1 = SPRITE1.y - SPRITE1.height/2;
        var bottom1 = SPRITE1.y + SPRITE1.height/2;
        if(tmpOption == 1) { // rectangle & rectangle
            var left2 = SPRITE2.x - SPRITE2.width/2;
            var right2 = SPRITE2.x + SPRITE2.width/2;
            var top2 = SPRITE2.y - SPRITE2.height/2;
            var bottom2 = SPRITE2.y + SPRITE2.height/2;
            if( left1 <= right2 && top1 <= bottom2 && right1 >= left2 && bottom1 >= top2 )
                return true;
            else return false;
        } else if(tmpOption == 2) { // circle & circle
            var r1 = Math.pow(SPRITE1.x - SPRITE2.x,2) + Math.pow(SPRITE1.y - SPRITE2.y,2);
            var r2 = Math.pow(SPRITE1.width/2 + SPRITE2.width/2,2);
            if(r1 <= r2) return true;
            else return false;
        } else if(tmpOption == 3) { // rectangle & circle
            var rW = SPRITE2.width/2;
            var rH = SPRITE2.height/2;
            var rRect = (Math.pow(rW,2) + Math.pow(rH,2))
            if((Math.abs(left1 - SPRITE2.x) <= rW && Math.abs(SPRITE1.y - SPRITE2.y) <= rH)
              || (Math.abs(right1 - SPRITE2.x) <= rW && Math.abs(SPRITE1.y - SPRITE2.y) <= rH)
              || (Math.abs(top1 - SPRITE2.y) <= rH && Math.abs(SPRITE1.x - SPRITE2.x) <= rW)
              || (Math.abs(bottom1 - SPRITE2.y) <= rH && Math.abs(SPRITE1.x - SPRITE2.x) <= rW)
              || Math.pow(SPRITE2.width/2,2) >= Math.pow(left1 - SPRITE2.x,2) + Math.pow(top1 - SPRITE2.y,2)
              || Math.pow(SPRITE2.width/2,2) >= Math.pow(right1 - SPRITE2.x,2) + Math.pow(top1 - SPRITE2.y,2)
              || Math.pow(SPRITE2.width/2,2) >= Math.pow(left1 - SPRITE2.x,2) + Math.pow(bottom1 - SPRITE2.y,2)
              || Math.pow(SPRITE2.width/2,2) >= Math.pow(right1 - SPRITE2.x,2) + Math.pow(bottom1 - SPRITE2.y,2))
                return true;
            else return false;  
        }
    };
    
    Nature.Space.Physic.prototype.radToVec = function ( radian ) {
        var Vector;
        Vector.x = Math.cos(radian);
        Vector.y = Math.sin(radian);
        return Vector;
    };
    
    Nature.Space.Physic.prototype.vecToRad = function ( x, y ) {
        return Math.atan2(y, x);
    };
    
    Nature.Space.Physic.prototype.measureSpeed = function ( x1, y1, x2, y2 ) {
        var tmpX = x2-x1;
        var tmpY = y2-y1;
        var tmpVec = this.getGoto(x1, y1, x2, y2, 1);
        if(tmpX === 0)
            return tmpY / tmpVec.y;
        else
            return tmpX / tmpVec.x;
    };
    
    Nature.Space.prototype.lineList = new Array();
    
    Nature.Space.prototype.at = function (SPRITE1, SPRITE2, speed, option1, option2) {
        var tmpSpeed = speed || 1;
        if(option1) {
            SPRITE1.vX = this.Physic.cos(SPRITE1.x,SPRITE2.x,SPRITE1.y,SPRITE2.y)*tmpSpeed;
            SPRITE1.vY = this.Physic.sin(SPRITE1.x,SPRITE2.x,SPRITE1.y,SPRITE2.y)*tmpSpeed;
        } else {
            SPRITE1.vX = SPRITE1.vX + this.Physic.cos(SPRITE1.x,SPRITE2.x,SPRITE1.y,SPRITE2.y)*tmpSpeed;
            SPRITE1.vY = SPRITE1.vY + this.Physic.sin(SPRITE1.x,SPRITE2.x,SPRITE1.y,SPRITE2.y)*tmpSpeed;
        }
        if(option2)
            this.lineList.push({
                X1 : SPRITE1.x,
                Y1 : SPRITE1.y,
                X2 : SPRITE2.x,
                Y2 : SPRITE2.y
            });
    };
    
    Nature.Space.Physic.prototype.getGoto = function (x1, y1, x2, y2, speed) {
        var V = {x:0,y:0};
        var tmpSpeed = speed || 1;
        V.x = this.cos(x1,x2,y1,y2)*tmpSpeed;
        V.y = this.sin(x1,x2,y1,y2)*tmpSpeed;
        
        return V;
    };
    
    Nature.Space.Physic.prototype.getDistance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
    };
        
    Nature.Space.Physic.prototype.sin = function (x1, x2, y1, y2) {
        var x, y, r;
        x = x1 - x2;
        y = y1 - y2;
        r = Math.sqrt( (x * x) + (y * y) );
        if(!x) {
            if(y1>y2) return -1;
            else return 1;
        } else if(!y) return 0;
        
        return -y/r;
    }

    Nature.Space.Physic.prototype.cos = function (x1, x2, y1, y2)
    {
        var x, y, r;
        x = x1 - x2;
        y = y1 - y2;
        r = Math.sqrt( (x * x) + (y * y) );
        if(!y) {
            if(x1>x2) return -1;
            else return 1;
        } else if(!x) return 0;

        return -x/r;
    }
    
    // --------------------   
    // ----   Audio   -----
    
    Audio.prototype.stop = function () {
        this.currentTime = 0;
        this.pause();
    };
    
    Nature.Space.prototype.playAudio = function (AUDIO) {
        var tmp = clone(AUDIO);
        this.audioPlayList.push(tmp);
    };
    
    Nature.Space.prototype.audioPlayList = new Array();
    
    Nature.Space.prototype.audioManager = function () {
        for(var i in this.audioPlayList) {
            this.audioPlayList[i].play();
        }
        while(this.audioPlayList.length) this.audioPlayList.pop();
    };
    
    // --------------------
    
}());
