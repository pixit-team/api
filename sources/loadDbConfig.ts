import { ConnectionOptions } from "typeorm";

const loadDbConfig = (ormconfigPath: string): ConnectionOptions => {
  const typeormConfig = require(ormconfigPath); // eslint-disable-line

  return {
    ...typeormConfig,

    cli: undefined,
    entities: [`${__dirname}/models/entities/*{.ts,.js}`],
    migrations: undefined,
  };
};

export default loadDbConfig;
