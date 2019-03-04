'use strict';

/**
 * Get the error message from error object
**/
exports.getErrorMessage = function(err) {
  var message = '';
  if(err.code) {
    message = 'Something went wrong.';
  } else if(err.message) {
    message = 'Something went wrong.';
  } else {
    for(var errName in err.errors) {
      if(err.errors[errName].message) {
        if(message.length > 0) message += '\r\n';
        message += err.errors[errName].message;
      }
    }
  }
  return message;
};
