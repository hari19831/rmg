/*jshint esversion: 8 */

const HTTPSTATUS = require("http-status-codes"),
    OUTPUT = require("../models/output");
    
module.exports.projectValidator = async (req, res, next) => {
    let _output = new OUTPUT();
    try {
        let body = req.body;
        if (body.product_name == undefined || body.product_name == "") { throw ({ message: "product_name should be provided." }); }
        next();
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

