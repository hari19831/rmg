/*jshint esversion: 8 */

const COMMON = require('../helpers/common'),
    PATH = require("path"),
    RABBITMQ = require("../helpers/rabbitmq"),
    FS = require('fs');


exports.getProductInformation = async (product) => {
    return await new Promise((resolve, reject) => {
        try {
            let filePath = PATH.join(__dirname, "../../database/" + product + ".json");
            if (COMMON.FileExists(filePath) == false) { throw ({ message: "This project does not exists." }) }
            let productinfo = JSON.parse(FS.readFileSync(filePath).toString());
            productinfo = productinfo.filter(x => x.is_active == true).sort(x => x.version)
            productinfo = productinfo[productinfo.length - 1];
            resolve(productinfo);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.projectPath = (product_name) => {
    return PATH.join(__dirname, "../../database/" + product_name + ".json");
};

module.exports.isNewProject = (product_name) => {
    try {
        let _projectPath = this.projectPath(product_name);
        return COMMON.FileExists(_projectPath);
    } catch (error) {
        return false;
    }
};


module.exports.createProduct = async (products, _output) => {
    return new Promise(async (resolve, reject) => {
        try {
            let productinfo = [];
            products.version = 1;
            products.product_key = COMMON.guid();
            products.apikey = await COMMON.encodeSync(JSON.stringify({
                product_key: products.product_key,
                product_name: products.product_name
            }));
            _output.data = { apikey: products.apikey };
            productinfo.push(products);
            let direc = PATH.join(__dirname, `../../database`)
            if (!FS.existsSync(direc)) {
                FS.mkdirSync(direc);
            }
            await COMMON.WriteFileContent(this.projectPath(products.product_name), productinfo);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.updateProduct = async (products, _output) => {
    return new Promise(async (resolve, reject) => {
        try {
            let productinfo = JSON.parse(FS.readFileSync(this.projectPath(products.product_name)).toString());
            let _oldProducts = productinfo.filter(x => x.is_active == true).sort(x => x.version).pop();
            productinfo.forEach(element => { element.is_active = false; });
            products.version = productinfo.sort(x => x.version)[productinfo.length - 1].version + 1;
            products.product_key = _oldProducts.product_key;
            products.apikey = _oldProducts.apikey;
            productinfo.push(products);
            await COMMON.WriteFileContent(this.projectPath(products.product_name), productinfo);
            _output.data = {};
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


exports.getAllProductInformation = async () => {
    return await new Promise(async (resolve, reject) => {
        try {
            let result = [];
            let newResult = [], finalResutl = [];
            let databasePath = PATH.join(__dirname, "../../database")
            if (FS.existsSync(databasePath) == true) {
                let files = await COMMON.readFilesSync(databasePath);
                for (var i = 0; i < files.length; i++) {
                    const content = FS.readFileSync(files[i].filepath, 'utf-8');
                    result.push(JSON.parse(content));
                }
                result.forEach(val => {
                    val.forEach(values => {
                        newResult.push(values);
                    });
                });
                let distGroup = [];
                newResult.map(value => {
                    if (!distGroup.includes(value.product_name))
                        distGroup.push(value.product_name);
                });
                distGroup.forEach(output => {
                    if (newResult.filter(xy => xy.product_name == output && xy.is_active == true).length > 0)
                        finalResutl.push(newResult.filter(xy => xy.product_name == output && xy.is_active == true)[0]);
                    else {
                        result = newResult.filter(x => x.product_name == output && x.is_active == false);
                        if (result.length > 0) {
                            result.sort(function (a, b) {
                                return a.version - b.version;
                            });
                            finalResutl.push(result[result.length - 1]);
                        }
                    }
                });
            }
            else {
                finalResutl = [];
            }
            resolve(finalResutl);
        } catch (error) {
            reject(error);
        }
    });
};
exports.getAllQueueInformation = async (productinfo) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let queueinfo = productinfo.queue_details
            for (let index = 0; index < queueinfo.length; index++) {
                let element = queueinfo[index];
                element.vhost = productinfo.product_name;
                element.messageCount = await RABBITMQ.getAllMessageCount(element);
            }
            resolve(queueinfo)
        } catch (error) {
            reject(error);
        }
    });
};

exports.clearQueueMessage = async (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            await RABBITMQ.purgeQueue(input);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

exports.deleteQueue = async (product, input) => {
    return await new Promise(async (resolve, reject) => {
        try {
            if (input.queueName == undefined || input.queueName == "") { throw ({ "message": "QueueName should be provided" }) }
            let queue = product.queue_details.filter(x => x.queueName == input.queueName).pop();
            if (queue == undefined) { throw ({ "message": "No such queueName available in this project." }) }
            let _input = {
                queue: queue,
                vhost: product.product_name
            };
            await RABBITMQ.deleteQueue(_input)
            product.deletequeue_details.push(queue);
            product.queue_details = product.queue_details.filter(x => x.queueName != input.queueName);
            //await RABBITMQ.deleteQueue(Queue.project_queuename);
            await this.updateProduct(product, {});
            resolve(true);


        } catch (error) {
            reject(error);
        }
    });
}

exports.publishMessage = async (product, input) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let queue = product.queue_details.filter(x => x.queueName == input.queueName).pop();
            if (queue == undefined) { throw ({ "message": "No such queueName available in this project." }) }
            else if ((queue.exchange.exchangeType == "direct" || queue.exchange.exchangeType == "topic" || queue.exchange.exchangeType == "headers") &&
                (input.exchangeKey == undefined || input.exchangeKey == "")) {
                throw ({ message: "exchangeKey must be provided for exchangeType : " + queue.exchange.exchangeType });
            }
            let _input = {
                queue: queue,
                key: (queue.exchange.exchangeType == "direct" || queue.exchange.exchangeType == "topic" || queue.exchange.exchangeType == "headers") ? input.exchangeKey : "",
                msg: input.msg,
                vhost: product.product_name
            };
            await RABBITMQ.createExchangeAndPublish(_input);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

exports.consumeMessage = async (product, input) => {
    return await new Promise(async (resolve, reject) => {
        try {
            if (input.queueName == "" || input.queueName == undefined) { throw ({ message: "queuename should be provided" }) }
            let queue = product.queue_details.filter(x => x.queueName == input.queueName).pop();
            if (queue.length == 0) { throw ({ "message": "No such queueName available in this project." }); }
            else if ((queue.exchange.exchangeType == "direct" || queue.exchange.exchangeType == "topic" || queue.exchange.exchangeType == "headers") &&
                (input.exchangeKey == undefined || input.exchangeKey == "") && (queue.exchange.exchangeKey != input.exchangeKey)) {
                { throw ({ message: "Invalid exchangeKey" }); }
            }
            else {
                let _input = {
                    queue: queue,
                    vhost: product.product_name
                };
                let msg = await RABBITMQ.consumeMessages(_input);
                resolve(msg);
            }
        }
        catch (err) {
            reject(err);
        }
    })
}

exports.deactivevateProduct = async (products, _output) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let filePath = this.projectPath(products.product_name);
            if (COMMON.FileExists(filePath) == false) { throw ({ message: "This project does not exists." }) }
            let productinfo = JSON.parse(FS.readFileSync(filePath).toString());
            productinfo[productinfo.length - 1].is_active = false;
            _output.data = "Product is de-activated";
            await COMMON.WriteFileContent(this.projectPath(products.product_name), productinfo);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

exports.activevateProduct = async (products, _output) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let filePath = this.projectPath(products.product_name);
            if (COMMON.FileExists(filePath) == false) { throw ({ message: "This project does not exists." }) }
            let productinfo = JSON.parse(FS.readFileSync(filePath).toString());
            productinfo[productinfo.length - 1].is_active = true;
            _output.data = "Product is activated";
            await COMMON.WriteFileContent(this.projectPath(products.product_name), productinfo);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

exports.deleteProductByName = async (products, _output) => {
    return await new Promise(async (resolve, reject) => {
        try {
            let direc = PATH.join(__dirname, `../../database/deleted`)
            if (!FS.existsSync(direc)) {
                FS.mkdirSync(direc);
            }
            await FS.rename(this.projectPath(products.product_name), PATH.join(__dirname, `../../database/deleted/${products.product_name}.json`), function (error) {
                if (error) throw error;
            });
            _output.data = {};
            resolve(true);

        } catch (error) {
            reject(error);
        }
    });
};

exports.loginDashboard = async (loginInfo, _output, checkCredential) => {
    return await new Promise(async (resolve, reject) => {
        try {
            if (checkCredential.username == loginInfo.username && checkCredential.password == loginInfo.password) {
                _output.is_success = true;
                _output.message = "logged in successfully"
                _output.data = {};
                resolve(true);
            } else {
                _output.is_success = false;
                _output.message = "logged failed please check your credentials"
                _output.data = {};
                resolve(true);
            }
        } catch (error) {
            reject(error);
        }
    });
};
