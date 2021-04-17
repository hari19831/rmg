const SWAGGERJSDOC = require("swagger-jsdoc"),
    SWAGGERUI = require("swagger-ui-express"),
    PACKAGEJSON = require("../../package.json");

module.exports.initSwaggerUI = function (app) {
    const options = {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "Integra Rabbit MQ API's",
                version: PACKAGEJSON.version,
                description:
                    "This is a Integra's rabbitMQ handling API's based on different Products.",
                contact: {
                    name: "Integra Software Service pvt. ltd.",
                    url: "https://integra.co.in/"
                }
            },
            components: {
                securitySchemes: {
                    Auth: {
                        type: "apiKey",
                        in: "header",
                        name: "apikey",
                        description: "Api key of the product"
                    }
                }
            },
        },
        apis: ['./app/routers/router*.js'],
    };

    const specs = SWAGGERJSDOC(options);
    app.use(
        "/api-docs",
        SWAGGERUI.serve,
        SWAGGERUI.setup(specs, { explorer: true })
    );
};