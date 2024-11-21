import { AppLauncher } from "../core/app";

export const getAppLauncher: AppLauncher = AppLauncher.create({
    name: "scrapofcode-bot",
    description: `
        This bot is designed to help automate various processes
        and support our agency's operations.
    `,
    version: "0.1bv"
}, 3000);

getAppLauncher.launch().then(r => {});