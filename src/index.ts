import dotnev from "dotenv";
import lighthouse from "lighthouse";
import {
    GoogleSpreadsheet,
    ServiceAccountCredentials
} from "google-spreadsheet";
import chromeLauncher from "chrome-launcher";
import { credentials } from "../config/credentials";
import { lightHouseConfig } from "../config/lighthouse-config";
import { formatDate } from "./utils";

const { urls, lighthouseOptions, spreadsheetId } = lightHouseConfig;

dotnev.config();

const doc = new GoogleSpreadsheet(spreadsheetId as string);

const pushResultsToSpreadSheet = async (results) => {
    const sheet = doc.sheetsByIndex[0];
    const device = results.lhr.configSettings.emulatedFormFactor;

    const spreadSheetData = {
        Date: formatDate(),
        Page: results.lhr.requestedUrl,
        Platform: device[0].toUpperCase() + device.slice(1),
        Performance: results.lhr.categories.performance.score * 100,
        ["Speed Index"]: results.lhr.audits["speed-index"].displayValue,
        ["Time to Interactive"]: results.lhr.audits.interactive.displayValue,
        Accessibility: results.lhr.categories.accessibility.score * 100,
        ["Best Practices"]:
            results.lhr.categories["best-practices"].score * 100,
        SEO: results.lhr.categories.seo.score * 100
    };

    try {
        await sheet.addRow(spreadSheetData);
        console.log(`Report is done for ${results.lhr.finalUrl} (${device})`);
        console.log("Successfully publish results to GoogleSpreadSheet");
    } catch (error) {
        console.log("Something went wrong", error);
    }
};

const launchChromeAndRunLighthouse = async (urls) => {
    const lighthouseResults = async (url: string): Promise<void> => {
        for (let i = 0; i < lighthouseOptions.length; i++) {
            const chrome = await chromeLauncher.launch({
                chromeFlags: ["--headless"]
            });
            const flags = {
                logLevel: "info",
                port: chrome.port
            };
            let options = lighthouseOptions[i];

            const results = await lighthouse(url, flags, options);

            await pushResultsToSpreadSheet(results);

            await chrome.kill();
        }
    };

    const lighthousePromises = [];

    for (let i = 0; i < urls.length; i++) {
        //@ts-ignore
        lighthousePromises.push(await lighthouseResults(urls[i], i));
    }

    return await Promise.all(lighthousePromises);
};
const jsoncredentials = JSON.stringify(credentials);

const init = async () => {
    await doc.useServiceAccountAuth(
        (jsoncredentials as unknown) as ServiceAccountCredentials
    );
    await doc.loadInfo();
    await launchChromeAndRunLighthouse(urls);
    console.log("---------------------DONE---------------------");
};

init();
