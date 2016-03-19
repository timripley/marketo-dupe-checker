/*

marketo-dupe-checker

POC HTTP endpoint for duplicate checking in Marketo
No error handling. Not tested with Marketo API tokens. Somehow it might just work.

*/
const restify = require('restify');
const request = require('request');

const accessURL = "" //URL to generate access token  - http://developers.marketo.com/documentation/rest/authentication/
const marketoInstance = "AAA-BBB-123" //Marketo instance



// Listen for a request on port 8080
var server = restify.createServer();
server.use(restify.CORS()); //Enable cross-origin HTTP request HTTP Header in Restify if needed

server.listen(8080, function() {
  console.log("%s listening at %s", server.name, server.url);
});

server.get("/verify/:email", respond);


// Service to check for duplicates in Marketo
function respond(req, res, next) {
  console.log( new Date().toString() + " - Request for email: " + req.params.email )

  function getToken( callback ){
    request(accessURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var e = JSON.parse(body)
        accessToken = e.access_token
        callback && callback();
      }
    })
  }

  function makeRequest( callback ){
    request('https://' + marketoInstance + '.mktorest.com/rest/v1/leads.json?access_token=' + accessToken + '&filterType=email&filterValues=' + req.params.email, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        data = JSON.parse(body)
        callback && callback();
      }
    })
  }

  function checkDuplicate( callback ){
    if(data.result.length > 0) {exists = true;}
    else{exists = false}
    callback && callback();
  };

  function sendResponse(){
    res.send({"email": req.params.email,"exists":exists});
    console.log( new Date().toString() + " - Response sent for email: " + req.params.email )
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
