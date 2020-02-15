# 2020.1.6 开始

## 仿网易云小程序

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

