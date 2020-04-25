import app from './app';
import { createConnection} from "typeorm";
import {Options} from "graphql-yoga";
import dotenv from "dotenv";
dotenv.config();
import defaultConnectionOptions from "./ormConfig";

const PORT : number = (process.env.PORT || 4000) as number;
const PLAYGROUND : string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND,
    endpoint: GRAPHQL_ENDPOINT
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

createConnection(defaultConnectionOptions)
    .then(() => {
        app.start(appOptions, handleAppStart);
    })
    .catch(err => console.log(err));

