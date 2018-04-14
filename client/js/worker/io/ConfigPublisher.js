"use strict";

define([   'PipelineAPI'], function(PipelineAPI) {

        var ConfigPublisher = function() {

        };

        ConfigPublisher.publishConfigs = function(gameWorker, configsPublished) {

            var fileList = function(src, data) {
                ConfigPublisher.updateWorkerConfigs(gameWorker, data, configsPublished);
            };

            if (PipelineAPI.getCachedConfigs()['urls']) {
                PipelineAPI.subscribeToCategoryKey('config_url_index', 'files', fileList);
            } else {
                var pipeProgress = function(started, remainig) {
                    if (started > 3 && remainig === 0) {
                        PipelineAPI.removeProgressCallback(pipeProgress);
                        PipelineAPI.subscribeToCategoryKey('config_url_index', 'files', fileList);
                    }
                };
                PipelineAPI.addProgressCallback(pipeProgress)
            }
        };

    ConfigPublisher.updateWorkerConfigs = function(gameWorker, data, configsPublished) {

        var started = 0;
        var finished = 0;

        var testTimeout;

        var testFinished = function() {
            clearTimeout(testTimeout);
            testTimeout = setTimeout(function() {
               if (started === finished) {
                   configsPublished();
               }
            }, 0);
        };

        var storeConfigMap = function(config, key) {

            started++;

            var cfg = config;

            var postConfig = function(src, data) {
                gameWorker.storeConfig(cfg, src, data);
                finished++;
                testFinished()
            };

            PipelineAPI.subscribeToCategoryKey(config, key, postConfig);
        };

        var urls = PipelineAPI.getCachedConfigs()['urls'];

        for (var i = 0; i < data.length; i++) {
            var file = data[i];
            var conf = urls['client/json/'+file];
            if (conf) {
                for (var j = 0; j < conf.length; j++) {
                    for (var key in conf[j]) {
                        for (var entry in conf[j][key]) {
                            storeConfigMap(key, entry)
                        }
                    }
                }
            }
        }
    };

        return ConfigPublisher;

    });
