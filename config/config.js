/*jshint esversion: 8 */

/**
 * Module dependencies.
 */
var PATH = require('path');



/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
    // read package.json for PEAN.JS project information
    var CONFIG = require(PATH.resolve('./package.json'));
    CONFIG.port = process.env.port != undefined ? process.env.port : CONFIG.port;
    CONFIG.crypto_key = 'SW50ZWdyYQ==';
    CONFIG.SharedKey = 'aW50ZWdyYUNhY2hlU2VydmljZQ==';
    return CONFIG;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
