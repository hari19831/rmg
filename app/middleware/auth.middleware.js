/*jshint esversion: 8 */

const HTTPSTATUS = require("http-status-codes"),
    OUTPUT = require("../models/output"),
    COMMON = require("../helpers/common"),
    CONFIG = require("../../config/config"),
    FS = require("fs"),
    PATH = require("path"),
    { isUndefined } = require("lodash");

exports.ProductKeyAuth = async function (req, res, next) {
    var _output = new OUTPUT();
    try {
        if (req.connection.product) {
            req.product = req.connection.product;
            next();
        }
        else {
            if (req.headers.apikey == undefined) { throw ({ message: "Authorization Failed: apikey missing" }); }
            let apiKey = req.headers.apikey;
            apiKey = await COMMON.decryptSync(apiKey).catch(err => { throw ({ message: "Authorization Failed: invalid apikey" }); });
            if (!COMMON.isJSON(apiKey)) { throw ({ message: "Authorization Failed: invalid apikey" }); }
            apiKey = JSON.parse(apiKey);
            let validateResult = validateKey(apiKey, req);
            if (validateResult.valid == false) { throw ({ message: validateResult.error }); }
            else {
                next();
            }
        }
    } catch (error) {
        _output.is_success = false;
        _output.message = error.message;
        _output.data = {};
        res.status(HTTPSTATUS.StatusCodes.UNAUTHORIZED).send(_output);
    }
};

exports.ProductAuth = async function (req, res, next) {
    var _output = new OUTPUT();
    try {
        if (req.connection.product) {
            req.product = req.connection.product;
            next();
        }
        else {
            if (req.headers.apikey == undefined) { throw ({ message: "Authorization Failed: apikey missing" }); }
            let apiKey = req.headers.apikey;
            apiKey = await COMMON.decryptSync(apiKey).catch(err => { throw ({ message: "Authorization Failed: invalid apikey" }); });
            if (!COMMON.isJSON(apiKey)) { throw ({ message: "Authorization Failed: invalid apikey" }); }
            req.product = JSON.parse(apiKey);
            next();
        }
    } catch (error) {
        _output.is_success = false;
        _output.message = error.message;
        _output.data = {};
        res.status(HTTPSTATUS.StatusCodes.UNAUTHORIZED).send(_output);
    }
};

exports.AuthProductKeyAuth = async function (req, res, next) {
    var _output = new OUTPUT();
    try {
        if (req.connection.product) {
            req.product = req.connection.product;
            next();
        }
        else {
            throw ({ message: "Authorization Failed: apikey missing" });
        }
    } catch (error) {
        _output.is_success = false;
        _output.message = error.message;
        _output.data = {};
        res.status(HTTPSTATUS.StatusCodes.UNAUTHORIZED).send(_output);
    }
};


var validateKey = (apikey, req) => {
    try {
        if (COMMON.FileExists(PATH.join(__dirname, "../../database/" + apikey.product_name + ".json")) == false) { throw ({ message: "This project is Deleted." }) }
        let productinfo = FS.readFileSync(PATH.join(__dirname, "../../database/" + apikey.product_name + ".json"));
        productinfo = JSON.parse(productinfo.toString());
        productinfo = productinfo.filter(x => x.is_active == true).sort(x => x.version)
        productinfo = productinfo[productinfo.length - 1];
        if (productinfo == undefined) { return {valid:false,error:"Product is inactive/invalid apikey"}; }
        else {
            if (productinfo.product_key != apikey.product_key) { return false; }
            else {
                req.product = productinfo;
                return { valid: true, error: "" };
            }
        }
    } catch (error) {
        return { valid: false, error: error.message };
    }
};

exports.apiPrivateKey = async function (req, res, next) {
    var _output = new OUTPUT();
    try {
        if (req.headers.apikey == undefined) { throw ({ message: "Authorization Failed: apikey missing" }); }
        else if (req.headers.apikey != CONFIG.SharedKey) { throw ({ message: "Authorization Failed: invalid apikey" }); }
        else {
            next();
        }
    } catch (error) {
        _output.is_success = false;
        _output.message = error.message;
        _output.data = {};
        res.status(HTTPSTATUS.StatusCodes.UNAUTHORIZED).send(_output);
    }
};
