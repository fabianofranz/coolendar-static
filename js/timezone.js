(function() {
  var jsk = {
    /******* PROPERTIES *******/
    breakingMonth : 0,
    testMonth0Offset : null,
    testMonth6Offset : null,
    /******* PRIVATE *******/
    getDateOffset : function getDate(month) {
      return new Date((new Date()).getFullYear(), month, 0).getTimezoneOffset();
    },
    getMonth0Offset : function() {
      return jsk.testMonth0Offset != null ?
        jsk.testMonth0Offset :
        jsk.getDateOffset(jsk.breakingMonth);
    },
    getMonth6Offset : function() {
      return jsk.testMonth6Offset != null ?
        jsk.testMonth6Offset :
        jsk.getDateOffset(jsk.breakingMonth+6);
    },
    offsetToString : function(offset) {
      var st = offset/60.0;
      sign = st >= 0 ? "+" : "-";

      var hour = Math.floor(Math.abs(st)); 
      hour = (hour <= 9 ? "0" : "") + hour;
      
      var min = Math.abs(st%1.0)*60;
      min = (min <= 9 ? "0" : "") + min;
      
      return sign + hour + min;
    },
    /******* PUBLIC *******/
    // Force some test offsets
    testOffset : function testOffset(month0Offset, month6Offset) {
      jsk.testMonth0Offset = month0Offset;
      jsk.testMonth6Offset = month6Offset;
    },
    // the timezone has daylight saving
    hasDst : function() {
      return jsk.st() != jsk.dst();
    },
    // Returns the standard time offset (inverted)
    invertedSt : function invertedSt() {
      return Math.max(jsk.getMonth0Offset(), jsk.getMonth6Offset());
    },
    // Returns the daylight saving time offset (inverted)
    invertedDst : function invertedDst() {
      return Math.min(jsk.getMonth0Offset(), jsk.getMonth6Offset());
    },
    // Returns the standard time offset
    st : function st() {
      return 0-jsk.invertedSt();
    },
    // Returns standard to string
    stToString : function() {
      return jsk.offsetToString(jsk.st());
    },
    // Returns the standard time offset
    dst : function dst() {
      return 0-jsk.invertedDst();
    },
    // Returns daylight saving to string
    dstToString : function() {
      return jsk.offsetToString(jsk.dst());
    }
  }
  
  // Creates the base namespaces
  if (typeof(window["jsk"]) == "undefined")
    window.jsk = {};
    
  window.jsk.tz = jsk;
})();