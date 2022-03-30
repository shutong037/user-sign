import { request } from '@/utils/request'

// 获取授权
export function getAuth() {
    return request({
        url: '/api/customer/login/wxAuthUrl',
        method: 'get'
    })
}

// 开始登录
export function loginInfo(code) {
    return request({
        url: '/api/customer/login/1/4?code='+ code,
        method: 'get'
    })
}

// 获取当前用户签约步骤
//0:未认证 1：完成身份证上传 2：完成身份证信息确认 3：完成采集信息填写 4：完成采集信息确认 5：完成风险测试
export function getCurrentStep() {
    return request({
        url: '/api/order/sign/step',
        method: 'get'
    })
}

// 获取验证码
export function getCode(phone) {
    return request({
        url: '/api/customer/common/phone/verify/'+ phone,
        method: 'get'
    })
}

// 检查验证码
export function inspectCode(data) {
    return request({
        url: '/api/customer/account/phone/bind',
        method: 'put',
        data: data
    })
}
