import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import https from 'https';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

/**
 * getting all environment variables.
 */

require('dotenv').config();

const CLIENT_URL: string = process.env.CLIENT_URL ?? 'http://localhost:4000';
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4001;
const API_URL: string = process.env.API_URL ?? 'https://api.coindesk.com/v1/bpi/currentprice.json';

// create app instance
const app: express.Application = express();

// options for cors
const options: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: CLIENT_URL,
    preflightContinue: false,
}

// add cors and body-parser to app.
app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// convert app instance to https by configure with cert.pem, key.pem
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname + '/../cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname + '/../cert/cert.pem'))
}, app)

//  home page
app.get('/', (req: Request, res: Response) => {
    res.send(`<h1>HOME PAGE</h1>`);
})

app.post('/', (req: Request, res: Response) => {
    res.send(`<p>Created Post</p>`)
})

// pubic api data collecting
app.get('/api/public', async (req: Request, res: Response) => {
    try {
        let data: any;
        await axios(API_URL)
            .then(res => {
                data = res.data;
            })
        const utc = data?.time?.updated
        utc ? console.log(new Date(utc).toLocaleTimeString()) : console.log('Updated time not given');
        res.status(200).json(data);
        console.log(`data fetched succesfully from ${API_URL}, responding to request...`);
    } catch (error) {
        console.log(`error occured while trying to fetch ${API_URL}, responding with erorr message`);
        console.log(error);
        res.status(500).send(error);
    }
})


/**
 * if you want to run app in http just uncommnet below part and commnet sslServer listen part.
 */
// app.listen(PORT, () => {
//     console.log(`server is running on http://localhost:${PORT}`);
// })

/**
 * https server listening.
 */

sslServer.listen(PORT, () => {
    console.log(`secure server is running on https://localhost:${PORT}`);
})