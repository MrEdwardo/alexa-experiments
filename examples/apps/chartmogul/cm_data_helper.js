'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var ENDPOINT = 'https://api.chartmogul.com/v1/'
var token1 = '2bb03f684bbc42051654721dfbf34375'
var token2 = '3dbbe4120d1328eee0f3fe4a129b96cb'

function CMDataHelper() {
}

CMDataHelper.prototype.requestMRRStatus = function(date) {
  return this.getMRRStatus(date).then(
    function(response) {
      console.log('success - received mrr info for ' + date);
      return response.body;
    }
  );
};

CMDataHelper.prototype.getMRRStatus = function(date) {
  
  var endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);

  var options = {
    method: 'GET',
    uri: ENDPOINT + `metrics/mrr`,
    qs: {
      `start-date` : date,
      `end-date` : endDate,
      `interval` : `day`
    },
    auth: {
      token1 : token2
    },
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};

CMDataHelper.prototype.formatMRRStatus = function(mrrStatus) {

    return _.template('Your monthly recurring revenue for that date is ${mrr}.')({
    mrr: mrrStatus.entries[0].mrr
    });

};

module.exports = CMDataHelper;