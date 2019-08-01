'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuidv4 = require('uuid/v4');
var axios = require('axios');
var razorPayModule = require('razorpay');

var isNull = function isNull(val) {
  if (typeof val === 'string') {
    val = val.trim();
  }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};

var razorPayObj = {};

var razorPay = function () {
  function razorPay(config) {
    _classCallCheck(this, razorPay);

    this.config = config;
    razorPayObj = new razorPayModule({
      key_id: this.config.KEY_ID,
      key_secret: this.config.KEY_SECRET
    });
  }

  _createClass(razorPay, [{
    key: 'createMerchant',
    value: function createMerchant(payloadJson) {
      return new Promise(function (resolve, reject) {

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
  }, {
    key: 'updateMerchant',
    value: function updateMerchant(payloadJson) {
      return 'This is from Integrity';
    }
  }, {
    key: 'deleteMerchant',
    value: function deleteMerchant(payloadJson) {
      return 'This is from Integrity';
    }
  }, {
    key: 'getMerchantId',
    value: function getMerchantId(payloadJson) {
      return 'this is tes';
    }
  }, {
    key: 'getMerchantProfile',
    value: function getMerchantProfile(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'getMerchantActionvationStatus',
    value: function getMerchantActionvationStatus(payloadJson) {
      return new Promise(function (resolve, reject) {

        resolve({
          "success": true,
          "body": {
            "activationStatus": true
          }
        });
      });
    }
  }, {
    key: 'createPayer',
    value: function createPayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        resolve({
          "success": true,
          "body": {
            "gatewayBuyerId": uuidv4()
          }
        });
      });
    }
  }, {
    key: 'editPayer',
    value: function editPayer(payloadJson) {

      return new Promise(function (resolve, reject) {
        resolve({
          "success": true,
          "body": {
            "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
          }
        });
      });
    }
  }, {
    key: 'createOrder',
    value: function createOrder(payloadJson) {
      return new Promise(function (resolve, reject) {
        var amount = payloadJson.amount,
            currency = payloadJson.currency,
            receipt = payloadJson.receipt,
            payment_capture = payloadJson.payment_capture,
            notes = payloadJson.notes;

        razorPayObj.orders.create({ amount: amount, currency: currency, receipt: receipt, payment_capture: payment_capture, notes: notes }).then(function (response) {
          console.log("response..............................", response);
          return resolve(response);
        }).catch(function (error) {
          console.log(error);
          return reject(error);
        });
      });
    }
  }, {
    key: 'createPlan',
    value: function createPlan(payloadJson) {
      return new Promise(function (resolve, reject) {
        var period = payloadJson.period,
            interval = payloadJson.interval,
            item = payloadJson.item,
            notes = payloadJson.notes;

        razorPayObj.plans.create({ period: period, interval: interval, item: item, notes: notes }).then(function (response) {
          console.log("response", response);
          return resolve(response);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'subscribePlan',
    value: function subscribePlan(payloadJson) {
      return new Promise(function (resolve, reject) {
        var plan_id = payloadJson.plan_id,
            total_count = payloadJson.total_count,
            start_at = payloadJson.start_at,
            addons = payloadJson.addons,
            notes = payloadJson.notes,
            customer_notify = payloadJson.customer_notify,
            expire_by = payloadJson.expire_by;

        razorPayObj.subscriptions.create({ plan_id: plan_id, total_count: total_count, start_at: start_at, addons: addons, notes: notes, customer_notify: customer_notify, expire_by: expire_by }).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'fetchSingleOrder',
    value: function fetchSingleOrder(payload) {
      var orderId = payload.orderId;

      return new Promise(function (resolve, reject) {
        razorPayObj.orders.fetch(orderId).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'capturePayment',
    value: function capturePayment(payload) {
      var paymentId = payload.paymentId,
          amount = payload.amount;

      return new Promise(function (resolve, reject) {
        razorPayObj.payments.capture(paymentId, amount).then(function (data) {
          return resolve(response);
        }).catch(function (error) {
          console.log("error", error);
          return reject(error);
        });
      });
    }
  }, {
    key: 'webhookProcessor',
    value: function webhookProcessor(webhookPayload) {
      return new Promise(function (resolve, reject) {
        if (webhookPayload) {
          var entity = webhookPayload.payload.payment.entity;

          var subscriptionEntity = webhookPayload.payload.subscription ? webhookPayload.payload.subscription.entity : {};
          var event = webhookPayload.event;

          console.log("event", event);
          var payload = {};
          switch (event) {
            case 'payment.captured':
              payload = {
                "event": webhookPayload.event,
                "order_id": entity.order_id,
                "payment_id": entity.id,
                "currency": entity.currency,
                "amount": entity.amount,
                "capture": entity.capture,
                "status": entity.status,
                "customer_id": entity.customer_id
              };
              return resolve(payload);
              break;
            case 'subscription.activated':
              {
                if (subscriptionEntity) {
                  payload = {
                    "event": webhookPayload.event,
                    "order_id": entity.order_id,
                    "amount": entity.amount,
                    "payment_id": entity.id,
                    "subscription_id": subscriptionEntity.id,
                    "status": subscriptionEntity.status,
                    "total_count": subscriptionEntity.total_count,
                    "charge_at": subscriptionEntity.charge_at,
                    "remaining_count": subscriptionEntity.remaining_count,
                    "cardDetails": entity.card
                  };
                  return resolve(payload);
                }
              }
            case 'subscription.charged':
              {
                if (subscriptionEntity) {
                  payload = {
                    "event": webhookPayload.event,
                    "order_id": entity.order_id,
                    "amount": entity.amount,
                    "payment_id": entity.id,
                    "subscription_id": subscriptionEntity.id,
                    "status": subscriptionEntity.status,
                    "total_count": subscriptionEntity.total_count,
                    "charge_at": subscriptionEntity.charge_at,
                    "remaining_count": subscriptionEntity.remaining_count
                  };
                  return resolve(payload);
                }
              }
            case 'invoice.paid':
              {
                payload = {
                  "event": webhookPayload.event,
                  "order_id": entity.order_id,
                  "payment_id": entity.id,
                  "amount": entity.amount,
                  "capture": entity.capture,
                  "status": entity.status,
                  "customer_id": entity.customer_id
                };
                return resolve(payload);
              }
          }
        } else {
          var error = "Error while receiving data from  webhook.";
          return reject(error);
        }
      });
    }
  }, {
    key: 'fetchSubscriptionProfile',
    value: function fetchSubscriptionProfile(payload) {
      var subscriptionId = payload.subscriptionId;

      razorPayObj.subscriptions.fetch(subscriptionId).then(function (response) {
        return resolve(response);
      }).catch(function (error) {
        return reject(error);
      });
    }
  }, {
    key: 'cancelSubscription',
    value: function cancelSubscription(payload) {
      var subscriptionId = payload.subscriptionId,
          cancelAtCycleEnd = payload.cancelAtCycleEnd;

      razorPayObj.subscriptions.cancel(subscriptionId, cancelAtCycleEnd).then(function (response) {
        return resolve(response);
      }).catch(function (error) {
        return reject(error);
      });
    }
  }, {
    key: 'createTransfer',
    value: function createTransfer(payloadJson) {
      return new Promise(function (resolve, reject) {
        var payment_id = payloadJson.payment_id,
            transfer_payload = payloadJson.transfer_payload;

        razorPayObj.payments.transfer.create(payment_id, transfer_payload).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getPaymentProfile',
    value: function getPaymentProfile(payloadJson) {
      var payment_id = payloadJson.payment_id;

      return new Promise(function (resolve, reject) {
        razorPayObj.payments.fetch(payment_id).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getAllPayments',
    value: function getAllPayments(payloadJson) {
      var from = payloadJson.from,
          to = payloadJson.to,
          count = payloadJson.count,
          skip = payloadJson.skip;

      return new Promise(function (resolve, reject) {
        razorPayObj.payments.all({ from: from, to: to, count: count, skip: skip }).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          console.log("error", error);
          return reject(error);
        });
      });
    }
  }, {
    key: 'makeRefund',
    value: function makeRefund(payloadJson) {
      var payment_id = payloadJson.payment_id,
          amount = payloadJson.amount,
          notes = payloadJson.notes;

      return new Promise(function (resolve, reject) {
        razorPayObj.payments.all(payment_id, { amount: amount, notes: notes }).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          console.log("error", error);
          return reject(error);
        });
      });
    }
  }, {
    key: 'removePayer',
    value: function removePayer(payloadJson) {
      return new Promise(function (resolve, reject) {
        resolve({
          "success": true,
          "body": {
            "gatewayBuyerId": payloadJson["payeeInfo"]["gatewayBuyerId"]
          }
        });
      });
    }
  }, {
    key: 'createInvoice',
    value: function createInvoice(payloadJson) {
      return new Promise(function (resolve, reject) {
        var type = payloadJson.type,
            currency = payloadJson.currency,
            amount = payloadJson.amount,
            customer = payloadJson.customer,
            description = payloadJson.description;

        razorPayObj.invoices.create({ type: type, currency: currency, amount: amount, customer: customer, description: description }).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          console.log("error", error);
          return reject(error);
        });
      });
    }
  }, {
    key: 'bulkUploadPayers',
    value: function bulkUploadPayers(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'getPayersListing',
    value: function getPayersListing(payloadJson) {
      return 'this is test';
    }
  }, {
    key: 'getPayersTransactions',
    value: function getPayersTransactions(payloadJson) {
      return 'this is test';
    }
  }]);

  return razorPay;
}();

exports.default = razorPay;