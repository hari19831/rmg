/*jshint esversion: 8 */

function product() {
    this.product_name = "";
    this.version = "";
    this.product_key = "";
    this.apikey = "";
    this.is_active = true;
    this.queue_details = [];
    this.deletequeue_details=[];
    this.assignValues = (obj) => {
        this.product_name = obj.product_name;
        this.version = obj.version;
        this.product_key = obj.product_key;
        this.apikey = "";
        this.queue_details = obj.queue_details || this.queue_details;
        this.deletequeue_details=obj.deletequeue_details || this.deletequeue_details;
        return this;
    };
}

product.prototype.product_name = function (product_name) {
    this.product_name = product_name;
};
product.prototype.version = function (version) {
    this.version = version;
};
product.prototype.product_key = function (product_key) {
    this.product_key = product_key;
};
product.prototype.apikey = function (apikey) {
    this.apikey = apikey;
};

product.prototype.queue_details = function (queue_details) {
    this.queue_details = queue_details;
};

product.prototype.deletequeue_details = function (deletequeue_details) {
    this.deletequeue_details = deletequeue_details;
};

module.exports = product;