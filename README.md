# 2020.1.6 开始

## 仿网易云小程序

##### （项目写完了，补充一下）

- 网上有很多仿网易云的，我去了解了一下，好像是有网课是从零开始教学仿网易云。不过这个课程要钱，所以我没看，我也不想看，因为项目是安卓的，而且ui很难看。我是完全按照目前的ios端的网易云小程序的ui写的这个项目，除了数据接口是用的一个大神的以外，其他的都是自己写的。

### 起步

- 下载微信开发者工具
- 在微信开发者网站注册个人开发
- 从头到尾熟悉一遍微信开发指南文档和微信官方文档

### 想法

- 之前用vue实现了一次网易云的移动端，从这个项目中踩了坑也学到了一些移动端的开发技巧，所以再来实现一次小程序，熟悉小程序开发
- 熟悉了一遍微信开发指南，发现微信小程序的框架实际上也是一个mvvm框架，入门比较简单
- 由于是入门小程序，所以使用原生框架

---



#### 由于疫情特殊情况，一个多月没更新这个，才回到工作地，继续做

---



### 踩坑记录

1. 如何使用ts编写微信小程序？

   答： 网上有相关的答案，但是有人说坑很多，建议用js编写微信小程序

2. wx.navigateTo不起作用

   答： 需要在app.json中添加跳转路径

3. 如何设置小程序分享

4. 复用wxss公共样式

   ```css
   @import 'css/color/wxss'
   ```

   如果在app.wxss文件中引入样式文件则在所有page页面可用，但component组件里不可用，需要单独在组件中引入。

5. image大小自适应

   答：mode有很多种选项，其中widthFix可以在宽度一定时自适应高度

6. 如何动态添加类？

   ```html
   <text class="num {{ index < 3 ? 'red' : '' }}">{{ index + 1 }}</text>
   ```

7. 真机调试本地接口？

   把本地接口的 'localhost'改成电脑对应的ip地址，如http://192.168.0.104:3000/

8. hidden不能跟block一起用，为什么？

9. 事件中怎么样带参数？

   自定义属性： data-*

10. wxml中动态添加背景图

    答： style="background-image: url('{{ playlist.coverImgUrl }}')"。 跟vue有区别，vue的写法：backgroundImage

11. 改变导航栏的样式

    答： 在页面json文件中添加"navigationStyle": "custom"， 自定义导航栏样式，这样的话左上角的返回按键等也需要自己写

12. 自定义导航栏样式时，我设置了全屏的背景图，这个背景图覆盖了所有其他内容，设置层级也没用

    解决方案： 不用全屏的背景图，把背景这部分的view单独提出来。用内容来撑开背景

13. 导航栏高度怎么计算？

    答： 导航栏分为状态栏和标题栏，状态栏高度可以通过系统信息中的statusBarHeight获取， 标题栏的高度为胶囊高度 + 2倍胶囊到状态栏的间距，胶囊到顶部的距离可以通过wx.getMenuButtonBoundingClientRect 获取，（注意兼容性）， 由此可以计算出来

    计算公式： 导航栏高度 = 胶囊按钮高度 + 状态栏到胶囊按钮间距 * 2 + 状态栏高度

    ps: 自定义导航栏这里的坑太多了，左上角的胶囊也需要自己写，调试的时候看到的样式跟真机预览看到的样式有一些像素差，不知道怎么回事。

14. 微信小程序中文字垂直居中的方法：

    1. ```html
       <view class='container'>
           这是个例子
       </view>
       ```

       ```css
       .container{
         border: 2rpx black solid;
         width: 400rpx;
         height: 200rpx;
         text-align: center;
         line-height: 200rpx;
       }
       ```

    2. ```html
       <view class='container'>
           <text>这是个例子</text>
       </view>
       ```

       ```css
       .container{
         border: 2rpx black solid;
         width: 400rpx;
         height: 200rpx;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
       }
       ```

       我的错误写法：

       ```html
       <text class="nav_title" style="top: {{ statusBarHeight }}px">
           {{ title }}
       </text>
       // text标签直接使用flex布局不会生效
       ```

       ```css
       .nav_title {
         display: flex;
         align-items: center;
         justify-content: center;
       }
       ```

15. 右上角胶囊的默认样式？

    这个暂时没有找到。。而且好像在不同的机型上面 胶囊的默认样式也不同。。

16. 在wxml中添加空格？ 

    html中添加空格是用编码实现的，&nbsp;&nbsp; `&nbsp;`，微信小程序中也可以这样，但是要在text标签中添加decode="true"。还有个方式是添加space="**"，有三个合法值： ensp, emsp,nbsp

17. 父组件的异步数据传给子组件，子组件在ready生命周期才能拿到这个数据？

    不一定。可以使用observers监听

18. 把一个大数字转换为万、亿和万亿为单位的数字

    ```javascript
    // 收听量数字转换
      transCount(count) {
        let param = {}
        let k = 10000
        let size = ['', '万', '亿', '万亿']
        if (count < k) {
          param.count = count
          param.unit = ''
        } else {
          let i = Math.floor(Math.log(count) / Math.log(k))
          param.count = (count / Math.pow(k, i)).toFixed(1)
          param.unit = size[i]
        }
        return param
      }
    ```

    

19. 微信小程序转发页面功能

    使用button按钮，open-type = 'share'

20. #### 2月16号 终于把导航栏做好了 而且跟网易云官方的效果一样  最难的地方是

    ![歌单截图](https://github.com/hemengke1997/music_wx/blob/master/images/jietu1.png)

    ​     往下滑的时候，顶部的背景图还是固定在那个位置。这里又有坑，微信小程序不兼容clip-path,只能用clip。

    ​	实现这种效果的方案：

    - 在导航栏组件中添加一个全屏背景图，在歌单页面也加同样的全屏背景图。由于背景图绝对定位，所以涉及到了层级关系。想让界面上滑的时候也显示导航栏背景，就需要把导航栏背景的层级设为最高，此时就需要裁剪背景，如果不裁剪，导航栏的全屏背景会覆盖整个界面。
    - 网易云的小程序中背景图是有filter的，我这种方案无法实现filter，因为有两个全屏背景，如果歌单的背景图设置了filter，那么导航栏的背景图也要设置filter，此时界面往下的时候会产生模糊

    这个效果卡了我四五个小时。。我也是醉了

    

21. 小程序page函数中自带了一些滚动触发、上拉触底事件，很方便实现懒加载



##### 题外话

- 现在是2月17号的凌晨三点半，又写到了这个时候了。。今天白天我做了一个理智却又冲动的决定，我裸辞了。唉... 以后还有那么久的工作时间，我觉得找份自己喜欢的工作 喜欢的公司 活得更快乐





##### 开始写放歌的界面，在写之前思考了整体思路，之前是边想边写，所以wx.request请求是每次都写了的。太麻烦了，这次打算把请求的api抽离出来成一个接口，只需要传入相应的url和回调函数就可以了



22. 背景图不能设置本地图片，需要把本地图片路径转为base64位才能作为background-image

    方案： 

    ```javascript
    wx.getFileSystemManager().readFile({
          filePath: '/assets/imgs/bsb.jpg',
          encoding: 'base64',
          success: res => {
            console.log(res)
          },
          fail: res => {
            console.log(res, 'fail')
          }
        })
    // 注意使用绝对路径
    ```

    

23. 想到了更好的方案处理沉浸模式，就是第20项说的那个问题，可以让内容绝对定位，给内容一个top，不需要设置两个背景啦，要注意page: overflow: hidden ，然后给需要滚动的内容加overflow-y: auto; 这个方案是我目前能想出最完美的方案了，开心！！

    效果图

    ![播放界面截图](https://github.com/hemengke1997/music_wx/blob/master/images/jietu2.png)





#### 项目截图

![首页](https://github.com/hemengke1997/music_wx/blob/master/images/index.png)



![搜索界面](https://github.com/hemengke1997/music_wx/blob/master/images/search_index.png)



![搜索结果](https://github.com/hemengke1997/music_wx/blob/master/images/search_result.png)



![榜单](https://github.com/hemengke1997/music_wx/blob/master/images/bangdan.png)



![榜单分享](https://github.com/hemengke1997/music_wx/blob/master/images/bangdan_1.png)



![滚动歌词](https://github.com/hemengke1997/music_wx/blob/master/images/song_1.png)



![相似歌曲](https://github.com/hemengke1997/music_wx/blob/master/images/song_2.png)



![歌曲评论](https://github.com/hemengke1997/music_wx/blob/master/images/song_3.png)



![项目路径](https://github.com/hemengke1997/music_wx/blob/master/images/xiangmu.png)

#### 结语

- 完结撒花了 T>T 。大概跟现在的ios微信小程序的用户体验一样
- 第一次写一个完整的微信小程序，思路不清晰，最开始有很多网络请求，样式，都没有封装，组件模板用得也不多
- 体会最深的是封装导航栏， 整体的沉浸模式，解决方案再说一次，内容绝对定位，距离顶部一定的高度，overflow-y:auto，page overflow:hidden



#### 2/29补充

现在在自学react，其文档中有介绍列表渲染，解释了为什么要在列表渲染中添加key，并且强调这个**key**最好不是索引index。我突然想到，我以前写代码列表渲染几乎都是用的索引来当做key

> 如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题。

react文档中是这样说的。mvvm框架的原理应该都差不多，我去查阅了微信小程序官方文档，是这样解释wx:key的

> ### wx:key
>
> 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 [input](https://developers.weixin.qq.com/miniprogram/dev/component/input.html) 中的输入内容，[switch](https://developers.weixin.qq.com/miniprogram/dev/component/switch.html) 的选中状态），需要使用 `wx:key` 来指定列表中项目的唯一的标识符。
>
> `wx:key` 的值以两种形式提供
>
> 1. 字符串，代表在 for 循环的 array 中 item 的某个 property，该 property 的值需要是列表中唯一的字符串或数字，且不能动态改变。
> 2. 保留关键字 `*this` 代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字，如：
>
> 当数据改变触发渲染层重新渲染的时候，会校正带有 key 的组件，框架会确保他们被重新排序，而不是重新创建，以确保使组件保持自身的状态，并且提高列表渲染时的效率。
>
> **如不提供 wx:key，会报一个 warning， 如果明确知道该列表是静态，或者不必关注其顺序，可以选择忽略。**

虽然没有显式说不能使用索引来当做key，但是也没有提供这种方式，所以还是应该用当前item中的某个唯一属性来作为key。

我又查询了vue的官方文档：

>`key` 的特殊属性主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。
>
>有相同父元素的子元素必须有**独特的 key**。重复的 key 会造成渲染错误。

其文档也没有显式说明不能使用索引作为key，但是也没推荐使用索引作为key，综上所述，根据react的说明，列表渲染的key不应该使用索引，这对性能有消耗。



深入了解了key的作用，它是为了提升DOM的diff算法的效率。这个算法比较复杂，简单来说就是当一个节点被插入时，如果没有绑定key，就会一个一个去遍历，然后再插入，这个就像队列这种数据结构了，但是加了key属性，就好像链表这种数据结构，插入删除效率很高。这是我暂时的理解，我对diff算法一直处于懵逼状态