/*jshint esversion: 8 */

function output() {
    this.is_success = "";
    this.data = "";
    this.message = "";
}

output.prototype.is_success = function (is_success) {
    this.is_success = is_success;
};
output.prototype.data = function (data) {
    this.data = data;
};
output.prototype.message = function (message) {
    this.message = message;
};

module.exports = output;