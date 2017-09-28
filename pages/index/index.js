//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    title_pages: [],
    current_page: 0,
    btnOpacity: 1,
  },
  onLoad: function () {
    // 请求文章列表
    let pages = this.data.title_pages
  
    var title_page = {
      p_title: "阿里巴巴发布 AliOS 品牌，重兵投入汽车及 loT 领域",
      p_subTitle: "这是一个副标题",
      p_imgUrl: 'http://ollhjbg6f.bkt.clouddn.com/header.jpg',
      p_date: "9月26日",
      p_vol: "1"
    }

    var i;
    for (i=0;i<10;i++){
      pages.push(title_page)
    }
    this.setData({
      title_pages: pages
      })
  },
  searchBtnPressed: function(e) {
    
      this.setData({
        btnOpacity: 0.4
      })
    
  },

  navigateToRead: function(e) {
    wx.navigateTo({
      url: '/pages/read/read',
    })
  }
})
