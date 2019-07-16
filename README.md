# kt-nodejs-redis

## Prerequisite
    brew install redis

### How to run?
    npm start
    
### Sample request
    http://localhost:3000/con-pm?id=5d21d19cdf68f60d202c1dac&date=1562660653    

### Sample response
```
{ 
  "msg": "current date [156266072] is greater than req date [156266070]",
  "data" : { 
    "userId": "5d21d19cdf68f60d202c1d1c", 
    "date":"156266070" 
  }
}
```
