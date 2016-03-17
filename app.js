/* 

marketo-dupe-checker

POC HTTP endpoint for duplicate checking in Marketo
No error handling. Not tested with Marketo API tokens. Somehow it might just work.

*/
const util = require('util')
const restify = require('restify');
const request = require('request');

var accessURL = "" // URL you'd use to generate access tokens - http://developers.marketo.com/documentation/rest/authentication/
var marketoInstance = "AAA-BBB-123"


// Listen for a request on port 8080
var server = restify.createServer();
server.listen(8080, function() {
  console.log("%s listening at %s", server.name, server.url);
});

server.get("/verify/:email", respond);


// Service to check for duplicates in Marketo
function respond(req, res, next) {

  function getToken( callback ){
    request(accessURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log( "getToken body: " + body )
        var e = JSON.parse(body)
        accessToken = e.access_token
        callback && callback();
      }
    })
    util.log( "Request for email: " + req.params.email )
  }

  function makeRequest( callback ){
    request('https://' + marketoInstance + '.mktorest.com/rest/v1/leads.json?access_token=' + accessToken + '&filterType=email&filterValues=' + req.params.email, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("makeRequest accessToken:" + accessToken)
        console.log("makeRequest body: " + body);
        data = JSON.parse(body)
        callback && callback();
      }
    })
    util.log( "Request for email: " + req.params.email )
  }

  function checkDuplicate( callback ){
    if(data.result.length > 0) {dupe = true;}
    else{dupe = false}
    callback && callback();
  };
   
  function sendResponse(){
    util.log("Response for email: "  + req.params.email);
    res.send({"email": req.params.email,"duplicate":dupe});
    next();
  }
  
  getToken( function(){
    makeRequest( function(){
      checkDuplicate( function(){
        sendResponse();
      });
    });
  });
}


/* 

Service to query and send responses from Marketo - The precursor to the dupe checker

function respond(req, res, next) {
  function makeRequest( callback ){
    request(requestURL + req.params.email, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        data = body
        callback && callback();
      }
    })
    util.log( "Request for email: " + req.params.name )
  }
   
  function sendResponse(){
    util.log("Response for email: "  + req.params.name);
    res.send(JSON.parse(data));
    next();
  }
   
  makeRequest( function(){
    sendResponse();
  });
}

*/
