import { createContext } from "context";
import { EnvironmentSchema, getEnvironment } from "./environment";
import { AppLauncher } from "./app";
import { getAppLauncher } from "../public";

export type AppContext = {
    db: any,
    i18n: any,
    env: EnvironmentSchema
};

export const appContext = createContext<AppContext>({
    db: "",
    i18n: "",
    env: getEnvironment()
});