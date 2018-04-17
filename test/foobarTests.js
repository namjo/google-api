var expect = require("chai").expect;
var max = require('../foobar').max;

describe('max', () => {
  it('should return the former, if the former is greater.', () => {
    var m = max(100,1);
    expect(m).to.equal(100);
  });
  it('should return the latter, if the latter is greater.', () => {
    var m = max(1,100);
    expect(m).to.equal(100);
  });
});
