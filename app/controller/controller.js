/*jshint esversion: 8 */
/*jshint -W083 */

const HTTPSTATUS = require('http-status-codes'),
    OUTPUT = require("../models/output"),
    REPO = require('../repository/repository'),
    //const { ProductKeyAuth } = require('../middleware/auth.middleware'),
    RABBITMQ = require('../helpers/rabbitmq'),
    CHECKCRED = require('../validator/logindata'),
    FS = require('fs'),
    PATH = require("path"),
    PRODUCT = require('../models/product'),
    QUEUE = require('../models/queue');
const output = require('../models/output');

module.exports.projectPath = (product_name) => {
    return PATH.join(__dirname, "../../database/" + product_name + ".json");
};


exports.WelcomeAPI = async function (req, res) {
    var _output = new OUTPUT();
    try {
        _output.data = {};
        _output.isSuccess = true;
        _output.message = "Welcome to Integra RabbitMQ";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.CreateProduct = async (req, res) => {
    let products = new PRODUCT().assignValues(req.body);
    delete products.assignValues;
    let _output = new OUTPUT();
    try {
        let isUpdate = REPO.isNewProject(products.product_name);
        if (isUpdate) {
            await REPO.updateProduct(products, _output);
        } else {
            await RABBITMQ.CreateVirtualHost(products.product_name);
            await RABBITMQ.AddUserToVirtualHost(products.product_name);
            await REPO.createProduct(products, _output);
        }
        _output.is_success = true;
        _output.message = "Project updated successfully.";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.InsertQueueProduct = async (req, res) => {
    let _output = new OUTPUT();
    let _queue = new QUEUE();
    try {
        req.body.exchangeName = req.product.product_key + "_" + req.body.exchangeType;
        req.body.options = req.body.options ? req.body.options : {};
        _queue.assignValues(req.body);
        _queue.vhost = req.product.product_name;
        _queue = _queue.clearData();
        if (_queue.queueName == "" || _queue.queueName == undefined) { throw ({ message: "queueName must be provided." }) }
        else if (_queue.exchange.exchangeType == "" || _queue.exchange.exchangeType == undefined) { throw ({ message: "exchangeType must be provided." }) }
        else if (!(_queue.exchange.exchangeType == "direct" || _queue.exchange.exchangeType == "fanout" || _queue.exchange.exchangeType == "topic" || _queue.exchange.exchangeType == "default" || _queue.exchange.exchangeType == "headers")) { throw ({ message: "action (direct/fanout/topic/default/header) must be provided." }); }
        else {
            if (_queue.exchange.exchangeType == "direct" || _queue.exchange.exchangeType == "topic" || _queue.exchange.exchangeType == "headers") {
                if (_queue.exchange.exchangeKey == undefined || _queue.exchange.exchangeKey == "") { throw ({ "message": "exchangeKey must be provided." }) }
            }
            let keys = Object.keys(_queue.options)
            keys.forEach(key => {
                _queue.options[key] = _queue.options[key] == '' ? undefined : _queue.options[key];
            });
            _queue.options = JSON.parse(JSON.stringify(_queue.options));
            await RABBITMQ.CreateQueue(_queue);
            let _productinfo = JSON.parse(FS.readFileSync(this.projectPath(req.product.product_name)).toString());
            let productinfo = JSON.parse(JSON.stringify(_productinfo[_productinfo.length - 1]));
            let queueDetails = productinfo.queue_details;
            let queue = queueDetails.filter((value) => value.queueName == _queue.queueName)
            if (queue.length != 0) {
                if ((queueDetails.filter((value) => value.queueName == _queue.queueName)).length) {
                    throw ({ message: "Same Queue Name already exists." })
                }
                productinfo.queue_details.push(_queue);
            }
            else {
                productinfo.queue_details.push(_queue);
            }
            await REPO.updateProduct(productinfo, _output)
            _output.is_success = true;
            _output.message = "Queue created successfully.";
            res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
        }
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }

}

exports.getProduct = async (req, res) => {
    let _output = new OUTPUT();
    try {
        _output.data = await REPO.getProductInformation(req.product.product_name);
        _output.is_success = true;
        _output.message = "Product Information";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};


exports.deleteQueue = async (req, res) => {
    let _output = new OUTPUT();
    try {
        _output.data = await REPO.deleteQueue(req.product, req.body);
        _output.is_success = true;
        _output.message = "Queue deleted successfully";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.publishMessage = async (req, res) => {
    let _output = new OUTPUT();
    try {
        if (req.body.queueName == undefined || req.body.queueName == "") { throw ({ message: "queueName must be provided." }) }
        else if (req.body.msg == undefined || req.body.msg == "") { throw ({ message: "msg must be provided." }) }
        else {
            _output.data = await REPO.publishMessage(req.product, req.body);
            _output.is_success = true;
            _output.message = "sent Information";
            res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
        }
    }
    catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
}

exports.receiveMessage = async (req, res) => {
    let _output = new OUTPUT();
    try {
        _output.data = await REPO.consumeMessage(req.product, req.body);
        _output.is_success = true;
        _output.message = "Receive Message";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    }
    catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
}

exports.getAllProduct = async (req, res) => {
    let _output = new OUTPUT();
    try {
        _output.data = await REPO.getAllProductInformation();
        _output.is_success = true;
        _output.message = "Product Information";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.clearQueueMessage = async (req, res) => {
    let _output = new OUTPUT();
    try {
        if (req.body.queueName == undefined || req.body.queueName == "") { throw ({ message: "queueName must be provided." }) }
        let queue = req.product.queue_details.filter(x => x.queueName == req.body.queueName);
        queue = queue[queue.length - 1];
        if (queue == undefined) { throw ({ "message": "No such queueName available in this project." }) }
        let input = { queue: queue, vhost: req.product.product_name }
        _output.data = await REPO.clearQueueMessage(input);
        _output.is_success = true;
        _output.message = "Queue Messages cleared successfully.";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
}

exports.getAllQueue = async (req, res) => {
    let _output = new OUTPUT();
    try {
        let productinfo = req.product;
        _output.data = await REPO.getAllQueueInformation(productinfo);
        _output.is_success = true;
        _output.message = "Queue Information";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.deactivateProduct = async (req, res) => {
    let _output = new OUTPUT();
    try {
        await REPO.deactivevateProduct(req.product, _output);
        _output.is_success = true;
        _output.message = "Product Information";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.activateProduct = async (req, res) => {
    let _output = new OUTPUT();
    try {
        await REPO.activevateProduct(req.product, _output);
        _output.is_success = true;
        _output.message = "Product Information";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.deleteProduct = async (req, res) => {
    let _output = new OUTPUT();
    try {
        await REPO.deleteProductByName(req.body, _output);
        await RABBITMQ.DeleteVirtualHost(req.product.product_name);
        _output.is_success = true;
        _output.message = "Product delete by it's name";
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

exports.login = async (req, res) => {
    let _output = new OUTPUT();
    let checkCredential = new CHECKCRED();
    try {
        await REPO.loginDashboard(req.body, _output, checkCredential);
        res.status(HTTPSTATUS.StatusCodes.OK).send(_output);
    } catch (error) {
        _output.data = error.message;
        _output.is_success = false;
        _output.message = error.message;
        res.status(HTTPSTATUS.StatusCodes.UNPROCESSABLE_ENTITY).send(_output);
    }
};

