# marketo-dupe-checker
##### Hacked together HTTP endpoint for duplicate checking in Marketo. Might work.
>
> Hasn't been tested at all and doesn't do any error handling.
> 
> Start with
> $ node app.js

> Update the Marketo API tokens and requestURL variable. You then you might be able to test an emailaddres with
> $ curl -is http://localhost:8080/verify/EMAILADDRESS
