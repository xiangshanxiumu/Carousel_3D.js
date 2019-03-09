/**
 * @name Carousel_3D
 * @author xiangshanxiumu
 * @version 1.00
 */
(function ($, window, document, undefined) {
    $.fn.Carousel_3D = function (options) {
        //默认属性
        $.fn.Carousel_3D.defaults = {
            imgs: [],
            hrefs: [],
            curIndex: 0, //当前显示在中间的图片index
            autoPlay: true,
            interval: 3000,
            prevIndex: 0, //前一个图片index
            nextIndex: 0, //后一个图片index
            initIndex: 0, //回到初始位置图片index
            WIDTH: '1000px', //wrapBox 默认宽度
            HEIGHT: '350px', //wrapBox 默认高度
            direction: 'turnLeft' //默认运动方向
        }
        // 属性继承
        options = $.extend({}, $.fn.Carousel_3D.defaults, options || {})
        let { imgs, hrefs, curIndex, prevIndex, nextIndex, initIndex, interval, autoPlay, WIDTH, HEIGHT, direction } = options //属性解构赋值
        this.curIndex = curIndex
        this.prevIndex = prevIndex
        this.nextIndex = nextIndex
        this.initIndex = initIndex
        this.direction = direction
        //如果当前调用元素没有外部设置宽高 设置轮播外框wrapBox设置默认宽高
        if (this.height() == 0 || this.width() == 0) { //优先判断高度 块级元素占一行有默认宽度
            this.wrapBox = $('<div></div>').css({
                width: WIDTH,
                height: HEIGHT,
                position: 'relative'
            }).appendTo(this)
        } else {
            this.wrapBox = $('<div></div>').css({
                width: 'inherit',
                height: 'inherit',
                position: 'relative'
            }).appendTo(this)
        }
        //初始化创建轮播区域ul元素
        this.ul = $('<ul></ul>').css({
            width: 'inherit',
            height: 'inherit',
            'padding-bottom': '30px',
            position: 'relative',
            overflow: 'hidden',
            'box-sizing': 'border-box'
        }).appendTo(this.wrapBox)
        //初始化创建控制指示区域外框ul
        this.indication = $('<ul></ul>').css({
            position: 'absolute',
            width: 'inherit',
            height: '30px',
            left: '0px',
            bottom: '0px',
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'z-index': 4
        }).appendTo(this.wrapBox)
        //过渡时间计算
        transitionTime = (interval / 4000) + 's'
        //初始化创建控制指示区域 控制指示点li
        for (let i = 0; i < imgs.length; i++) {
            this.li = $('<li></li>').css({
                width: '10px',
                height: '10px',
                'border-radius': '50%',
                margin: '0px 10px',
                'list-style': 'none',
                'user-select': 'none',
                'background-color': '#5E6671',
                transition: 'all 1s linear',
                'transition-duration': transitionTime
            }).appendTo(this.indication)
        }
        //轮播图片显示区域外框的宽高
        this.wrapWidth = this.ul.width()
        this.wrapHeight = this.ul.height()
        // 初始创建元素时 初始宽高 以及定位的left top
        this.initLiWidth = this.wrapWidth / 4
        this.initLiHeight = this.wrapHeight / 2
        this.initLeft = this.wrapWidth * 3 / 8
        this.initTop = this.wrapHeight / 4

        //创建li 设置样式
        for (let i = 0; i < imgs.length; i++) {
            this.li = $('<li></li>').css({
                width: this.initLiWidth,
                height: this.initLiHeight,
                position: 'absolute',
                left: this.initLeft,
                top: this.initTop,
                overflow: 'hidden',
                'z-index': 1,
                'opacity': 0.25,
                'list-style': 'none',
                'user-select': 'none',
                'border-radius': '10px',
                transition: 'all ease',
                'transition-duration': transitionTime
            }).appendTo(this.ul)
            //创建a 设置样式
            this.a = $('<a></a>').css({
                width: 'inherit',
                height: 'inherit'
            }).attr({ 'href': hrefs[i], 'target': '_blank' }).appendTo(this.li)
            //创建img 设置样式
            this.img = $('<img>').css({
                width: 'inherit',
                height: 'inherit'
            }).attr({
                'src': imgs[i],
                'alt': imgs[i]
            }).appendTo(this.a)
        }
        let turnLeft = (curIndex) => {
            this.prevIndex = curIndex - 1 //根据this.curIndex计算prevIndex
            this.nextIndex = curIndex + 1 //根据this.curIndex计算nextIndex
            //prevIndex范围溢出判断重置
            if (curIndex == 0) {
                this.prevIndex = imgs.length - 1
            }
            //nextIndex范围溢出判断重置
            if (curIndex == imgs.length - 1) {
                this.nextIndex = 0
            }
            //计算initIndex 或initIndex 回到创建初始位置的index图片
            this.initIndex = this.prevIndex - 1
            ////initIndex范围溢出判断重置
            if (this.prevIndex <= 0) {
                this.initIndex = imgs.length - 1
            }
        }
        let turnRight = (curIndex) => {
            this.prevIndex = curIndex + 1 //根据this.curIndex计算prevIndex
            this.nextIndex = curIndex - 1 //根据this.curIndex计算nextIndex
            //prevIndex范围溢出判断重置
            if (curIndex == 0) {
                this.nextIndex = imgs.length - 1
            }
            //nextIndex范围溢出判断重置
            if (curIndex == imgs.length - 1) {
                this.prevIndex = 0
            }
            //计算initIndex 或initIndex 回到创建初始位置的index图片
            this.initIndex = this.prevIndex + 1
            ////initIndex范围溢出判断重置
            if (this.prevIndex >= imgs.length - 1) {
                this.initIndex = 0
            }
        }
        //查找所有的li元素
        this.imglis = $(this.ul).find('li') // this指代调用的元素
        /*初始化轮播函数initCarouselTurnLeft*/
        let initCarousel = (curIndex, initDirection) => {
            //初始化图片宽高位置
            this.initWidth = 0.25 * this.wrapWidth
            this.initHeight = 0.5 * this.wrapHeight
            this.initLeft = this.wrapWidth * 3 / 8
            this.initTop = this.wrapHeight / 4
            //当前显示图片宽高位置
            this.curWidth = this.wrapWidth / 2
            this.curHeight = this.wrapHeight
            this.curLeft = this.wrapWidth / 4
            this.curTop = 0
            //前一个图片、下一个图片宽高
            this.PrevWidth = this.nextWidth = 0.4 * this.wrapWidth
            this.prevHeight = this.nextHeight = 0.8 * this.wrapHeight
            if (initDirection == 'turnRight') {
                //前一个图片位置
                this.prevLeft = 0.6 * this.wrapWidth
                this.prevTop = 0.1 * this.wrapHeight
                //下一个图片位置
                this.nextLeft = 0
                this.nextTop = 0.1 * this.wrapHeight
            } else {
                //前一个图片位置
                this.prevLeft = 0
                this.prevTop = 0.1 * this.wrapHeight
                //下一个图片位置
                this.nextLeft = 0.6 * this.wrapWidth
                this.nextTop = 0.1 * this.wrapHeight
            }

            //回到创建初始位置样式
            $(this.imglis[this.initIndex]).css({
                position: 'absolute',
                width: this.initWidth,
                height: this.initHeight,
                left: this.initLeft,
                top: this.initTop,
                overflow: 'hidden',
                'z-index': 1,
                'opacity': 0.25,
            })
            //前一个图片样式
            $(this.imglis[this.prevIndex]).css({
                position: 'absolute',
                width: this.PrevWidth,
                height: this.prevHeight,
                left: this.prevLeft,
                top: this.prevTop,
                overflow: 'hidden',
                'z-index': 2,
                'opacity': 0.5,
            })
            //当前显示图片样式
            $(this.imglis[this.curIndex]).css({
                position: 'absolute',
                width: this.curWidth,
                height: this.curHeight,
                left: this.curLeft,
                top: this.curTop,
                overflow: 'hidden',
                'z-index': 3,
                'opacity': 1,
            })
            //下一个图片显示样式
            $(this.imglis[this.nextIndex]).css({
                position: 'absolute',
                width: this.nextWidth,
                height: this.nextHeight,
                left: this.nextLeft,
                top: this.nextTop,
                overflow: 'hidden',
                'z-index': 2,
                'opacity': 0.5,
            })
        }
        //指示点跟随图片函数
        this.points = $(this.indication).find('li')
        let indicationPoint = (curIndex) => {
            $(this.points[curIndex]).css({
                width: '30px',
                margin: '0px',
                'border-radius': '5px',
                'background-color': '#00AEFF'
            }).siblings().css({
                width: '10px',
                margin: '0px 10px',
                'border-radius': '50%',
                'background-color': '#5E6671'
            })
        }
        //事件触发后运动方向判断函数
        let Direction = (i, j) => {
            if (i == 0 && j == this.imglis.length - 1) {
                return 'turnLeft'
            } else if (i == this.imglis.length - 1 && j == 0) {
                return 'turnRight'
            } else if (i > j) {
                return 'turnLeft'
            } else if (i < j) {
                return 'turnRight'
            } else {
                return 'turnNo'
            }
        }
        /*turnleft左转运动*/
        this.moveLeft = (direction) => {
            turnLeft(this.curIndex)
            initCarousel(this.curIndex, direction)
            indicationPoint(this.curIndex)
        }
        /*turnright右转运动*/
        this.moveRight = (direction) => {
            turnRight(this.curIndex)
            initCarousel(this.curIndex, direction)
            indicationPoint(this.curIndex)
        }
        /*自动播放函数*/
        this.Play = (direction) => {
            this.timer = setInterval(() => {
                if (direction == 'turnRight') {
                    this.curIndex--
                    if (this.curIndex <= -1) {
                        this.curIndex = imgs.length - 1
                    }
                    this.moveRight(direction)
                } else {
                    this.curIndex++
                    if (this.curIndex >= imgs.length) {
                        this.curIndex = 0
                    }
                    this.moveLeft(direction)
                }

            }, interval)
        }
        /*停止播放函数*/
        this.stop = () => clearInterval(this.timer)
        /*事件*/
        this.event = () => {
            //鼠标移入停止轮播
            $(this).mouseenter(() => {
                this.stop()
            })
            //鼠标移出启动轮播
            $(this).mouseleave(() => {
                if (autoPlay) {
                    this.Play(this.direction) //this.direction初始设定的轮播方向
                }
            })
            //指示点点击事件
            this.points.each((k, item) => {
                $(item).click(() => {
                    let indicationDirection = Direction(k, this.curIndex)
                    direction = indicationDirection //运动方向
                    this.curIndex = k
                    if (direction == 'turnRight') {
                        this.moveRight(direction)
                    } else {
                        this.moveLeft(direction)
                    }
                })
            })
            //图片点击事件
            this.imglis.each((k, item) => {
                $(item).click((e) => {
                    e.preventDefault()
                    let imgDirection = Direction(k, this.curIndex)
                    direction = imgDirection //运动方向
                    this.curIndex = k
                    if (direction == 'turnRight') {
                        this.moveRight(direction)
                    } else {
                        this.moveLeft(direction)
                    }
                })
            })
        }
        //初始轮播方向判断
        if (this.direction == 'turnRight') {
            turnRight(this.curIndex)
        } else {
            turnLeft(this.curIndex)
        }
        initCarousel(this.curIndex, this.direction) //初始化图片
        indicationPoint(this.curIndex) //初始化指示点
        // 是否自动轮播判断
        if (autoPlay) {
            this.Play(this.direction)
        }
        //启动事件
        this.event()
        //返回调用元素
        return this
    }
})(jQuery, window, document, undefined);