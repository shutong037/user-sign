  export const _ = {
    // 根据QueryString参数名称获取值
    getQueryValue: function (key) {
        let result = location.href.match(new RegExp("[\?\&]" + key + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    /* 验证手机号*/
    regTel: function (val) {
      let telReg = /^[1][3456789][0-9]{9}$/;
      return telReg.test(val);
    },
    setCookie: function (name, value, val) {
      let exdate = new Date();
      if(val == undefined){
        exdate.setDate(exdate.getDate() + 1);
      }else{
        exdate.setTime(exdate.getTime() + 60 * 1000 * val);
      }
      document.cookie = name + "=" + value + ((1 == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;";
    },
    getCookie: function (key) {
      let cookies = document.cookie;
      let result = cookies.match(new RegExp(key + "=([^\;]+)", "i"));
      if (result == null || result.length < 1) {
          return "";
      }
      return result[1];
    }
  }
