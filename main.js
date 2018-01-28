
/*
1- 错误 this.ct = $ct
 正确 this.$ct = $ct

2- 构造函数的公共容器里面 多个对象 应该用逗号隔开

3- getImgUrls获取的只是 图片的URL开发人员是无法通过一个链接得知请求到的图片宽高是多少的




*/



$(function () {


  function Barrel($ct) {
   //把容器存好
   this.$ct = $ct

   // 基准高度 100
   this.baseHeight = 100
   // this.imgNum = 10
   // 行数组
   this.rowList = []
   this.laodImg()


  }
  Barrel.prototype = {
    laodImg: function(){
      var imgs = this.getImgUrls(20)
      // 保存this 让存的这个this指向最初的调用大容器 ..... 为什么这个this 不用 这样 $(this)  写呢？
      var _this = this
      //原错误写法 imgs.each(function(index, url) {})
      $.each(imgs,function(index, url) {
        // each的第二个参数 就是遍历的每个元素本身 其实也就是 每个图片的url 所以为了方便看着顺眼 就 直接改名url
        //  创建每张图片的对象
        var img = new Image()
        img.src = url
        img.onload = function () {
          // 获取原始原始宽高 算出原始宽高比
          var originalWidth = img.width,
              originalHeight = img.height
              ratio = originalWidth/originalHeight
          // 这儿 不怎么懂 新的图片宽高 出炉啦
          var imgInfo = {
            // 因为是 dom对象 所以要用 $ 包裹一下
            targent: $(img),
            width: _this.baseHeight*ratio,
            height: _this.baseHeight
          }
          _this.render(imgInfo)
        }

      });
    },

// 获取图片完成，加载图片完成算出了每张图片缩减的宽高比 算完就该渲染啦

/*
  1. 每列以固定宽高显示,执行判断-->看有没有塞满一排
  2. 当 rowList宽度 > 父容器宽度时那么就把队列中最后一张去掉，接着「等比放大」之前的那几张图片，塞满整行
  3. 重新生成下一个rowList
 */
    render:function (imgInfo) {
      // 大容器的this存下来
      var _this = this
      // 把大容器的宽度弄过来 到时候还得做判断
      var contWidth = this.$ct.width()
      // 装载图片的总行宽初始值为0
      var rowWidth = 0
      //  把大容器里面 定义的 数组 弄过来
      var rowList = this.rowList

      var lastImgInfo = imgInfo

      rowList.push(imgInfo)
      $.each(rowList,function(index,imgInfo) {
        rowWidth += imgInfo.width
        if (rowWidth > contWidth) {
          //  把数组中最后一个 弄出来 接着用等比例方法图片的方法
          rowList.pop()
          // 消除了最后一个 那么要计算下现在的整体宽度是多少
          rowWidth = rowWidth - lastImgInfo.width

          newRowHeight = _this.baseHeight*contWidth/rowWidth

         /*
         把最后一张超出宽度的图片pop掉之后 那么 现在的rowList宽度是适合的了已经 但是没有放满整行 要用「layout」 方法等
         比放大充满整个大容器宽度
         */
          _this.layout(newRowHeight)
          //等比layout之后 那就清空现在的数组
          _this.rowList = []
          //清空之后 继续渲 之前那个宽度超标的图片 在接着放。。
          _this.rowList.push(lastImgInfo)
        }



      });

      // 遍历数组 计算整个rowList的宽度
    },
    layout:function(newRowHeight){
      // 这是一行
      var $rowCt = $('<div class="img-row"></div>')

      $.each(this.rowList,function(index, imgInfo) {
        //  这是一个图片的容器
        var imgCt = $('<div class="img-box"></div>')
        $img = imgInfo.targent
        $img.height(newRowHeight)
        imgCt.append($img)
        $rowCt.append(imgCt)
      });
      this.$ct.append($rowCt)
    },


// 获取图片的方法
    getImgUrls: function(num) {
      var color,
          width,
          height,
          urls = [],
          numLength = num;
 	  	for(var i=0; i<numLength; i++){
 	  		color = Math.random().toString(16).substring(2, 8)
 	  		width = Math.floor(Math.random()*100+50)
 	  		height = Math.floor(Math.random()*30+50)
 	  		urls.push('http://placehold.it/'+width+'x'+height+'/'+color+'/fff')
 	  	}
 	  	return urls
    }




  }


// 创建构造函数 相当于启动图纸开始生产


  var barrel = new Barrel($('.img-preview'))








})
