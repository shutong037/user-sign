<template>
  <div class="wealth">
    <button type="default" class="wealth_btn" :class="{'active':isActive == 1}" @click="receive"></button>
    <!-- 弹窗 -->
    <van-popup v-model="show" class="popup-box" position="center"  round :close-on-click-overlay="false">
        <div class="inspect" v-show="stepNum == -1">
          <img class="inspect-img" src="../assets/phone.png" alt="">
          <p class="inspect-txt">身份验证</p>
          <van-cell-group class="inspect-info">
            <van-field v-model="phone"  class="phone" :class="{'iptActive':validatePhone == 1}"  label="+86" center label-width="50px"  @focus="validatePhone = 0"  border maxlength="11" placeholder="请输入您的手机号" />
            <p v-show="validatePhone == 1" class="tip-txt">请输入正确的手机号码</p>
            <p v-show="validatePhone == 0" class="tip-txt2"></p>
            <van-field
              v-model="verificationCode"
              center
              clearable
              border
              class="code"
              maxlength="6"
              label=""
              @focus="validateCode = 0"
              :class="{'iptActive':validateCode == 1}"
              placeholder="请输入验证码"
            >
            <template #button>
              <van-button size="small" :disabled="disabledCode" class="code-btn" :class="{'code-btn2':validateBtn == 1}"   @click="getCode"  type="default">{{codeBtnTxt}}</van-button>
            </template>
            </van-field>
             <p v-show="validateCode == 1" class="tip-txt">请输入正确的验证码</p>
             <p v-show="validateCode == 0" class="tip-txt2"></p>
          </van-cell-group>
          <van-button type="default"  class="cancel"  @click="cancel"  size="normal">暂不领取</van-button>
          <van-button type="default"  class="define" @click="define"  size="normal">确定</van-button>
        </div>
        <div class="success" v-show="stepNum != -1">
            <div class="flash"></div>
            <div class="card warn"></div>
        </div>
    </van-popup>
  </div>
</template>

<script>
  import { _ } from "@/utils/common";
  import { Popup, Toast, Dialog, Notify } from 'vant';
  import { getCurrentStep, loginInfo, getCode, inspectCode  } from '@/api/login'

  export default {
    name: 'Wealth',
    data(){
      return {
        isActive: 0,
        show: false,
        code: null,
        stepNum: 0,
        phone: null,
        verificationCode: null,
        disabledCode: false,
        validatePhone: 0,
        validateCode: 0,
        codeBtnTxt: '发送验证码',
        countdown: 60,
        validateBtn: 0,
        wxKey: null
      }
    },
    mounted() {
      this.init();
      let code = _.getQueryValue("code");
      let wxKey = _.getCookie("wxKey");
      let toke = _.getCookie("Access-Token");
      this.code = code
      if(code && toke == "" && wxKey == ""){
        this.userLogin()
      }
    },
    methods:{
      init() {
        this.isActive = this.isActive === 0 ? 1 : 0
        setTimeout(() => {this.init()}, 300);
      },
      userLogin() {
        loginInfo(this.code).then((res) => {
          if(res.data.token){
            _.setCookie('Access-Token', res.data.token)
            this.getStep()
          }else{
            this.stepNum = -1
            this.wxKey = res.data.wxKey
            this.show = true
          }
        })
      },
      getStep() {
        Toast.loading({
          message: '登录中...',
          forbidClick: true,
          duration: 0,
        });
        getCurrentStep().then((res) => {
          Toast.clear();
          this.stepNum = parseInt(res.data.stepNum)
          this.show = true
        })
      },
      getCode() {
        if(!this.disabledCode){
          if(_.regTel(this.phone)){
            getCode(this.phone).then((res) => {
                if(res.code == 200){
                  this.disabledCode = true
                  this.setTimeVal()
                  Notify({ type: 'success', message: '验证码已发送至手机,请注意查收!' });
                }
            })
          }else{
            this.validatePhone = 1
          }
        }
      },
      receive() {
        let wxKey = _.getCookie('wxKey');
        if(wxKey){
          this.stepNum = -1
          this.show = true
        }else{
          this.getStep()
        }
      },
      setTimeVal() {
        if (this.countdown == 0) {
            this.codeBtnTxt = '获取验证码'
            this.validateBtn = 0
            this.countdown = 60
            this.disabledCode = false
            return;
        } else {
            this.codeBtnTxt =  this.countdown+ '秒后重新获得'
            this.validateBtn = 1
            this.countdown--
        }
        setTimeout(() => {
           this.setTimeVal();
        },1000);
      },
      cancel() {
        this.show = false
        this.countdown = 0
        _.setCookie('wxKey', this.wxKey)
        this.phone = ''
        this.verificationCode = ''
      },
      define() {
        if(this.phone == ""){
          this.validatePhone = 1
          return
        }
        if(this.verificationCode == ""){
          this.validateCode = 1
          return
        }
        inspectCode({acChannel: 1,acTerminalType: 4,phone: this.phone,verifyCode: this.verificationCode,wxKey: this.wxKey}).then((res) => {
            if(res.code === 200 && res.data){
              this.stepNum = 0
              this.show = true
              _.setCookie('wxKey', '', -1);
              _.setCookie('Access-Token', res.data.token)
            }
        })
      }
    }
  }
</script>

<style scoped="scoped">
  .wealth{
    width: 3.9rem;
    height: 2.32rem;
    padding-top: 6.12rem;
    background: url(../assets/bg.jpg) no-repeat center center/100% 100%;
  }
  .wealth_btn{
    width: 3rem;
    height: 1.34rem;
    border: none;
    outline: none;
    background: url(../assets/wealth_btn.png) no-repeat center bottom/100% 100%;
  }
  .active{
    width: 3rem;
    height: 1.34rem;
    background: url(../assets/wealth_btn2.png) no-repeat center bottom/3rem 1.24rem;
  }
  .popup-box{
    width: 100%;
    height: 4.8rem;
    margin-top: 0.5rem;
    background-color: transparent;
  }
  @-webkit-keyframes warn{
    0%{transform:scale(0);opacity:0.0}
    50%{transform:scale(0.5);opacity:0.5}
    100%{transform:scale(1);opacity:1}
  }
  @keyframes warn{
    0%{transform:scale(0);opacity:0.0}
    50%{transform:scale(0.1);opacity:0.5}
    100%{transform:scale(1);opacity:1}
  }
  .warn{
    animation: warn 1s  linear 1;
    -webkit-animation: warn 1s  linear 1;
  }
  .inspect{
    position: relative;
    width: 2.7rem;
    padding: 0.27rem 0 0.2rem;
    margin: 0 auto;
    background: #FFFFFF;
    border-radius: 0.14rem;
    z-index: 3000;
  }
  .inspect-img{
    display: block;
    width: 0.61rem;
    height: 0.5rem;
    margin: 0 auto;
  }
  .inspect-txt{
    height: 0.22rem;
    font-size: 0.16rem;
    font-weight: 500;
    color: #212121;
    text-align: center;
    line-height: 0.22rem;
    margin: 0.24rem auto 0.2rem;
  }
  .inspect-info{
    padding: 0 0.14rem;
  }
  .phone,.code{
    height: 0.34rem;
    line-height: 0.34rem;
    color: #000000;
    font-size: 0.16rem;
  }
  .iptActive{
    box-shadow: 0px 1px 10px -1px rgba(255, 0, 0, 0.5);
  }
  .code-btn{
    width: 1rem;
    color: #BB1D31;
    font-size: 0.12rem;
  }
  .code-btn2{
     width: 1.2rem;
    color: #A7A7A7;
  }
  .cancel{
    width: 1.09rem;
    height: 0.34rem;
    color: #212121;
    border-radius: 0.05rem;
    margin-right: 0.2rem;
    border: 0.01rem solid #A7A7A7;
  }
  .define{
    width: 1.09rem;
    height: 0.34rem;
    color: #FFFFFF;
    background: #BB1D31;
    border-radius: 0.05rem;
  }
  .tip-txt{
    height: 0.14rem;
    line-height: 0.14rem;
    font-size: 0.1rem;
    font-weight: 400;
    text-align: left;
    color: rgba(255, 0, 0, 0.83);
    margin: 0.07rem auto 0.09rem;
  }
  .tip-txt2{
     height: 0.1rem;
  }
  .success{
    position: relative;
    z-index: 3000;
  }
  .flash{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3.9rem;
    height: 4.8rem;
    margin: -2.4rem auto auto -1.95rem;
    background: url(../assets/flash.png) no-repeat center center/100% 100%;
    z-index: 3004;
  }
  .card{
    position: relative;
    width: 2.7rem;
    height: 3.51rem;
    margin: 0 auto;
    background: url(../assets/card.png) no-repeat center center/100% 100%;
    z-index: 3005;
  }
</style>
