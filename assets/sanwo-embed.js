"use strict";var Sanwo=(()=>{var w=Object.defineProperty,$=Object.defineProperties,Y=Object.getOwnPropertyDescriptor,W=Object.getOwnPropertyDescriptors,X=Object.getOwnPropertyNames,P=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var O=(e,a,t)=>a in e?w(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,U=(e,a)=>{for(var t in a||(a={}))D.call(a,t)&&O(e,t,a[t]);if(P)for(var t of P(a))Z.call(a,t)&&O(e,t,a[t]);return e},R=(e,a)=>$(e,W(a));var Q=(e,a)=>{for(var t in a)w(e,t,{get:a[t],enumerable:!0})},ee=(e,a,t,n)=>{if(a&&typeof a=="object"||typeof a=="function")for(let r of X(a))!D.call(e,r)&&r!==t&&w(e,r,{get:()=>a[r],enumerable:!(n=Y(a,r))||n.enumerable});return e};var ae=e=>ee(w({},"__esModule",{value:!0}),e);var ye={};Q(ye,{autoInit:()=>V,create:()=>C,listProviders:()=>y,resolveProvider:()=>h});var m=class extends Error{constructor(e){var a;super(e.message),this.name="SanwoError",this.code=e.code,this.provider=e.provider,this.cause=e.cause,this.recoverable=(a=e.recoverable)!=null?a:!1}toJSON(){return{code:this.code,message:this.message,provider:this.provider,recoverable:this.recoverable}}},T=class{constructor(){this.listeners=new Map}on(e,a){let t=this.listeners.get(e);return t||(t=new Set,this.listeners.set(e,t)),t.add(a),()=>this.off(e,a)}off(e,a){let t=this.listeners.get(e);t&&(t.delete(a),t.size===0&&this.listeners.delete(e))}emit(e,a){let t=this.listeners.get(e);if(t)for(let n of t)try{n(a)}catch(r){}}removeAllListeners(e){e?this.listeners.delete(e):this.listeners.clear()}},te=new Set(["BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF"]),re=new Set(["BHD","JOD","KWD","OMR","TND"]);function ne(e,a){let t=a.toUpperCase();return te.has(t)?e:re.has(t)?e/1e3:e/100}function g(){let e=Date.now().toString(36),a=Math.random().toString(36).substring(2,10);return`sanwo_${e}_${a}`}function M(e,a,t){let n=t.amountInMinorUnit?e.amount:ne(e.amount,e.currency),r={publicKey:a,amount:n,currency:e.currency,reference:e.reference||g(),email:e.customer.email};if(e.customer.firstName&&(r.firstName=e.customer.firstName),e.customer.lastName&&(r.lastName=e.customer.lastName),e.customer.name&&(r.name=e.customer.name),e.customer.phone&&(r.phone=e.customer.phone),e.metadata&&(r.metadata=e.metadata),e.description&&(r.description=e.description),e.sanwoProviderOptions)for(let[p,o]of Object.entries(e.sanwoProviderOptions))r[p]=o;return r}function A(e,a,t){let n=e.replace("{{sanwoBridge}}",t);return n=n.replace("{{params}}",JSON.stringify(a)),n}var se=`function sanwoCallback(event, data) {
  window.parent.postMessage(JSON.stringify({ type: 'sanwo', event: event, data: data }), '*');
}`,oe=`function sanwoCallback(event, data) {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'sanwo', event: event, data: data }));
}`,ie=`function sanwoCallback(event, data) {
  messageHandler.postMessage(JSON.stringify({ type: 'sanwo', event: event, data: data }));
}`,ce=`function sanwoCallback(event, data) {
  JSBridge.showMessageInNative(JSON.stringify({ type: 'sanwo', event: event, data: data }));
}`,me={web:se,"react-native":oe,flutter:ie,android:ce};function F(e){return me[e]}function K(e){if(!e)throw new m({code:"INVALID_CHECKOUT_OPTIONS",message:"Checkout options are required"});if(typeof e.amount!="number"||e.amount<=0||!Number.isFinite(e.amount))throw new m({code:"INVALID_CHECKOUT_OPTIONS",message:"Amount must be a positive finite number"});if(!e.currency||typeof e.currency!="string")throw new m({code:"INVALID_CHECKOUT_OPTIONS",message:"Currency is required and must be a string"});if(!e.customer||typeof e.customer!="object")throw new m({code:"INVALID_CHECKOUT_OPTIONS",message:"Customer is required"});if(!e.customer.email||typeof e.customer.email!="string")throw new m({code:"INVALID_CHECKOUT_OPTIONS",message:"Customer email is required"});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.customer.email))throw new m({code:"INVALID_CHECKOUT_OPTIONS",message:"Customer email is invalid"})}function pe(e){let a=document.createElement("iframe");a.id="sanwo-checkout-iframe",a.style.position="fixed",a.style.top="0",a.style.left="0",a.style.width="100%",a.style.height="100%",a.style.border="none",a.style.zIndex="2147483647",a.style.backgroundColor="transparent",a.setAttribute("allowtransparency","true"),a.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox");let t=new Blob([e.html],{type:"text/html"});a.src=URL.createObjectURL(t);let n=e.containerId?document.getElementById(e.containerId):document.body;if(!n)throw new Error(`Container element "${e.containerId}" not found`);return n.appendChild(a),{iframe:a,remove(){URL.revokeObjectURL(a.src),a.remove()}}}function L(e){if(!e.provider)throw new m({code:"INVALID_CONFIGURATION",message:"Provider is required"});if(!e.publicKey)throw new m({code:"INVALID_CONFIGURATION",message:"Public key is required"});let a=new T,t="idle",n=null,r=null;function p(){r&&(window.removeEventListener("message",r),r=null),n&&(n.remove(),n=null),t="idle"}function o(s,c){let v={type:s,provider:e.provider.id,timestamp:Date.now(),data:c};a.emit(s,v)}function u(s){e.debug&&console.log(`[Sanwo:${e.provider.id}] ${s}`)}let d=async function(s){if(t!=="idle")throw new m({code:"CHECKOUT_ALREADY_ACTIVE",message:"A checkout is already in progress"});if(typeof document=="undefined")throw new m({code:"INVALID_CONFIGURATION",message:"Sanwo web adapter requires a browser environment"});K(s),s.reference||(s=R(U({},s),{reference:g()})),t="rendering";let c=M(s,e.publicKey,e.provider),v=F("web"),j=A(e.provider.template,c,v);return o("started",{reference:c.reference}),new Promise((J,k)=>{var I;let S=(I=e.timeout)!=null?I:12e4,f=!1,N=setTimeout(()=>{f||(f=!0,p(),k(new m({code:"TIMEOUT",message:`Checkout timed out after ${S}ms`,provider:e.provider.id,recoverable:!0})))},S),b=i=>{f||(f=!0,clearTimeout(N),p(),i.status==="successful"?o("success",i):i.status==="cancelled"?o("cancelled",i):i.status==="failed"&&o("failed",i),o("closed",i),J(i))};r=i=>{var E,_;let l;try{l=typeof i.data=="string"?JSON.parse(i.data):i.data}catch(ve){return}if(l.type==="sanwo")switch(u(`Received message: ${l.event}`),l.event){case"loaded":u("Checkout loaded"),o("loaded",{reference:c.reference}),(E=s.onLoad)==null||E.call(s);break;case"success":b({status:"successful",provider:e.provider.id,reference:l.data.reference||c.reference,transactionId:l.data.transaction_id?String(l.data.transaction_id):void 0,raw:l.data});break;case"cancelled":case"closed":b({status:"cancelled",provider:e.provider.id,reference:c.reference});break;case"error":(_=s.onError)==null||_.call(s,{message:l.data.message||"Checkout failed",raw:l.data}),b({status:"failed",provider:e.provider.id,reference:c.reference,error:{code:"CHECKOUT_FAILED",message:l.data.message||"Checkout failed",provider:e.provider.id,recoverable:!1},raw:l.data});break}},window.addEventListener("message",r);try{n=pe({containerId:e.containerId,html:j}),t="opened",o("opened",{reference:c.reference})}catch(i){f=!0,clearTimeout(N),p(),k(new m({code:"CHECKOUT_FAILED",message:i instanceof Error?i.message:"Failed to create checkout iframe",provider:e.provider.id,cause:i}))}})};return d.on=(s,c)=>a.on(s,c),d.off=(s,c)=>{a.off(s,c)},d.close=()=>{p()},d.destroy=()=>{p(),a.removeAllListeners()},Object.defineProperty(d,"providerId",{get:()=>e.provider.id,enumerable:!0}),Object.defineProperty(d,"currentState",{get:()=>t,enumerable:!0}),d}var de=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var paystack = new PaystackPop();
        var config = {
          key: params.publicKey,
          email: params.email,
          amount: params.amount,
          currency: params.currency,
          onSuccess: function(response) {
            sanwoCallback('success', {
              reference: response.reference || response.trxref,
              transaction_id: response.trans || response.transaction,
              message: response.message,
              raw: response
            });
          },
          onCancel: function() {
            sanwoCallback('cancelled', {});
          },
          onClose: function() {
            sanwoCallback('closed', {});
          }
        };

        if (params.reference) config.ref = params.reference;
        if (params.channels) config.channels = params.channels;
        if (params.metadata) config.metadata = params.metadata;
        if (params.firstName) config.firstname = params.firstName;
        if (params.lastName) config.lastname = params.lastName;
        if (params.phone) config.phone = params.phone;
        if (params.label) config.label = params.label;
        if (params.plan) config.plan = params.plan;
        if (params.quantity) config.quantity = params.quantity;
        if (params.subaccount) config.subaccount = params.subaccount;
        if (params.splitCode) config.split_code = params.splitCode;
        if (params.split) config.split = params.split;
        if (params.transactionCharge) config.transaction_charge = params.transactionCharge;
        if (params.invoiceLimit) config.invoice_limit = params.invoiceLimit;

        sanwoCallback('loaded', {});
        var method = params.method || 'checkout';
        paystack[method](config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var psScript = document.createElement('script');
    psScript.src = 'https://js.paystack.co/v2/inline.js';
    psScript.onload = initPayment;
    psScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Paystack SDK' });
    };
    document.body.appendChild(psScript);
  <\/script>
</body>
</html>`,z={id:"paystack",name:"paystack",displayName:"Paystack",template:de,website:"https://paystack.com",documentation:"https://paystack.com/docs",amountInMinorUnit:!0,supportedCurrencies:["NGN","GHS","ZAR","USD","KES"],supportedCountries:["NG","GH","ZA","US","KE"],paymentMethods:["card","bank","ussd","qr","mobile_money","bank_transfer","eft"]};var le=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var config = {
          public_key: params.publicKey,
          tx_ref: params.reference,
          amount: params.amount,
          currency: params.currency,
          customer: {
            email: params.email
          },
          callback: function(response) {
            var isSuccess = response.status === 'successful' || response.status === 'completed';
            if (isSuccess) {
              sanwoCallback('success', {
                reference: response.tx_ref,
                transaction_id: response.transaction_id,
                flw_ref: response.flw_ref,
                raw: response
              });
            } else {
              sanwoCallback('error', {
                message: 'Flutterwave checkout returned status: ' + response.status,
                raw: response
              });
            }
            if (typeof FlutterwaveCheckout !== 'undefined') {
              try { FlutterwaveCheckout.close(); } catch(e) {}
            }
          },
          onclose: function() {
            sanwoCallback('cancelled', {});
          }
        };

        if (params.name || params.firstName) {
          config.customer.name = params.name || [params.firstName, params.lastName].filter(Boolean).join(' ');
        }
        if (params.phone) config.customer.phonenumber = params.phone;
        if (params.metadata) config.meta = params.metadata;
        if (params.description) config.title = params.description;
        if (params.paymentOptions) config.payment_options = params.paymentOptions;
        if (params.redirectUrl) config.redirect_url = params.redirectUrl;
        if (params.paymentPlan) config.payment_plan = params.paymentPlan;
        if (params.subaccounts) config.subaccounts = params.subaccounts;
        if (params.customizations) config.customizations = params.customizations;

        sanwoCallback('loaded', {});
        FlutterwaveCheckout(config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var flwScript = document.createElement('script');
    flwScript.src = 'https://checkout.flutterwave.com/v3.js';
    flwScript.onload = initPayment;
    flwScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Flutterwave SDK' });
    };
    document.body.appendChild(flwScript);
  <\/script>
</body>
</html>`,G={id:"flutterwave",name:"flutterwave",displayName:"Flutterwave",template:le,website:"https://flutterwave.com",documentation:"https://developer.flutterwave.com",amountInMinorUnit:!1,supportedCurrencies:["NGN","GHS","KES","ZAR","USD","EUR","GBP","TZS","UGX","RWF","XAF","XOF"],supportedCountries:["NG","GH","KE","ZA","US","GB","TZ","UG","RW","CM","CI"],paymentMethods:["card","bank_transfer","ussd","mobile_money","apple_pay","qr"]};var ue=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var prefill = {};
        if (params.email) prefill.email = params.email;
        if (params.name) {
          prefill.name = params.name;
        } else if (params.firstName || params.lastName) {
          prefill.name = ((params.firstName || '') + ' ' + (params.lastName || '')).trim();
        }
        if (params.phone) prefill.contact = params.phone;

        var options = {
          key: params.publicKey,
          amount: params.amount,
          currency: params.currency,
          prefill: prefill,
          handler: function(response) {
            sanwoCallback('success', {
              paymentId: response.razorpay_payment_id,
              reference: response.razorpay_payment_id,
              transaction_id: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
          },
          modal: {
            ondismiss: function() {
              sanwoCallback('cancelled', {});
            }
          }
        };

        if (params.orderId) options.order_id = params.orderId;
        if (params.description) options.description = params.description;
        if (params.notes) options.notes = params.notes;
        if (params.theme) options.theme = params.theme;
        if (params.image) options.image = params.image;

        var rzp = new Razorpay(options);
        sanwoCallback('loaded', {});
        rzp.open();
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var rzpScript = document.createElement('script');
    rzpScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    rzpScript.onload = initPayment;
    rzpScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Razorpay SDK' });
    };
    document.body.appendChild(rzpScript);
  <\/script>
</body>
</html>`,x={id:"razorpay",name:"razorpay",displayName:"Razorpay",template:ue,website:"https://razorpay.com",documentation:"https://razorpay.com/docs",amountInMinorUnit:!0,supportedCurrencies:["INR","USD","EUR","GBP","SGD","AED","MYR"],supportedCountries:["IN"],paymentMethods:["card","netbanking","wallet","upi","emi","bank_transfer"]};var fe=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var customerName = (params.firstName || '') + (params.lastName ? ' ' + params.lastName : '');
        if (!customerName.trim()) customerName = params.email;

        var config = {
          amount: params.amount,
          currency: params.currency || 'NGN',
          reference: params.reference,
          customerFullName: customerName,
          customerEmail: params.email,
          apiKey: params.publicKey,
          contractCode: params.contractCode,
          paymentDescription: params.description || 'Payment',
          isTestMode: params.isTestMode !== undefined ? params.isTestMode : (params.publicKey && params.publicKey.indexOf('TEST') !== -1),
          onLoadStart: function() {},
          onLoadComplete: function() {
            sanwoCallback('loaded', {});
          },
          onComplete: function(response) {
            sanwoCallback('success', {
              reference: response.paymentReference,
              transaction_id: response.transactionReference,
              transactionReference: response.transactionReference,
              paymentReference: response.paymentReference,
              amountPaid: response.amountPaid,
              paidOn: response.paidOn,
              paymentStatus: response.paymentStatus,
              raw: response
            });
          },
          onClose: function(data) {
            sanwoCallback('cancelled', data || {});
          }
        };

        if (params.metadata) config.metadata = params.metadata;
        if (params.redirectUrl) config.redirectUrl = params.redirectUrl;
        if (params.paymentMethods) config.paymentMethods = params.paymentMethods;
        if (params.incomeSplitConfig) config.incomeSplitConfig = params.incomeSplitConfig;

        MonnifySDK.initialize(config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var mfScript = document.createElement('script');
    mfScript.src = 'https://sdk.monnify.com/plugin/monnify.js';
    mfScript.onload = initPayment;
    mfScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Monnify SDK' });
    };
    document.body.appendChild(mfScript);
  <\/script>
</body>
</html>`,B={id:"monnify",name:"monnify",displayName:"Monnify",template:fe,website:"https://monnify.com",documentation:"https://docs.monnify.com",amountInMinorUnit:!1,supportedCurrencies:["NGN"],supportedCountries:["NG"],paymentMethods:["card","bank_transfer","ussd","phone_number"]};var we=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanwo Checkout</title>
</head>
<body style="background-color:#fff;height:100vh">
  <script>
    {{sanwoBridge}}

    var params = {{params}};

    function initPayment() {
      try {
        var config = {
          merchant_code: params.publicKey,
          amount: params.amount,
          currency: params.currency,
          customer_email: params.email,
          txn_ref: params.reference,
          onComplete: function(response) {
            sanwoCallback('success', {
              reference: response.txnref,
              ...response
            });
          },
          onClose: function() {
            sanwoCallback('cancelled', {});
          }
        };

        if (params.firstName) config.customer_first_name = params.firstName;
        if (params.lastName) config.customer_last_name = params.lastName;
        if (params.payItemId) config.pay_item_id = params.payItemId;
        if (params.payItemName) config.pay_item_name = params.payItemName;
        if (params.siteRedirectUrl) config.site_redirect_url = params.siteRedirectUrl;

        sanwoCallback('loaded', {});
        window.webpayCheckout(config);
      } catch(e) {
        sanwoCallback('error', { message: e.message });
      }
    }

    var iwScript = document.createElement('script');
    iwScript.src = 'https://newwebpay.interswitchng.com/inline-checkout.js';
    iwScript.onload = initPayment;
    iwScript.onerror = function() {
      sanwoCallback('error', { message: 'Failed to load Interswitch SDK' });
    };
    document.body.appendChild(iwScript);
  <\/script>
</body>
</html>`,H={id:"interswitch",name:"interswitch",displayName:"Interswitch",template:we,website:"https://interswitchgroup.com",documentation:"https://developer.interswitchgroup.com",amountInMinorUnit:!0,supportedCurrencies:["NGN"],supportedCountries:["NG"],paymentMethods:["card","bank_transfer","ussd","qr"]};var q={paystack:z,flutterwave:G,razorpay:x,monnify:B,interswitch:H};function h(e){return q[e.toLowerCase()]}function y(){return Object.keys(q)}function C(e){let a=h(e.provider);if(!a)throw new Error(`Unknown provider "${e.provider}". Available: ${y().join(", ")}`);let t=L({provider:a,publicKey:e.publicKey,debug:e.debug,timeout:e.timeout,containerId:e.containerId});return{checkout:n=>t(n),close:()=>t.close(),destroy:()=>t.destroy(),get instance(){return t}}}function he(e){let a=e.dataset.sanwoProvider,t=e.dataset.sanwoKey;if(!a||!t)return null;let n={provider:a,publicKey:t,debug:e.dataset.sanwoDebug==="true",containerId:e.dataset.sanwoContainer},r=e.dataset.sanwoTimeout;r&&(n.timeout=Number(r));let p=e.dataset.sanwoAmount,o=e.dataset.sanwoCurrency,u=e.dataset.sanwoEmail;if(!p||!o||!u)return null;let d={amount:Number(p),currency:o,customer:{email:u,firstName:e.dataset.sanwoFirstName,lastName:e.dataset.sanwoLastName,phone:e.dataset.sanwoPhone},reference:e.dataset.sanwoReference,description:e.dataset.sanwoDescription};return{config:n,options:d}}function V(){if(typeof document=="undefined")return;let e=()=>{document.querySelectorAll("[data-sanwo-provider]").forEach(t=>{t.dataset.sanwoInitialized!=="true"&&(t.dataset.sanwoInitialized="true",t.addEventListener("click",async n=>{n.preventDefault();let r=he(t);if(!r){console.error("[Sanwo] Missing required data attributes: data-sanwo-provider, data-sanwo-key, data-sanwo-amount, data-sanwo-currency, data-sanwo-email");return}let p=C(r.config);try{let o=await p.checkout(r.options),u=t.dataset.sanwoCallback;if(u){let d=window[u];typeof d=="function"&&d(o)}t.dispatchEvent(new CustomEvent("sanwo:complete",{detail:o,bubbles:!0}))}catch(o){t.dispatchEvent(new CustomEvent("sanwo:error",{detail:o,bubbles:!0}))}}))})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}return ae(ye);})();
if(typeof window!=='undefined'){window.Sanwo=Sanwo;Sanwo.autoInit&&Sanwo.autoInit();}
//# sourceMappingURL=sanwo.global.js.map