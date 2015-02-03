"use strict";
var Rx = require("rx"),
    Observable = Rx.Observable,
    us = require('underscore');

function plugin(schema) {
    /*
    Statics
     */
    schema.statics.rx_FindOne = function (query) {
        var self = this;
        return Observable.create(function (observer) {
            self.findOne(query, function (err, data) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(data);
                return observer.onCompleted();
            });
        });
    };
    schema.statics.rx_Find = function (query) {
        var self = this;
        return Observable.create(function (observer) {
            self.find(query, function (err, data) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(data);
                return observer.onCompleted();
            });
        });
    };
    schema.statics.rx_Remove = function (query) {
        var self = this;
        return Observable.create(function (observer) {
            self.remove(query, function (err) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(null);
                return observer.onCompleted();
            });
        });
    };
    schema.statics.rx_FindWithArraysOfOredQueries = function (arrayOfOredQueries) {
        var self = this;
        var sources = [];
        var currentQuery = [];
        us.each(arrayOfOredQueries, function (query) {
            currentQuery.push(query);
            if (currentQuery.length > 4) {
                sources.push(self.rx_Find({$or: currentQuery}));
                currentQuery = [];
            }
        });
        if (currentQuery.length > 0) {
            sources.push(self.rx_Find({$or: currentQuery}));
        }
        return Observable.merge(sources)
            .toArray()
            .select(function (x){
                return us.flatten(x);
            });
    };
    /*
    Methods
     */
    schema.methods.rx_save = function () {
        var self = this;
        return Observable.create(function (observer) {
            self.save(function (err, doc) {
                if (err) {
                    return observer.onError(err);
                }
                observer.onNext(doc);
                return observer.onCompleted();
            });
        });
    };
}
module.exports = plugin;
