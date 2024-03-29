import lighthouse, { FlagsType, LighthouseResultType } from "lighthouse";
import {
  GoogleSpreadsheet,
  ServiceAccountCredentials,
} from "google-spreadsheet";
import { launch } from "chrome-launcher";
import dotnev from "dotenv";
import { urls, lightHouseOptions } from "../config";

dotnev.config();

const credentials: ServiceAccountCredentials = {
  client_email: process.env.CLIENT_EMAIL as string,
  private_key: (process.env.PRIVATE_KEY as string).replace(/\\n/gm, "\n"),
};

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID as string);

const pushResultsToSpreadSheet = async (results: LighthouseResultType) => {
  const sheet = doc.sheetsByIndex[0];
  const device = results.lhr.configSettings.emulatedFormFactor;

  const spreadSheetData = {
    Date: new Intl.DateTimeFormat("en-GB").format(new Date()),
    Page: results.lhr.requestedUrl,
    Platform: device[0].toUpperCase() + device.slice(1),
    Performance: results.lhr.categories.performance.score * 100,
    "Speed Index": results.lhr.audits["speed-index"].displayValue,
    "Time to Interactive": results.lhr.audits.interactive.displayValue,
    Accessibility: results.lhr.categories.accessibility.score * 100,
    "Best Practices": results.lhr.categories["best-practices"].score * 100,
    SEO: results.lhr.categories.seo.score * 100,
  };

  await sheet.addRow(spreadSheetData);

  console.log(
    `Successfully published results for ${results.lhr.finalUrl} ${results.lhr.configSettings.emulatedFormFactor}`,
  );
};

const launchChromeAndRunLighthouse = async (urls: string[]) => {
  const lighthouseResults = async (url: string): Promise<void> => {
    for (let i = 0; i < lightHouseOptions.length; i++) {
      const chrome = await launch({
        chromeFlags: ["--headless"],
      });

      const flags: FlagsType = {
        logLevel: "info",
        port: chrome.port,
      };

      const options = lightHouseOptions[i];

      const results = await lighthouse(url, flags, options);

      chrome.kill();

      await pushResultsToSpreadSheet(results);
    }
  };

  const lighthousePromises = [];

  for (let i = 0; i < urls.length; i++) {
    lighthousePromises.push(await lighthouseResults(urls[i]));
  }

  Promise.all(lighthousePromises).then(() => {
    console.log("---------------------DONE---------------------");
  });
};

const init = async () => {
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo();
  await launchChromeAndRunLighthouse(urls);
};

init();
