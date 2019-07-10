const uuidv4 = require('uuid/v4');
const axios = require('axios');
const razorPayModule = require('razorpay');

const isNull = function (val) {
  if (typeof val === 'string') { val = val.trim(); }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};

let razorPayObj = {};
export default class razorPay {
  constructor(config) {
    this.config = config;
    razorPayObj = new razorPayModule({
      key_id: this.config.KEY_ID,
      key_secret: this.config.KEY_SECRET
    });
  }

  createOrder(payloadJson) {
    return new Promise((resolve, reject) => {
      const {
        amount,
        currency,
        receipt,
        payment_capture,
        notes
      } = payloadJson;
      razorPayObj.orders.create({ amount, currency, receipt, payment_capture, notes }).then(response => {
        return resolve(response);
        console.log(response);
      }).catch(error => {
        console.log(error);
        return reject(error);
      })
    })
  }

  

  createPlan(payloadJson){
    return new Promise((resolve,reject)=>{
      const {
        period,
        interval,
        item,
        notes
      } = payloadJson;
      razorPayObj.plans.create({period,interval,item,notes}).then(response=>{
        console.log("response",response);
        return resolve(response);
      }).catch(error=>{
        return reject(error);
      })
    })
  }
  
  subscribePlan(payloadJson){
    return new Promise((resolve,reject)=>{
      const {
        plan_id,
        total_count,
        start_at,
        addons,
        notes,
        customer_notify,
        expire_by
      } = payloadJson;
      razorPayObj.subscriptions.create({plan_id,total_count,start_at,addons,notes,customer_notify,expire_by}).then(response=>{
          return resolve(response);
      }).catch(error=>{
          return reject(error);
      })
    })
  }
  fetchSingleOrder(payload) {
     const { orderId } = payload;
    return new Promise((resolve, reject) => {
      razorPayObj.orders.fetch(orderId).then(response => {
        return resolve(response);
      }).catch(error => {
        return reject(error);
      })
    })
  };

  capturePayment(payload){
    const {paymentId,amount} = payload;
    return new Promise((resolve,reject)=>{
      razorPayObj.payments.capture(paymentId, amount).then((data) => {
        return resolve(response);
      }).catch((error) => {
        console.log("error",error);
        return reject(error);
      });
    })
  }
}