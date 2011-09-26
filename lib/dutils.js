(function() {
  var auth_key, auth_secret, crypto, getUploadParams, sanitize, template_id;
  crypto = require('crypto');
  sanitize = require("validator").sanitize;
  auth_key = '1580cee65f904f7399ca08a1a844cfab';
  auth_secret = '61b3703ab1a24f1b8be97b73dc2b33c50a2260a0';
  template_id = 'b902f75dba8a4fadb054ab068e705b97';
  getUploadParams = function() {
    var encodedParams, hash, params, paramsStr;
    params = {
      auth: {
        expires: "2011/10/01 16:53:14+00:00",
        key: auth_key
      },
      template_id: template_id,
      redirect_url: "http://localhost:3000/done",
      notify_url: "http://localhost:3000/filesready"
    };
    paramsStr = JSON.stringify(params);
    encodedParams = sanitize(paramsStr).entityEncode();
    hash = crypto.createHmac("sha1", auth_secret).update(paramsStr).digest("hex");
    console.log([encodedParams, paramsStr, hash]);
    return [encodedParams, paramsStr, hash];
  };
  getUploadParams();
}).call(this);
