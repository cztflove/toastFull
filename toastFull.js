/**
 * 
 * @cchen
 * @date    2017-02-25 
 * @version 1.0
 * @plugin Toast
 */
;(function(root,factory){
	root.toastFull = factory();

})(window,function(){
	var toastFull = function(options){
		this.opt = {};
		this.opacity=0;
		this.raf='';
		this.st='';
		this.status = 0;
		this.loadingEle = null;
		this.winH = document.body.clientHeight/2-20;
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
		this.extend(options);
	};
	toastFull.prototype = {
		extend: function(options){
			var defaults = {
				textColor: '#fff',
				timer: 2000   //toast停留时间
			};
			var key;
			for(key in options){
				var defaultVal = defaults[key];
				var optionVal = options[key];
				if(optionVal == defaultVal){
					continue;
				}
				else if(optionVal !== undefined){
					defaults[key] = optionVal;
				}
				
			}
			this.opt = defaults;

		},
		
		fadeIn:function(newToast,type){
			var _this = this;
			_this.opacity+=.1;
			newToast.style.opacity = _this.opacity;
			if(_this.opacity<1 && _this.status==0 ){
				_this.raf = requestAnimationFrame(function(){
					_this.fadeIn(newToast,type);
				});
			}
			else{
				cancelAnimationFrame(_this.raf);
				if(type == 1){
					_this.st = setTimeout(function(){
						_this.raf = _this.fadeOut(newToast);
					},_this.opt.timer);
				}
			}
		},
		fadeOut:function(newToast){
			var _this = this;
			_this.opacity-=.1;
			_this.status = 1;
			newToast.style.opacity = _this.opacity.toFixed(2);
			if(_this.opacity>0){
				requestAnimationFrame(function(){
					_this.raf = _this.fadeOut(newToast);
				});
			}
			else{
				cancelAnimationFrame(_this.raf);
				newToast.style.zIndex = -99;
			}

		},
		createEntity: function(msg,timer,type){
			 var _this = this;
			 var idNum = Math.random().toString().replace('.', '');
			 var toastId = 'toast'+idNum;
			 var body = document.getElementsByTagName('body')[0];
			 var newToast = document.createElement("div");
			 var posY='0';
			 _this.status = 0;
			 if(typeof(timer) == 'number'){
			 	this.opt.timer = timer;
			 }
			 if(type ==1){
			 	var box = document.createElement("div");
			 	box.setAttribute('style','position:absolute;top:50%;left:50%;padding:10px;max-width:280px;border-radius:5px;text-align:center;background-color:rgba(0,0,0,0.7);webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);');
			 	box.innerHTML = '<img src="images/toast-error.png" style="margin:5px auto;display:block;width:35px;">'+msg;
			 	newToast.appendChild(box);
			 } 
			 else if(type == 2){
				var box = document.createElement("div");
				box.setAttribute('style','position:absolute;top:50%;left:50%;padding:10px 15px;max-width:280px;border-radius:5px;text-align:center;background-color:rgba(0,0,0,0.7);webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);');
			 	box.innerHTML = '<img src="images/hourglass.svg" style="margin:5px auto;display:block;width:35px;">'+msg;
				newToast.appendChild(box);
			 }
			 newToast.id = toastId;  //设置id
			 newToast.className = 'cToast';
			 
		 	 newToast.setAttribute('style','position:fixed;top:0;left:0;font-size:14px;background-color:rgba(0,0,0,0);color:'+_this.opt.textColor+';opacity:0;width:100%;height:100%;text-align:center;z-index:1000;');
			 body.appendChild(newToast);
		
			 return newToast;
			
		},
		alert: function(msg,timer){
			 var _this = this;
			 if(document.getElementsByClassName('cToast').length>0){
			 	var someToasts = document.getElementsByClassName('cToast');
			 	someToasts[0].parentNode.removeChild(someToasts[0]);
			 	cancelAnimationFrame(_this.raf);
			 	clearTimeout(_this.st);
			 	_this.opacity = 0;
			 }
			 var newToast = _this.createEntity(msg,timer,1);
			 requestAnimationFrame(function(){
			 	_this.raf = _this.fadeIn(newToast,1);
			 });
		},
		loadStart: function(msg){
			var _this = this;
			if(document.getElementsByClassName('cToast').length>0){
				var someToasts = document.getElementsByClassName('cToast');
			 	someToasts[0].parentNode.removeChild(someToasts[0]);
			 	cancelAnimationFrame(_this.raf);
			 	clearTimeout(_this.st);
			 	_this.opacity = 0;
			 }
			var newToast = _this.createEntity(msg,'',2);
			requestAnimationFrame(function(){
			 	_this.raf = _this.fadeIn(newToast,2);
			});
			_this.loadingEle = newToast;
		},
		loadFinishSuccess: function(msg){
			var _this = this;
			_this.loadingEle.style.left = '0'; 
			_this.loadingEle.firstChild.innerHTML = '<img src="images/toast-success.png" style="margin:5px auto;display:block;width:35px;">'+msg;
			setTimeout(function(){
				_this.raf = _this.fadeOut(_this.loadingEle);
			},1000);
		},
		loadFinishError: function(msg){
			var _this = this;
			_this.loadingEle.style.left = '0'; 
			_this.loadingEle.firstChild.innerHTML = '<img src="images/toast-error.png" style="margin:5px auto;display:block;width:35px;">'+msg;
			setTimeout(function(){
				_this.raf = _this.fadeOut(_this.loadingEle);
			},1000);
		}

	};
	return toastFull;
});