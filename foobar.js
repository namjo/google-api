// module.exports = {
//   max: function(a,b) {
//     if ( a < b ) return b;
//     return a;
//   }
// }

// require-wrapper assigns export = modules.exports. Hence, this is ok.
exports.max = function(a, b) {
  if ( a < b ) {
      return b;
  }
  return a;
}
