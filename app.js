/* 

marketo-dupe-checker

POC HTTP endpoint for duplicate checking in Marketo
No error handling. Not tested with Marketo API tokens. Somehow it might just work.

*/
const util = require('util')
const restify = require('restify');
const request = require('request');

var marketoInstance = ""
var accessToken = ""
var requestURL = "http://www.json-generator.com/api/json/get/bVshkCxSmq?indent=2&fakequery=" 

/*

# 2 pseudo endpoints

DUPE TRUE = http://www.json-generator.com/api/json/get/bVshkCxSmq?indent=2&fakequery=
DUPE FALSE = http://www.json-generator.com/api/json/get/bMSaqvLJIO?indent=2&fakequery=

### requestURL will need to be changed in production to - 'https://' + marketoInstance +'.mktorest.com/rest/v1/leads.json?access_token=' + accessToken + '&filterType=email&filterValues='

*/


// Listen for a request on port 8080
var server = restify.createServer();
server.listen(8080, function() {
  console.log("%s listening at %s", server.name, server.url);
});

server.get("/verify/:email", respond);


// Service to check for duplicates in Marketo
function respond(req, res, next) {
  function makeRequest( callback ){
    request(requestURL + req.params.email, function (error, response, body) {
      if (!error && response.statusCode == 200) {
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
   
  makeRequest( function(){
    checkDuplicate( function(){
      sendResponse();
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
