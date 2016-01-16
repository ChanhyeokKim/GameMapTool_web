(function(){
    window.onload = function() {
        var nature = new Nature({preload : load, create : create, userUpdate : userUpdate, gameUpdate : gameUpdate, render : render});
        function load () {
            Space.addImage('erase_off','img/button_garbage_off.png');
            Space.addImage('erase_on','img/button_garbage_on.png');
            Space.addImage('create_off','img/button_create_off.png');
            Space.addImage('create_on','img/button_create_on.png');
            Space.addImage('download_off','img/button_download_off.png');
            Space.addImage('download_on','img/button_download_on.png');
        }
        
        function create () {
            Nature.camera.setBox(0,0,4000,3000);
            
            state = '';
            
            dragFlag = false;
            TEMP = false;
            
            if (window.File && window.FileList && window.FileReader) {
                var filesInput = document.getElementById("files");
                filesInput.addEventListener("change", function(e){
                    var files = event.target.files; //FileList object
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var picReader = new FileReader();
                        picReader.addEventListener("load", function(event) {
                            var textFile = event.target;
                            var json = textFile.result;
                            json = JSON.parse(json);
                            for(i in json) {
                                createBlock(json[i].x,json[i].y,json[i].width,json[i].height);
                            }
                        });
                        picReader.readAsText(file);
                    }
                });
            } else console.log("Your browser does not support File API");
            
            Blocks = new Array();
            
			Block = function (x, y, width, height, color, alpha) {
				Nature.Rectangular.call(this, x, y, width, height, color, alpha);
                this.focus = false;
                this.currentHandle = 'none';
                this.index = 1;
                this.vertexHandle = new Array();
                for(var i=0; i<8; ++i) this.vertexHandle.push(new Handle(0, 0, 4, '#fff', 1));
                this.startPos = {mX:'', mY:'', x:'', y:''};
            }

			Block.prototype = Object.create(Nature.Rectangular.prototype);
			
			Block.prototype.manageVertexHandle = function () {
                this.vertexHandle[0].x = this.x - this.width/2;
                this.vertexHandle[0].y = this.y - this.height/2;
                this.vertexHandle[1].x = this.x + this.width/2;
                this.vertexHandle[1].y = this.y - this.height/2;
                this.vertexHandle[2].x = this.x + this.width/2;
                this.vertexHandle[2].y = this.y + this.height/2;
                this.vertexHandle[3].x = this.x - this.width/2;
                this.vertexHandle[3].y = this.y + this.height/2;
                this.vertexHandle[4].x = this.x - this.width/2;
                this.vertexHandle[4].y = this.y;
                this.vertexHandle[5].x = this.x;
                this.vertexHandle[5].y = this.y - this.height/2;
                this.vertexHandle[6].x = this.x + this.width/2;
                this.vertexHandle[6].y = this.y;
                this.vertexHandle[7].x = this.x;
                this.vertexHandle[7].y = this.y + this.height/2;
                for ( i in this.vertexHandle ) {
                    this.vertexHandle[i].activate(i==this.currentHandle);
                }
            };
            
            Block.prototype.checkHandle = function () {
                var data = {focus : false, area : false, index : 'none'};
                
                for ( i in this.vertexHandle ) {
                    if( this.vertexHandle[i].checkArea() && this.currentHandle == 'none' && this.focus ) {
                        data.area = true;
                        data.index = parseInt(i);
                    }
                    if (this.vertexHandle[i].focus) {
                        data.focus = true;
                        data.index = parseInt(i);
                        this.currentHandle = parseInt(i);
                    }
                }
                
                return data;
            };
            
            Block.prototype.setPastData = function () {
                this.startPos.mX = Space.touchPos.X;
                this.startPos.mY = Space.touchPos.Y;
                this.startPos.x = this.x;
                this.startPos.y = this.y;
                this.startWidth = this.width;
                this.startHeight = this.height;    
            };          
            
            Block.prototype.setCurrentHandle = function () {
                if(this.focus) {
                    for ( i in this.vertexHandle )
                        if(this.vertexHandle[i].checkArea()) {
                            this.vertexHandle[i].focus = true;
                            this.currentHandle = i;
                        }
                }
                if(this.checkHandle().focus) this.currentHandle = this.checkHandle().index;
                else this.currentHandle = 'none';  
            };

            Block.prototype.checkArea = function () {
                return (this.getEdge().left - Nature.camera.x < Space.touchPos.X &&
                       this.getEdge().right - Nature.camera.x > Space.touchPos.X &&
                       this.getEdge().top - Nature.camera.y < Space.touchPos.Y &&
                       this.getEdge().bottom - Nature.camera.y > Space.touchPos.Y);
            };
            
            Block.prototype.adjust = function () {
                state = 'adjust';
                switch(this.checkHandle().index) {
                    case 0:
                        this.width = this.startWidth + (this.startPos.mX - Space.touchPos.X);
                        this.height = this.startHeight + (this.startPos.mY - Space.touchPos.Y);
                        this.x = this.startPos.x-(this.startPos.mX - Space.touchPos.X)/2; 
                        this.y = this.startPos.y-(this.startPos.mY - Space.touchPos.Y)/2; break;
                    case 1:
                        this.width = this.startWidth + (Space.touchPos.X - this.startPos.mX);
                        this.height = this.startHeight + (this.startPos.mY - Space.touchPos.Y);
                        this.x = this.startPos.x-(this.startPos.mX - Space.touchPos.X)/2;
                        this.y = this.startPos.y-(this.startPos.mY - Space.touchPos.Y)/2; break;
                    case 2:
                        this.width = this.startWidth + (Space.touchPos.X - this.startPos.mX);
                        this.x = this.startPos.x-(this.startPos.mX - Space.touchPos.X)/2; 
                        this.height = this.startHeight + (Space.touchPos.Y - this.startPos.mY);
                        this.y = this.startPos.y-(this.startPos.mY - Space.touchPos.Y)/2; break;
                    case 3:
                        this.height = this.startHeight + (Space.touchPos.Y - this.startPos.mY);
                        this.y = this.startPos.y-(this.startPos.mY - Space.touchPos.Y)/2; 
                        this.width = this.startWidth + (this.startPos.mX - Space.touchPos.X);
                        this.x = this.startPos.x-(this.startPos.mX - Space.touchPos.X)/2; break;
                    case 4:
                        this.width = this.startWidth + (this.startPos.mX - Space.touchPos.X);
                        this.x = this.startPos.x-(this.startPos.mX - Space.touchPos.X)/2; break;
                    case 5:
                        this.height = this.startHeight + (this.startPos.mY - Space.touchPos.Y);
                        this.y = this.startPos.y-(this.startPos.mY - Space.touchPos.Y)/2; break;
                    case 6:
                        this.width = this.startWidth + (Space.touchPos.X - this.startPos.mX);
                        this.x = this.startPos.x-(this.startPos.mX - Space.touchPos.X)/2; break;
                    case 7:
                        this.height = this.startHeight + (Space.touchPos.Y - this.startPos.mY);
                        this.y = this.startPos.y-(this.startPos.mY - Space.touchPos.Y)/2; break;
                    default: break;
                }
                if(this.width <= 0) this.width = 10;
                if(this.height <= 0) this.height = 10;
            };
            
            Block.prototype.manageFocus = function () {
                if(this.checkArea() &&
                   (!checkBlockFocus() || this.focus || !(
                    Blocks[checkBlockFocus()-1].checkArea()) 
                    && state != 'adjust' )
                  ) {
                    var spot = 0;
                    var min = 0;
                    for(i in Blocks) {
                        if(Blocks[i].checkArea()) { 
                            spot += 1;
                            if(spot == 1) min = i;
                            if(Blocks[i].index < Blocks[min].index) min = i;
                        }
                    }
                    if((this.index == Blocks[min].index) || spot == 1) {
                        eraseFocus();
                        this.focus = true;
                    }
                }
                else {
                    var tmp = false;
                    for ( i in this.vertexHandle ) {
                        if( this.vertexHandle[i].checkArea() )
                            tmp = true;
                    }
                    var tmp2 = false;
                    for ( i in Buttons )
                        if( Buttons[i].checkArea() && Buttons[i].name == 'erase' )
                            tmp2 = true;
                    if( !tmp && !tmp2 ) {
                        this.focus = false;
                    }
                }
                if(this.focus) {
                    this.setBorder(true,'in',2,'#e8af2f',1);
                }
                else this.setBorder(true,'in',1,'#fff',1); 
            };
            
            Block.prototype.drag = function () {
                state = 'drag';
                this.x = Space.touchPos.X /*+ Nature.camera.x*/ - (this.startPos.mX - this.startPos.x); 
                this.y = Space.touchPos.Y /*+ Nature.camera.y*/ - (this.startPos.mY - this.startPos.y);
            };
            
            Block.prototype.interactionKey = function () {
                if(this.focus) {
                    if(Space.keyboardState[Space.keyboard.Left] == 'start') this.x -= 10;
                    else if(Space.keyboardState[Space.keyboard.Right] == 'start') this.x += 10;
                    if(Space.keyboardState[Space.keyboard.Up] == 'start') this.y -= 10;
                    else if(Space.keyboardState[Space.keyboard.Down] == 'start') this.y += 10;
                    if(Space.keyboardState[Space.keyboard.Delete] == 'start') eraseBlock(checkBlockFocus()-1);
                }
            }
            
            Block.prototype.activate = function () {
                
                if( Space.touchstart ) {    // check focus
                    state = '';
                    this.setPastData();
                    this.setCurrentHandle();
                    this.manageFocus();
                } else if(this.focus == true && Space.touchMove && Space.touching) {    // drag effect
                    if(!(this.checkHandle().area || this.checkHandle().focus)) this.drag();
                    else if(this.currentHandle != 'none') this.adjust();
                } else if(Space.touchEnd) {
                    this.currentHandle = 'none';
                } 
                this.interactionKey();
                this.manageVertexHandle();
            };
            
            Block.prototype.setIndex = function () {
                ///var tmpIndex;
                ///for (i in Blocks) if(Blocks[i] == this) tmpIndex = parseInt(i)*2; 
                ///this.index = tmpIndex;
                var minIndex = Blocks[0].index;
                for (i in Blocks) if(minIndex > Blocks[i].index) minIndex = Blocks[i].index; 
                if(this.focus) this.index = minIndex - 2;
                if(this.index < 0) {
                    var tmp = this.index;
                    for(i in Blocks) Blocks[i].index -= tmp;
                }
                if(this.index > 500) {
                    this.index = 500;
                }
                //Blocks.sort(function (a, b) {
                //    return b.index - a.index;
                //});
                //for (i in Blocks) Blocks[i].index = parseInt(i)*2;
                //for (i in Blocks) console.log(i+':'+Blocks[i].index);
            };
        
            Block.prototype.renderData = function ( option , index ) {
                switch ( option ) {
                    case 'pos': Space.renderText(['x:'+this.x+', y:'+this.y,this.x,this.y,15,'#000000'],index); break;
                    case 'area': 
                        Space.renderText(['width:'+this.width,this.x,this.y-7,12,'#000000'],index);
                        Space.renderText(['height:'+this.height,this.x,this.y+7,12,'#000000'],index); break;
                }
                
            };
            
            Block.prototype.render = function () {
                this.setIndex();
                Space.renderRectangular(this,this.index);   
                if ( this.focus && (!Space.touching || this.checkHandle().focus )) 
                    for (i in this.vertexHandle) {
                        this.vertexHandle[i].render(this.index - 1);
                    }
                if ( this.getEdge().left - Nature.camera.x < Space.touchPos.X &&
                       this.getEdge().right - Nature.camera.x > Space.touchPos.X &&
                       this.getEdge().top - Nature.camera.y < Space.touchPos.Y &&
                       this.getEdge().bottom - Nature.camera.y > Space.touchPos.Y && this.focus )
                    this.renderData('pos', this.index - 2);
                else this.renderData('area', this.index - 2);
                
            };
            
            Handle = function (x, y, radius, color, alpha) {
				Nature.Circle.call(this, x, y, radius, color, alpha);
                this.focus = false;
            }

			Handle.prototype = Object.create(Nature.Circle.prototype);
            
            Handle.prototype.checkArea = function () {
                if( Space.Physic.getDistance(this.x-Nature.camera.x,this.y-Nature.camera.y,Space.touchPos.X,Space.touchPos.Y) <= this.radius )
                    return true;
                else return false;
            };
            
            Handle.prototype.activate = function ( active ) {
                if(active) {
                    this.focus = true; 
                    this.setBorder(true,'out',2,'#cc5d5d',1);
                } else {
                    this.focus = false;
                    this.setBorder(false);
                }
            };
            
            //Handle.prototype.renderPos = function () {
            //    Space.renderText('x:'+this.x+', y:'+this.y,this.x,this.y,8,'#000000');
            //};
            
            Handle.prototype.render = function (index) {
                Space.renderCircle(this,index);
                //if( this.checkFocus() ) this.renderPos();
            };
            
            
            Button = function (IMAGE1, IMAGE2, x, y, width, height, func, name) {
                var rotate = 0, alpha = 0.9 ;
				Nature.Sprite.call(this, IMAGE1, x, y, width, height, rotate, alpha);
                this.IMAGE1 = IMAGE1;
                this.IMAGE2 = IMAGE2;
                this.image = IMAGE1;
                this.focus = false;
                this.func = func;
                this.name = name;
            }

			Button.prototype = Object.create(Nature.Sprite.prototype);
            
            Button.prototype.checkArea = function () {
                if(this.getEdge().left < Space.touchPos.X &&
                   this.getEdge().right > Space.touchPos.X &&
                   this.getEdge().top < Space.touchPos.Y &&
                   this.getEdge().bottom > Space.touchPos.Y)
                    return true;
                else return false;
            };
            
            Button.prototype.checkClick = function () {
                if((Space.touching || Space.touchEnd) && this.checkArea())
                    this.focus = true;
                else this.focus = false;
            };
            
            Button.prototype.activate = function () {
                this.checkClick();
                if(this.focus) {
                    this.image = this.IMAGE2;
                    if(Space.touchEnd) this.func();
                } else this.image = this.IMAGE1;
            };
            
            Button.prototype.render = function () {
                this.x += Nature.camera.x;
                this.y += Nature.camera.y;
                Space.renderSprite(this, -10);
                this.x -= Nature.camera.x;
                this.y -= Nature.camera.y;
            };
            
            MiniMap = function (x, y, width, height, color, alpha) {
				Nature.Rectangular.call(this, x, y, width, height, color, alpha);
                this.window = new Nature.Rectangular(x,y,width,height,color,1);
            }

			MiniMap.prototype = Object.create(Nature.Rectangular.prototype);
            
            MiniMap.prototype.checkArea = function () {
                if(this.getEdge().left < Space.touchPos.X &&
                   this.getEdge().right > Space.touchPos.X &&
                   this.getEdge().top < Space.touchPos.Y &&
                   this.getEdge().bottom > Space.touchPos.Y)
                    return true;
                return false;
            };
            
            MiniMap.prototype.setMiniMap = function () {
                this.width = Nature.camera.maxx / 20;
                this.height = Nature.camera.maxy / 20;
                this.x = window.innerWidth - this.width / 2 - 1.5;
                this.y = window.innerHeight - this.height / 2 - 1.5;
                this.alpha = 0.2;
                this.setBorder(true,'out',1.5,'#FFF',1);
                this.window.width = window.innerWidth / 20;
                this.window.height = window.innerHeight / 20;
                this.window.alpha = 0;
                this.window.setBorder(true,'in',2,'#e8af2f',1);
                this.window.x = this.x - this.width / 2 + this.window.width / 2 + Nature.camera.x / 20;
                this.window.y = this.y - this.height / 2 + this.window.height / 2 + Nature.camera.y / 20;
                this.moveCamera();
            };
            
            MiniMap.prototype.renderObject = function () {
                for ( i in Blocks ) {
                    var tmp = new Nature.Rectangular(
                        Blocks[i].x/20 + this.x - this.width / 2 + Nature.camera.x,
                        Blocks[i].y/20 + this.y - this.height / 2 + Nature.camera.y,
                        Blocks[i].width / 20, Blocks[i].height / 20,'#39a55b',0.2);
                    tmp.setBorder(true, 'in', 1, '#FFF', 1);
                    Space.renderRectangular(tmp, -101);
                }
            };
            
            MiniMap.prototype.moveCamera = function () {
                if(this.checkArea() && Space.touching) {
                    this.window.x = Space.touchPos.X;
                    this.window.y = Space.touchPos.Y;
                    if(this.window.x < this.getEdge().left + this.window.width/2)this.window.x = this.getEdge().left + this.window.width/2;
                    if(this.window.y < this.getEdge().top + this.window.height/2)this.window.y = this.getEdge().top + this.window.height/2;
                    if(this.window.x > this.getEdge().right - this.window.width/2)this.window.x = this.getEdge().right - this.window.width/2;
                    if(this.window.y > this.getEdge().bottom - this.window.height/2)this.window.y = this.getEdge().bottom - this.window.height/2;
                    Nature.camera.x = (this.window.x - this.window.width/2 - this.getEdge().left)*20;
                    Nature.camera.y = (this.window.y - this.window.height/2 - this.getEdge().top)*20;
                } 
            };
            
            MiniMap.prototype.render = function () {
                this.x += Nature.camera.x;
                this.y += Nature.camera.y;
                this.window.x += Nature.camera.x;
                this.window.y += Nature.camera.y;
                Space.renderRectangular(this, -100);
                Space.renderRectangular(this.window, -102);
                this.x -= Nature.camera.x;
                this.y -= Nature.camera.y;
                this.window.x -= Nature.camera.x;
                this.window.y -= Nature.camera.y;
                this.renderObject();
            };
            
            miniMap = new MiniMap(400,400,0,0,'#F00',1);
            
            var ERASING = function () {
                if(checkBlockFocus()) eraseBlock(checkBlockFocus()-1);
            };
            var CREATING = function () {
                createBlock(50 + Nature.camera.x,100 + Nature.camera.y,100,100);
            };
            var DOWNLOADING = function () {
                outputJson();
            };
            Buttons = new Array();
            Buttons.push(new Button(Space.imageList['erase_off'], Space.imageList['erase_on'], 25, 25, 50, 50, ERASING, 'erase'));   
            Buttons.push(new Button(Space.imageList['create_off'], Space.imageList['create_on'], 75, 25, 50, 50, CREATING, 'create'));  
            Buttons.push(new Button(Space.imageList['download_off'], Space.imageList['download_on'], 125, 25, 50, 50, DOWNLOADING, 'download'));  
        }
        
        function userUpdate () {
            if(Space.keyboardState[Space.keyboard.w] == 'end') uploadJson();
            for (i in Buttons) Buttons[i].activate();
            manageScreen(20);
            dragRectangular();
        }
        
        function gameUpdate () {
            Nature.camera.activate();
            for (i in Blocks) Blocks[i].activate();
            miniMap.setMiniMap();
		}
        
        function render () {
            for (var i=0; i<Nature.camera.maxx/10; ++i) {
                if(Math.abs((i*10) - (Space.touchPos.X + Nature.camera.x)) <= 4) 
                    Space.renderLine([i*10,0,i*10,Nature.camera.maxy,1,'#eb3939',1],1000);
                else
                    Space.renderLine([i*10,0,i*10,Nature.camera.maxy,0.5,'#FFF',0.8],1000);
            }
            for (var i=0; i<Nature.camera.maxy/10; ++i) {
                if(Math.abs((i*10) - (Space.touchPos.Y + Nature.camera.y)) <= 4) 
                    Space.renderLine([0,i*10,Nature.camera.maxx,i*10,1,'#eb3939',1],1000);
                else
                    Space.renderLine([0,i*10,Nature.camera.maxx,i*10,0.5,'#FFF',0.8],1000);  
            }
            for (i in Blocks) Blocks[i].render();
            for (i in Buttons) Buttons[i].render();
            miniMap.render();
            if(TEMP)Space.renderRectangular(TEMP,-50);
        }
    
        //------personal function------//
    
        function createBlock (x, y, width, height) {
            Blocks.unshift(new Block(x,y,width,height,'#afafaf', 1));
        }
        function eraseBlock (index) {
            Blocks.splice(index,1);
        }
        function checkBlockFocus () {
            for (i in Blocks) if(Blocks[i].focus) return parseInt(i)+1;
            return false;
        }
        function eraseFocus () {
            for (i in Blocks) {
                Blocks[i].current = Blocks[i].focus = false;
            }
        }
        function arraySwap (array, x, y) {
            var a = array[x];
            array[x] = array[y];
            array[y] = a;
        }
        function outputJson () {
            var json = new Array();
            for ( i in Blocks ) {
                var tmp = {
                    x: Blocks[i].x,
                    y: Blocks[i].y,
                    width: Blocks[i].width,
                    height: Blocks[i].height,
                    type: 'normal'
                };
                json.push(tmp);
            }
            //console.log(JSON.stringify(json));
            var date = new Date();
            var blob = new Blob([JSON.stringify(json)], {type: 'text/plain;charset=utf-8'});
            saveAs(blob, date.getFullYear()+'_'+date.getMonth()+'_'+date.getDate()+'('+date.getHours()+'.'+date.getMinutes()+'.'+date.getSeconds()+').json');

        }
        function setArea (width, height) {
            if(width < 1500) width = 1500;
            if(height < 1000) height = 1000;
            Nature.camera.setBox(width, height);
        }
        function manageScreen ( speed ) {
            var e = speed || 10;
            var area = 10;
			if( Space.touchPos.X <= area ) 
				if( Space.touchPos.Y <= area ) 
					Nature.camera.addPos(-e, -e);
				else if( Space.touchPos.Y >= window.innerHeight - area )
					Nature.camera.addPos(-e, e);
				else
					Nature.camera.addPos(-e, 0);
			else if( Space.touchPos.X >= window.innerWidth - area )
				if( Space.touchPos.Y <= area ) 
					Nature.camera.addPos(e, -e);
				else if( Space.touchPos.Y >= window.innerHeight - area )
					Nature.camera.addPos(e, e);
				else
					Nature.camera.addPos(e, 0);
			else 
				if( Space.touchPos.Y <= area ) 
					Nature.camera.addPos(0, -e);
				else if( Space.touchPos.Y >= window.innerHeight - area )
					Nature.camera.addPos(0, e);
		} 
        function dragRectangular () {
            if(!checkBlockFocus() && Space.keyboardState[Space.keyboard.q] == 'start') dragFlag = true;
            if(!checkBlockFocus() && Space.keyboardState[Space.keyboard.q] == 'pressed' && dragFlag) {
                if(Space.touchstart) {
                    TEMP = new Block(Space.touchPos.X+Nature.camera.x,Space.touchPos.Y+Nature.camera.y,0,0,'#39a55b',0.2);
                    TEMP.setBorder(true,'in',1,'#FFF',1);
                    TEMP.startPos.mX = TEMP.x;
                    TEMP.startPos.mY = TEMP.y;
                } else if(Space.touching || Space.touchMove && TEMP && dragFlag) {
                    TEMP.x = (TEMP.startPos.mX + Space.touchPos.X + Nature.camera.x)/2;
                    TEMP.y = (TEMP.startPos.mY + Space.touchPos.Y + Nature.camera.y)/2;
                    TEMP.width = Math.abs(TEMP.startPos.mX - (Space.touchPos.X + Nature.camera.x));
                    TEMP.height = Math.abs(TEMP.startPos.mY - (Space.touchPos.Y + Nature.camera.y));
                } else if(TEMP && dragFlag) {
                    createBlock(TEMP.x,TEMP.y,TEMP.width,TEMP.height);
                    TEMP = false;
                    dragFlag = false;
                }
            } else if(TEMP && dragFlag) {
                createBlock(TEMP.x,TEMP.y,TEMP.width,TEMP.height);
                TEMP = false;
                dragFlag = false;
            }
        }
        function uploadJson () {
        }
    }
}());


 
