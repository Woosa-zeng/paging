/**
 * Created by zengping on 2017/7/7 0007.
 */

function SetPaging(pageSize,totalCount,currPage,parentId){
  this.parentId = parentId;
  this.pageSize = pageSize;
  this.totalCount = totalCount;
  this.currPage = currPage;
  this.totalPage = 1;
  //已经画过div页码框的次数
  this.hasWriteSize = 0;
  //每页最多可画div页码框的个数
  this.maxSize = 10;
  this.checkShowPage(currPage);
  this.cleckEvent();
  //调用方法时，要看是否需要去画div页码框
}
SetPaging.prototype = {
  cleckEvent:function(){
    var parentId = $('#' + this.parentId);
    var page = parentId.find('.pageNumDiv');
    var homePage = parentId.find('.homePage');
    var prePage = parentId.find('.prePage');
    var nextPage = parentId.find('.nextPage');
    var endPage = parentId.find('.endPage');
    var goPageNum = parentId.find('.goPageNum');
    var number = 1;
    var pageCode;
    var that = this;
    $(homePage).on('click',function(){
      that.goToPage('homePage')
    })
    $(prePage).on('click',function(){
      that.goToPage('prePage')
    })
    $(nextPage).on('click',function(){
      that.goToPage('nextPage')
    })
    $(endPage).on('click',function(){
      that.goToPage('endPage')
    })
    $(page).on('click','a',function(){
      pageCode = parseInt($(this).text());
      that.goToPage(pageCode);
    })
    $(goPageNum).on('keyup',function(){
      number = $(this).val();
      if(number){
        that.checkGoPageNum(number);
      }
    }).on('blur',function(){
      if(parseInt(number) != that.currPage){
        that.goToPage('goPageNum')
      }
    })
  },
  checkShowPage: function(pageNum) {
    if(this.totalCount > 0 && this.totalCount != null) {
      this.totalPage = Math.ceil(this.totalCount / this.pageSize);
      if(pageNum <= 0 || this.totalPage <= 0 || pageNum > this.totalPage) {
        $('#' + this.parentId).find(".totalPageNum").text('');
        this.checkGoPageNum(pageNum);
        return false;
      } else {
        this.createDivPageFrame(pageNum);
        $('#' + this.parentId).find(".totalPageNum").text(this.totalPage);
      }
    } else {
     $('#' + this.parentId).hide();
    }
  },
  showPageDiv: function(pageNum){
    if(pageNum == 1 && this.totalPage == 1) { //有且只有一页
      $('#' + this.parentId).hide();
    } else if(pageNum == 1 && this.totalPage != 1) {//首页，第一页  上一页和首页不显示
      $('#' + this.parentId).find(".homePage").hide();
      $('#' + this.parentId).find(".prePage").hide();
      $('#' + this.parentId).find(".nextPage").show();
      $('#' + this.parentId).find(".endPage").show();
    }else if(pageNum != 1 && this.totalPage != 1 && this.totalPage != pageNum) { //中间页 全部显示
      $('#' + this.parentId).find(".pageDiv").show();
      $('#' + this.parentId).find(".homePage").show();
      $('#' + this.parentId).find(".prePage").show();
      $('#' + this.parentId).find(".nextPage").show();
      $('#' + this.parentId).find(".endPage").show();
    } else if(pageNum != 1 && this.totalPage == pageNum) {//尾页，最后一页  下一页和尾页不显示
      $('#' + this.parentId).find(".homePage").show();
      $('#' + this.parentId).find(".prePage").show();
      $('#' + this.parentId).find(".nextPage").hide();
      $('#' + this.parentId).find(".endPage").hide();
    }
  },
  createDivPageFrame: function(pageNum) {
    this.showPageDiv(pageNum);
    //跳页 从最中间显示
    this.hasWriteSize = pageNum - 5;
    //是否在最前面几页
    if(this.hasWriteSize == 0) {
      this.hasWriteSize = this.hasWriteSize - 0;
    } else if(this.hasWriteSize < 0) { //小于10页
      this.hasWriteSize = this.hasWriteSize - this.hasWriteSize;
    } else if((this.totalPage - this.hasWriteSize) < this.maxSize) { //是否在最后面几页
      this.hasWriteSize = this.hasWriteSize - (this.maxSize -(this.totalPage - this.hasWriteSize));
      if(this.hasWriteSize < 0) {
        this.hasWriteSize = this.hasWriteSize - this.hasWriteSize;;
      }
    }
    //新画页数
    var newWriteSize = 0;
    var thisPageNumDiv = $('#'+this.parentId).find(".pageNumDiv");
      thisPageNumDiv.html("");
    for(var i = 1; i <= this.maxSize;i++) {
      newWriteSize = this.hasWriteSize + i;
      thisPageNumDiv.append("<li><a class=\"goPage"+newWriteSize+"\" href=\"javascript:void(0);\">"+newWriteSize+"</a></li>");
      //当前页不显示a标签可点的样式
      if(pageNum == newWriteSize) {
        this.removeHref("goPage"+pageNum);
      }
      if(newWriteSize == this.totalPage) { //已经画过div页码框的次数 超过总页数就不去画了
        return false;
      }
    }
  },
  goToPage: function(id) {
    if(typeof this.currPage == 'string'){
      this.currPage = parseInt(this.currPage)
    }
    //console.log(typeof this.currPage)
    if(id == "homePage") {
      this.currPage = 1;
    } else if(id == "endPage") {
      this.currPage =  parseInt(this.totalPage);
    } else if(id == "prePage") {
      this.currPage = parseInt(this.currPage) - 1;
    } else if(id == "nextPage") {
      this.currPage = parseInt(this.currPage) + 1;
    } else if(id == "goPageNum") {
      this.currPage = $('#' + this.parentId).find("."+id).val();
      if(this.currPage == "") {//输入为空不跳转
        return false;
      }
    } else {
      this.currPage = id;
    }
    this.setValue(this.currPage);
    this.createDivPageFrame(this.currPage);
    /*跳转到下一页函数*/
  },
  setValue: function(pageId){
    $('#'+this.parentId).find('.currPage').val(pageId);
    $('#'+this.parentId).find('.goPageNum').val(pageId);
  },
  removeHref: function(id) { //动态去除A标签的href属性
    $('#'+this.parentId).find("."+id).removeAttr("href","javascript:void(0);");
    $('#'+this.parentId).find("."+id).removeAttr("onClick","return false;");
    $('#'+this.parentId).find("."+id).addClass("on");
    $('#'+this.parentId).find("."+id).css("cursor","default");
  },
  checkGoPageNum: function(pageNum){ //检查跳页是否大于总页数
    //验证输入首字段不能是0
    $('#' + this.parentId).find(".goPageNum").attr("value",pageNum.substring(0,1) == '0' ? pageNum = 1 : pageNum = pageNum);
    if(pageNum > this.totalPage) {
      $('#' + this.parentId).find(".goPageNum").attr("value",this.totalPage);
    }

  }
};




