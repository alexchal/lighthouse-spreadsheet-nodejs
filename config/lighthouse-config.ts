const categories = ["performance", "accessibility", "seo", "best-practices"];

export const lightHouseConfig = {
    urls: ["https://www.npmjs.com/", "https://www.npmjs.com/advisories"],
    spreadsheetId: process.env.SPREADSHEET_ID,
    lighthouseOptions: [
        {
            extends: "lighthouse:default",
            settings: {
                onlyCategories: [...categories],
                emulatedFormFactor: "desktop"
            }
        },
        {
            extends: "lighthouse:default",
            settings: {
                onlyCategories: [...categories],
                emulatedFormFactor: "mobile"
            }
        }
    ]
};
