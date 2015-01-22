"use strict";
var Rx = require("rx");

function plugin(schema) {
    /*
    Statics
     */
    schema.statics.rx_FindOne = function (query) {
        var that = this;
        return Rx.Observable.create(function (observer) {
            that.findOne(query, function (err, data) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(data);
                return observer.onCompleted();
            });
        });
    };
    schema.statics.rx_Find = function (query) {
        var that = this;
        return Rx.Observable.create(function (observer) {
            that.find(query, function (err, data) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(data);
                return observer.onCompleted();
            });
        });
    };
    schema.statics.rx_Remove = function (query) {
        var that = this;
        return Rx.Observable.create(function (observer) {
            that.remove(query, function (err) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(null);
                return observer.onCompleted();
            });
        });
    };
    /*
    Methods
     */
    schema.methods.rx_save = function () {
        var that = this;
        return Rx.Observable.create(function (observer) {
            that.save(function (err, doc) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(doc);
                return observer.onCompleted();
            });
        });
    };
}
exports.plugin = plugin;
