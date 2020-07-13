/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This is a simple sample that will demonstrate how to use the
// API connecting to a HyperLedger Blockchain Fabric
//
// The scenario here is using a simple model of a participant of 'Student'
// and a 'Test' and 'Result'  assets.

'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const prettyjson = require('prettyjson');
const prettyoutput = require('prettyoutput')
const emailService = require('./email')



// these are the credentials to use to connect to the Hyperledger Fabric
let cardname = 'admin@test-electric';

/** Class for the Meter registry*/
class Meter {
  constructor() {
    this.bizNetworkConnection = new BusinessNetworkConnection();
  }

  async init() {
    try {
      this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardname);
    }
    catch (error) {
      console.error(error);
      process.exit(1);
    }
  }


  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  async updateMeter(transactionData) {
    var _this = this;
    var resource;
    var serializer;
    transactionData['$class'] = "test.MeterUpdate";
    return await this.bizNetworkConnection.getTransactionRegistry("test.MeterUpdate")
      .then(function (createProductTransactionRegistry) {
        serializer = _this.businessNetworkDefinition.getSerializer()
        resource = serializer.fromJSON(transactionData);
        return _this.bizNetworkConnection.submitTransaction(resource);
      })
  }

  async updateMeters() {
    try {

      let MeterRegistry = await this.bizNetworkConnection.getAssetRegistry('test.Meter');
      let aResources = await MeterRegistry.getAll();
      var transactionData = {}
      for (let i = 0; i < aResources.length; i++) {
        let x = this.getRandomInt(200)
        transactionData["meter"] = "resource:test.Meter#" + aResources[i].MeterId;
        transactionData["usage"] = x;
        await this.updateMeter(transactionData);
      }
      return "Successfully Updated " + aResources.length + " Meters consumptions";
    } catch (error) {
      console.log(error);
      this.log.error(METHOD, 'uh-oh', error);
    }

  }


  async sendEmails(dateString) {
    var start = new Date(String(dateString))
    //console.log(start)
    start.setHours(start.getHours() - 2)
    var end = new Date(dateString);
    end.setHours(23, 59, 59, 999);
    let MeterRegistry = await this.bizNetworkConnection.getAssetRegistry('test.Meter');
    let CustomerRegistry = await this.bizNetworkConnection.getParticipantRegistry('test.Customer');
    let meters = await MeterRegistry.getAll();
    var meterObj = [];
    var meterResult = {};
    var serializer;
    for (let i = 0; i < meters.length; i++) {
      let q1 = this.bizNetworkConnection.buildQuery(
        `SELECT test.MeterUpdate
        WHERE (meter == 'resource:test.Meter#${meters[i].MeterId}' AND timestamp >=  _$justnow  AND timestamp < _$last )`
      );
      let query = await this.bizNetworkConnection.query(q1, { justnow: start, last: end });

      let sum = 0;
      for (let j = 0; j < query.length; j++) {
        sum += query[i].usage;
      }
      meterResult["usage"] = sum;
      meterResult["Date"] = start;
      let day = start.getDate();
      let month = start.getMonth() + 1;
      let year = start.getFullYear()

      meterResult["invoice"] = day + "-" + month
      meterResult["Date"] = day + "-" + month + "-" + year;
      serializer = this.businessNetworkDefinition.getSerializer()
      let meter = serializer.toJSON(meters[i])
      var res = meter.owner.split("#")
      try {
        let Customer = await CustomerRegistry.get(res[1])
        let custom = serializer.toJSON(Customer)
        let meterJson = serializer.toJSON(meters[i])

        meterResult["TotalBalance"] = meterJson.balance
        meterResult["houseNumber"] = meterJson.houseNumber
        meterResult["Owner"] = custom

        meterObj.push(meterResult)
        meterResult = {}

      }
      catch (err) {
        console.log(err)
      }
    }

    try {
      let sentemails = emailService(meterObj)
      return sentemails;
    } catch (error) {

      throw error;

    }

  }


  async getHistory() {

    let MeterRegistry = await this.bizNetworkConnection.getAssetRegistry('test.Meter');
    let meters = await MeterRegistry.getAll();
    var date = new Date("2020-04-13");

    var end = new Date("2020-04-13");
    end.setHours(23, 59, 59, 999);
    //console.log(end)

    var meterObj = [];
    var meterResult = {};
    var serializer;
    for (let i = 0; i < meters.length; i++) {
      let q1 = this.bizNetworkConnection.buildQuery(
        `SELECT test.MeterUpdate
            WHERE (meter == 'resource:test.Meter#${meters[i].MeterId}' AND timestamp >=  _$justnow  AND timestamp < _$last )`
      );
      let query = await this.bizNetworkConnection.query(q1, { justnow: date, last: end });
      let sum = 0;
      for (let j = 0; j < query.length; j++) {
        sum += query[i].usage;
      }
      meterResult["usage"] = sum;
      meterResult["Date"] = date;
      serializer = this.businessNetworkDefinition.getSerializer()
      meterResult["IoTMeter"] = serializer.toJSON(meters[i])
      meterObj.push(meterResult)
      meterResult = {}
    }
    return meterObj

  }

}

module.exports = Meter;