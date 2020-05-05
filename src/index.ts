import app from './app';
import { createConnection} from "typeorm";
import {Options} from "graphql-yoga";
import dotenv from "dotenv";
dotenv.config();
import defaultConnectionOptions from "./ormConfig";
import decodeJWT from "./utils/decodeJWT";

const PORT : number = (process.env.PORT || 4000) as number;
const PLAYGROUND : string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND,
    endpoint: GRAPHQL_ENDPOINT,
    subscriptions: {
        path: SUBSCRIPTION_ENDPOINT,
        onConnect: async connectionParams => {
            const token = connectionParams["X-JWT"];
            if (token) {
                const user = await decodeJWT(token);
                if (user) {
                    return {
                        currentUser: user
                    }
                }
            }

            throw new Error("No JWT. Can't subscribe")
        }
    }
};

const handleAppStart = () => console.log(`Listening on port ${PORT}`);

createConnection(defaultConnectionOptions)
    .then(() => {
        app.start(appOptions, handleAppStart);
    })
    .catch(err => console.log(err));

