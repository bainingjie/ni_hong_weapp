Component({
    /**
     * 组件的初始数据
     */
    data: {
      bottom_tabs_active_index: '',
      list: [{
          icon: 'send-gift-o',
          text: '精选商城',
          url: '/pages/productList/index'
        },
        {
          icon: 'logistics',
          text: '集运',
          url: '/pages/index/index'
        },
        {
          icon: 'contact',
          text: '我的',
          url: '/pages/myPage/index'
        }
      ]
    },
  
    /**
     * 组件的方法列表
     */
    methods: {
      onChange(event) {
              // this.setData({ active: event.detail });
              wx.switchTab({
                  url: this.data.list[event.detail].url
              });
          },
      init() {
              const page = getCurrentPages().pop();
              this.setData({
                bottom_tabs_active_index: this.data.list.findIndex(item => item.url === `/${page.route}`)
              });
          }
  
    }
  })