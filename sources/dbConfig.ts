import { ConnectionOptions } from "typeorm";

export const load = (ormconfigPath: string): ConnectionOptions => {
    const typeormConfig = require(ormconfigPath);

    return {
        ...typeormConfig,

        cli: undefined,
        entities: [
            `${__dirname}/models/entities/*{.ts,.js}`,
        ],
        migrations: undefined,
    };
};
