import { createKysely } from "@vercel/postgres-kysely";
import getAppConfig from "../utils/app-config";
import { DbTables } from "./table";

export const databaseClient = () => {
    const appConfig = getAppConfig();
    
    return createKysely<DbTables>({
        connectionString: appConfig.database.url
    });
}