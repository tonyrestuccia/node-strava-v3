/**
 * Created by Yousef on 6/14/16.
 * Refactored by markstos on 06/07/2017
 */

var authenticator = require('./authenticator');

var pushSubscriptions = function (client) {
  this.client = client;
};

var _allowedPostProps = [
        'object_type'
        , 'aspect_type'
        , 'callback_url'
        , 'verify_token'
    ];

pushSubscriptions.prototype.post = function(args,done) {
    if(
       typeof args.object_type === 'undefined' ||
       typeof args.aspect_type == 'undefined' ||
       typeof args.callback_url == 'undefined'
        ) {
        return done({'msg':'required args missing'});
    }

    args.body = this.client.getRequestBodyObj(_allowedPostProps,args);

    args.body.client_secret = authenticator.getClientSecret();
    args.body.client_id = authenticator.getClientId();

    return this.client._requestHelper({
        url: 'push_subscriptions',
        method: 'POST',
        form: args.body,
    },done);
};

pushSubscriptions.prototype.list = function(done) {
    var qs = this.client.getQS(['client_secret', 'client_id'],{
      client_secret : authenticator.getClientSecret(),
      client_id : authenticator.getClientId()
    });
    return this.client._requestHelper({url:'push_subscriptions?' + qs},done);
};

pushSubscriptions.prototype.delete = function(args,done) {
    //require subscription id
    if(typeof args.id === 'undefined') {
        return done({msg:'args must include a push subscription id'});
    }

    var qs = this.client.getQS(['client_secret', 'client_id'],{
      client_secret : authenticator.getClientSecret(),
      client_id : authenticator.getClientId(),
    });

    return this.client._requestHelper({
      url: 'push_subscriptions/'+args.id+'?'+qs,
      method: 'DELETE'
    },done);
};



module.exports = pushSubscriptions;