// process.env.TESTING = true;

var expect = require("chai").expect;
var request = require("request");
// const sinon = require('sinon');
var getAuthUrl = require("../oauth2server").getAuthUrl;
//
// // fake googleapis server
// var gooleServer = sinon.fakeServer.create();
// googleServer.xhr.useFilters = true;
// googleServer.autoRespond = true;

describe('getAuthUrl', () => {
  it('returns proper AuthUrl', function() {
    // What if google decides to change AuthUrl ?
    // var fn = sinon.spy();
    var url = getAuthUrl();
    expect(url).to.equal("https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me&response_type=code&client_id=627045524479-9mt03ojvsfokc05f8r2j820mjvm81a6g.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Foauth2callback");
  });
});
