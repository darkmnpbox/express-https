## HTTPS IN EXPRESS APP

** This is just a demonstration of how you can create a secure http express application. **

### Environment Variable
    - CLIENT_URL : for setting cors allow.
        - default : <http://localhost:4000>
    - PORT: port for the current app.
        - default : `4001`
    - API_URL : public api to get data.
        - default : <https://api.coindesk.com/v1/bpi/currentprice.json>

### Command to Run
    - Install node_modules `npm install`.
    - start application `npm start` or `npm run start`.


### Routes
    - This app contain two routes :
        - GET '/' : home page.
        - GET '/api/public' for getting data from any public api you mentioned assigned in **.env** file.
            - defualt api : <https://api.coindesk.com/v1/bpi/currentprice.json>