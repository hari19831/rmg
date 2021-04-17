/*jshint esversion: 8 */

function queue() {
    this.queueName = "";
    this.options = {
        exclusive: false,
        durable: true,
        autoDelete: "NO",
        queueType: "classic",
        arguments: {
            "x-queue-type": undefined,
            "x-message-ttl": undefined,
            "x-expires": undefined,
            "x-max-length-bytes": undefined,
            "x-max-length": undefined,
            "x-overflow": undefined,
            "x-dead-letter-exchange": undefined,
            "x-dead-letter-routing-key": undefined,
            "x-single-active-consumer": undefined,
            "x-max-priority": undefined,
            "x-queue-mode=lazy": undefined,
            "x-queue-master-locator": undefined
        },
        messageTtl: undefined,
        expires: undefined,
        deadLetterExchange: undefined,
        deadLetterRoutingKey: undefined,
        maxLength: undefined,
        maxPriority: undefined
    }
    this.exchange = {
        exchangeType: undefined,
        exchangeName: undefined,
        exchangeKey: undefined,
        arguments: {
            "durable": undefined,
            "alternate-exchange": undefined
        }
    };
    this.clearData = () => {
        return JSON.parse(JSON.stringify(this));
    }
    this.assignValues = (obj) => {
        this.queueName = obj.queueName;
        this.exchange = {
            exchangeType: obj.exchangeType,
            exchangeName: obj.exchangeName,
            exchangeKey: obj.exchangeKey,
            arguments: {
                "alternate-exchange": obj.alternateExchange,
                "durable": obj.durable
            }
        };
        this.options.exclusive = obj.exclusive || false;
        this.options.durable = obj.durable || true;
        this.options.autoDelete = obj.autoDelete || "NO";
        this.options.queueType = obj.queueType || "classic"
        this.options.arguments = {
            "x-queue-type": obj.queueType || obj["x-queue-type"] || "classic",
            "x-message-ttl": obj.messageTtl || obj["x-message-ttl"],
            "x-expires": obj.expires || obj["x-expires"],
            "x-max-length-bytes": obj.maxLengthBytes || obj["x-max-length-bytes"],
            "x-max-length": obj.maxLength || obj["x-max-length"],
            "x-overflow": obj.overFlow || obj["x-overflow"],
            "x-dead-letter-exchange": obj.deatLetterExchange || obj["x-dead-letter-exchange"],
            "x-dead-letter-routing-key": obj.deadLetterRoutingKey || obj["x-dead-letter-routing-key"],
            "x-single-active-consumer": obj.SingleActiveConsumer || obj["x-single-active-consumer"],
            "x-max-priority": obj.maxPriority || obj["x-max-priority"],
            "x-queue-mode": obj.queueMode || obj["x-queue-mode"],
            "x-queue-master-locator": obj.queueMasterLocator || obj["x-queue-master-locator"]
        };
        this.options.messageTtl = obj.messageTtl;
        this.options.expires = obj.expires;
        this.options.deadLetterExchange = obj.deadLetterExchange;
        this.options.deadLetterRoutingKey = obj.deadLetterRoutingKey;
        this.options.maxLength = obj.maxLength;
        this.options.maxPriority = obj.maxPriority;
        return this;
    };
}

queue.prototype.queueName = function (queueName) {
    this.queueName = queueName;
};
queue.prototype.options = function (options) {
    this.options = options;
};
queue.prototype.exchange = function (exchange) {
    this.exchange = exchange;
};
queue.prototype.exchange = function (exchange) {
    this.exchange = exchange;
};
queue.prototype.assignValues = function (assignValues) {
    this.assignValues = assignValues;
};

module.exports = queue;