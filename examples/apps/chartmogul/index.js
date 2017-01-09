'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('chartmogul');
var CMDataHelper = require('./cm_data_helper');

app.launch(function(req, res) {
  var prompt = 'For SaaS metrics information, prompt me for a date.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('GetMRR', {
  'slots': {
    'DATE': 'DATE'
  }
},
  function(req, res) {
    //get the slot
    var date = req.slot('DATE');
    var reprompt = 'Tell me a date to get information on your revenue.';
    if (_.isEmpty(date)) {
      var prompt = 'I didn\'t hear a date. Tell me a date.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var cmHelper = new CMDataHelper();
      cmHelper.requestMRRStatus(date).then(function(mrrStatus) {
        console.log(mrrStatus);
        res.say(cmHelper.formatMRRStatus(mrrStatus)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for the date of ' + date;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;