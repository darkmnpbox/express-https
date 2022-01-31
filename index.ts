import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import https from 'https';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

require('dotenv').config();

const CLIENT_URL: string = process.env.CLIENT_URL ?? 'http://localhost:4000';
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4001;
const API_URL: string = process.env.API_URL ?? 'https://api.coindesk.com/v1/bpi/currentprice.json';

const app: express.Application = express();

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

app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname + '/../cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname + '/../cert/cert.pem'))
}, app)


app.get('/', (req: Request, res: Response) => {
    res.send(`<h1>HOME PAGE</h1>`);
})


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



// app.listen(PORT, () => {
//     console.log(`server is running on http://localhost:${PORT}`);
// })

sslServer.listen(PORT, () => {
    console.log(`secure server is running on https://localhost:${PORT}`);
})