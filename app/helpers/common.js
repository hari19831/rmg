/*jshint esversion: 8 */

const FSEXTRA = require("fs-extra"),
    PATH = require("path"),
    REDISOPTIONS = require('../../config/config.json'),
    CRYPTR = require('cryptr'),
    CONFIG = require('../../config/config'),
    FS = require('fs');
const _CRYPTR = new CRYPTR(CONFIG.crypto_key);

/**
 * 
 * @param {*value to encrypt} value 
 */
var encodeSync = (value) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(_CRYPTR.encrypt(value));
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * 
 * @param {*value to decrypt} value 
 */
var decryptSync = (value) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(_CRYPTR.decrypt(value));
        } catch (error) {
            reject(error);
        }
    });
};

var decrypt = (value) => {
    try {
        let result = _CRYPTR.decrypt(value);
        return (result);
    }
    catch (error) {
        console.err(ex);
        throw error;
    }
};

/**
 * 
 * @param {*Delete specific path} directoryPath 
 */

var DeleteTempPathifExitsSync = (directoryPath) => {
    return new Promise((resolve, reject) => {
        try {

            FS.readdir(directoryPath, function (err, files) {
                if (err) {
                    reject(err);
                }
                if (files.length == 0) {
                    resolve(true);
                }
                for (let i = 0; i < files.length; i++) {
                    if (PATH.extname(files[i]) != '') {
                        FS.unlinkSync(PATH.join(directoryPath, files[i]));
                    } else {
                        FSEXTRA.remove(PATH.join(directoryPath, files[i]));
                    }
                    if (i == files.length - 1) {
                        resolve(true);
                    }
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * 
 * @param {*json data to check item are json object or not} item 
 */
function isJSON(value) {
    var re = /^\{[\s\S]*\}$|^\[[\s\S]*\]$/;
    if (typeof value !== 'string') {
        return false;
    }
    if (!re.test(value)) {
        return false;
    }
    try {
        JSON.parse(value);
    } catch (err) {
        return false;
    }
    return true;
}
/**
 *generate random guid code
 */
var FULLguid = function () {
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    return (uuidv4());
};

/**
 *  method for find json file available or not
 * @param {* json file location} FilePath 
 */
var FileExists = function (FilePath) {
    let exist = FS.existsSync(FilePath);
    return exist;
};
/**
 * read data from json
 * @param {* json file location} FilePath 
 */
var ReadFileContentAsString = function (FilePath) {
    return new Promise((resolve, reject) => {
        try {
            resolve(FS.readFileSync(FilePath, 'utf-8'));
        } catch (error) {
            reject(error.message);
        }
    });
};

/**
 * 
 * @param {* json file location} FilePath 
 * @param {* json wtring information} content 
 * @param {* insert or update opeartion key} operation 
 */
var WriteFileContent = function (FilePath, content, operation) {
    return new Promise((resolve, reject) => {
        try {
            if (operation == "insert") {
                resolve(FS.appendFile(FilePath, JSON.stringify(content), (err) => {
                    if (err) throw err;
                }));
            } else {
                resolve(FS.writeFileSync(FilePath, JSON.stringify(content)));
            }

        } catch (error) {
            reject(error.message);
        }
    });
};

var guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return (s4() + s4());
};

function requireMany() {
    let arrays = Array.prototype.slice.call(arguments).map(require);
    return Object.assign({}, ...arrays);
}

const totalCacheSpace = () => {
    return REDISOPTIONS.RedisAzure.totalSizeInMB;
};

function getOverallAllocationMemory() {
    const files = FS.readdirSync(PATH.join(__dirname, "../../database/"));
    let memory = 0;
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        if (PATH.extname(element).toLocaleLowerCase() == ".json") {
            let productinfo = FS.readFileSync(PATH.join(__dirname, "../../database/" + element));
            productinfo = JSON.parse(productinfo.toString());
            productinfo = productinfo.filter(x => x.is_active == true).sort(x => x.version);
            productinfo = productinfo[productinfo.length-1];
            if (productinfo) {
                memory = memory + (productinfo.allocated_mb || 0);
            }
        }
    }
    return memory;
}

/**
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 */
function readFilesSync(dir) {
    const files = [];

    FS.readdirSync(dir).forEach(filename => {
        const name = PATH.parse(filename).name;
        const ext = PATH.parse(filename).ext;
        const filepath = PATH.resolve(dir, filename);
        const stat = FS.statSync(filepath);
        const isFile = stat.isFile();

        if (isFile) files.push({ filepath, name, ext, stat });
    });

    files.sort((a, b) => {
        // natural sort alphanumeric strings
        // https://stackoverflow.com/a/38641281
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    return files;
}

//modules to export
module.exports = {
    getOverallAllocationMemory,
    requireMany,
    DeleteTempPathifExitsSync,
    isJSON,
    encodeSync,
    decryptSync,
    FULLguid,
    FileExists,
    ReadFileContentAsString,
    WriteFileContent,
    guid,
    totalCacheSpace,
    readFilesSync,
    decrypt
};
