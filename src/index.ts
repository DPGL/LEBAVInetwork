import http from 'http'
import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import root from "./routes";

class Server {
    private readonly _app: express.Application
    private _server: http.Server

    constructor() {
        // Chargement du fichier .env
        dotenv.config()
        this._app = express()
        this._app.set('PORT', process.env.PORT || 3000)

        // Lecture (request) - Ecriture (response)
        // Permet la lecture / ecriture de cookie
        this._app.use(cookieParser())
        // Permet la lecture de body
        this._app.use(express.json())

        this._app.use('/', root)
    }

    get app(): express.Application { return this._app }
    get server(): http.Server { return this._server }

    public async start() {
        this._server = this._app.listen(this._app.get('PORT'))
        
        const OPTIONS = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            keepAlive: true,
            retryWrites: false
        }
        const cnx = await mongoose.connect(process.env.ATLAS, OPTIONS)
        
        console.log(`Connected to ${cnx.connection.host}`)
    }
}

new Server()
.start()
.then(() => console.log(`http://localhost:${process.env.PORT}`))