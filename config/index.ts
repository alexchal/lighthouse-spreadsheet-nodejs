import { LightHouseOptions } from "lighthouse";

const categories = ["performance", "accessibility", "seo", "best-practices"];

export const urls = [
  "https://www.npmjs.com/",
  "https://www.npmjs.com/advisories"
];

export const lightHouseOptions: LightHouseOptions[] = [
  {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: categories,
      emulatedFormFactor: "desktop"
    }
  },
  {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: categories,
      emulatedFormFactor: "mobile"
    }
  }
];
