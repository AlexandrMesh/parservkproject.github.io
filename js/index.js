// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    searchGroup: String,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    fullimg: function(src_img) {
      var cssValues = {
        "display":"flex",
        "width":"100%",
        "height":"100vh"
    }
      $('.popup_wrapper').css(cssValues);
      $('.popup_img').attr('src', src_img);
      setTimeout("$('.popup_wrapper').addClass('active')", 100);
    },

    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
})

// bootstrap the demo
var demo = new Vue({
  el: '#demo',
  data: {
    searchQuery: '',
    searchGroup: '',
    selecteds: '10',
    gridColumns: ['date', 'content', 'media', 'likes', 'reposts', 'comments'],
    gridData: [
      
    ]
  },
  methods: {
    popup_exit: function() {
      console.log(11);
      
      $('.popup_wrapper').removeClass('active');
      
    },
    fetchData: function () {
      var apidomain = this.searchGroup;
      var apicount = this.selecteds;
      var apiURL = 'https://api.vk.com/method/wall.get?domain=' + apidomain + '&count=' + apicount + '&access_token=5b1ef2785b1ef2785b1ef278bc5b43038e55b1e5b1ef2780285f95f22a70e323207a0ec&v=V'
      var c = [];
      $('.container').css('display', 'flex');
      $.ajax({
            url: 'https://api.vk.com/method/groups.getById?group_ids=' + apidomain + '&access_token=5b1ef2785b1ef2785b1ef278bc5b43038e55b1e5b1ef2780285f95f22a70e323207a0ec&v=V', 
            dataType: 'jsonp', 
            success: function(result2){
              $('.group_info').remove();
              $('#search').before('<div class="group_info"><div class="group_ava"><img src="' + result2.response[0].photo_medium + '"></div><div class="group_name">' + result2.response[0].name + '</div></div>');
              
               $.ajax({
                url: apiURL, 
                dataType: 'jsonp', 
                success: function(result){
                    
                    $('.container').hide();
                    $('.table_content').hide();
                    $('#search').hide();
                    var d = result;
                    if (!result.error) {
                      $('.table_content').show();
                      $('#search').show();
                    }

                    $('.error').remove();
                    if (result.error) {
                      $('.table_content').after('<div class="error">Ошибка! Попробуйте изменить параметры поиска!</div>');
                      return;
                    }
                    var response_photo
                    
                    for (var i = 1; i < d.response.length; i++) {
                      
                        if (typeof d.response[i].attachment != 'undefined') {
                          if (typeof d.response[i].attachment.photo != 'undefined') {
                            if (typeof d.response[i].attachment.photo.src_xxbig != 'undefined') {
                              response_photo = d.response[i].attachment.photo.src_xxbig
                            }else{
                              response_photo = 'https://linkdeli.com/img/no-image.jpg';
                            }
                          }
                        }
                            var newdate = new Date(1000*d.response[i].date);
                            var options = {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric'
                            };

                            var formatdate =  newdate.toLocaleString("ru", options);
                            c.push({date: formatdate, content: d.response[i].text, media: response_photo, likes: d.response[i].likes.count, reposts: d.response[i].reposts.count, comments: d.response[i].comments.count});
                        
                        
                        
                    }
                    
              }});
            }});
     
      this.gridData = c;
    }
  }
})