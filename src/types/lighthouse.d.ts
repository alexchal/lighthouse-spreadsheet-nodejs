declare module "lighthouse" {
  type TScore = {
    score: number;
  };

  type AuditsType = {
    interactive: {
      displayValue: string;
    };
    "speed-index": {
      displayValue: string;
    };
  };

  type CategoriesType = {
    performance: TScore;
    accessibility: TScore;
    seo: TScore;
    "best-practices": TScore;
  };

  type LhrTypes = {
    finalUrl: number;
    requestedUrl: string;
    audits: AuditsType;
    categories: CategoriesType;
    configSettings: {
      emulatedFormFactor: string;
    };
  };

  export type FlagsType = {
    logLevel: "info";
    port: number;
  };

  export type LightHouseOptions = {
    extends: string;
    settings: {
      onlyCategories: string[];
      emulatedFormFactor: string;
    };
  };

  export type LighthouseResultType = {
    lhr: LhrTypes;
  };

  function lighthouse(
    url: string,
    flags: FlagsType,
    options: LightHouseOptions,
  ): Promise<LighthouseResultType>;

  export default lighthouse;
}
