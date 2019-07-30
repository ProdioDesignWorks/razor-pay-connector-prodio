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
  createMerchant(payloadJson) {
    return new Promise((resolve, reject) => {

        resolve({
            "success": true,
            "body": {
                "merchant": {
                    "mid": uuidv4()
                }
            }
        });

    });
  }
  updateMerchant(payloadJson) {
    return 'This is from Integrity';
  }
  deleteMerchant(payloadJson) {
    return 'This is from Integrity';
  }
  getMerchantId(payloadJson) {
    return 'this is tes';
  }
  getMerchantProfile(payloadJson) {
    return 'this is test';
  }
  getMerchantActionvationStatus(payloadJson) {
    return new Promise((resolve, reject) => {

        resolve({
            "success": true,
            "body": {
                "activationStatus": true
            }
        });

    });
  }
  createPayer(payloadJson) {
    return new Promise((resolve, reject) => {
        resolve({
            "success": true,
            "body": {
                "gatewayBuyerId": uuidv4()
            }
        });
    });
  }
  editPayer(payloadJson) {

    return new Promise((resolve, reject) => {
        resolve({
            "success": true,
            "body": {
                "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
            }
        });
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
        console.log("response..............................",response);
        return resolve(response);
      
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
  webhookProcessor(webhookPayload){
    return new Promise((resolve,reject)=>{
      if(webhookPayload){        
        const {entity} = webhookPayload.payload.payment;
        const subscriptionEntity = webhookPayload.payload.subscription ? webhookPayload.payload.subscription.entity : {};
        const {event} = webhookPayload;
        console.log("event",event);
        let payload = {};
      switch (event) {
          case 'payment.captured':
            payload = {
              "event":webhookPayload.event,
              "order_id":entity.order_id,
              "payment_id":entity.id,
              "amount":entity.amount,
              "customer_id":entity.customer_id
            };
            return resolve(payload);
            break;
          case 'subscription.activated':{
            if(subscriptionEntity){
              payload = {
                "event":webhookPayload.event,
                "order_id":entity.order_id,
                "amount":entity.amount,
                "payment_id":entity.id,
                "subscription_id":subscriptionEntity.id,
                "status":subscriptionEntity.status,
                "total_count":subscriptionEntity.total_count,
                "charge_at":subscriptionEntity.charge_at,
                "remaining_count":subscriptionEntity.remaining_count,
                "cardDetails":entity.card
              };
              return resolve(payload);
            }
          }
          case 'subscription.charged':{
            if(subscriptionEntity){
              payload = {
                "event":webhookPayload.event,
                "order_id":entity.order_id,
                "amount":entity.amount,
                "payment_id":entity.id,
                "subscription_id":subscriptionEntity.id,
                "status":subscriptionEntity.status,
                "total_count":subscriptionEntity.total_count,
                "charge_at":subscriptionEntity.charge_at,
                "remaining_count":subscriptionEntity.remaining_count
              };
              return resolve(payload);
            }
          }
      }

      }
      else {
        const error="Error while receiving data from  webhook.";
        return reject(error);
      }
    })
  }
  fetchSubscriptionProfile(payload){
    const {subscriptionId} = payload;
    razorPayObj.subscriptions.fetch(subscriptionId).then(response => {
      return resolve(response);
    }).catch(error => {
      return reject(error);
    })
  }
  cancelSubscription(payload){
    const {subscriptionId,cancelAtCycleEnd} = payload;
    razorPayObj.subscriptions.cancel(subscriptionId,cancelAtCycleEnd).then(response => {
      return resolve(response);
    }).catch(error => {
      return reject(error);
    })
  }
  createTransfer(payloadJson){
    return new Promise((resolve,reject)=>{
      const {
        payment_id,
        transfer_payload
      } = payloadJson;
      razorPayObj.payments.transfer.create(payment_id,transfer_payload).then(response=>{
          return resolve(response);
      }).catch(error=>{
          return reject(error);
      })
    });
  }

  getPaymentProfile(payloadJson){
    const {payment_id} = payloadJson;
    return new Promise((resolve,reject)=>{
      razorPayObj.payments.fetch(payment_id).then(response=>{
          return resolve(response);
      }).catch(error=>{
          return reject(error);
      })
    });
  }
  getAllPayments(payloadJson){
    const {from,to,count,skip} = payloadJson;
    return new Promise((resolve,reject)=>{
      razorPayObj.payments.all({from,to,count,skip}).then((response) => {
        return resolve(response);
      }).catch((error) => {
        console.log("error",error);
        return reject(error);
      });
    })
  }
  makeRefund(payloadJson){
    const {payment_id,amount,notes} = payloadJson;
    return new Promise((resolve,reject)=>{
      razorPayObj.payments.all(payment_id,{amount,notes}).then((response) => {
        return resolve(response);
      }).catch((error) => {
        console.log("error",error);
        return reject(error);
      });
    })
  }
  
  removePayer(payloadJson) {
    return new Promise((resolve, reject) => {
        resolve({
            "success": true,
            "body": {
                "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
            }
        });
    });
}
  bulkUploadPayers(payloadJson) {
    return 'this is test';
}
getPayersListing(payloadJson) {
  return 'this is test';
}
getPayersTransactions(payloadJson) {
  return 'this is test';
}
}