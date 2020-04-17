import { ConnectionOptions} from "typeorm";

const defaultConnectionOptions: ConnectionOptions = {
  type: "postgres",
  database:  process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: ["entities/**/*.*"],
  host: process.env.DB_ENDPOINT,
  port: (process.env.DB_PORT || 5432) as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
};

export default defaultConnectionOptions;