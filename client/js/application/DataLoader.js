"use strict";


define([
        'Events',
        'PipelineObject',
        'ui/dom/DomLoadScreen',
        'ui/GameScreen',
        'PipelineAPI',
        'ThreeAPI'
    ],
    function(
        evt,
        PipelineObject,
        DomLoadScreen,
        GameScreen,
        PipelineAPI,
        ThreeAPI
    ) {

        var loadProgress;

        var pipelineOn = pollingOn;
        window.jsonConfigUrls = 'client/json/';
        if (window.location.href == 'http://127.0.0.1:5000/' || window.location.href ==  'http://localhost:5000/' || window.location.href ==  'http://192.168.0.100:5000/') {
            //    pipelineOn = true;
        }

        var dataPipelineSetup = {
            "jsonPipe":{
                "polling":{
                    "enabled":pipelineOn,
                    "frequency":8
                }
            },
            "svgPipe":{
                "polling":{
                    "enabled":false,
                    "frequency":2
                }
            },
            "imagePipe":{
                "polling":{
                    "enabled":true,
                    "frequency":4
                }
            }
        };

        var jsonRegUrl = './client/json/config_urls.json';

        var setDebug = function(key, data) {
            SYSTEM_SETUP.DEBUG = data;
        };

        var DataLoader = function() {
            loadProgress = new DomLoadScreen(GameScreen.getElement());
        };

        var loadStates= {
            SHARED_FILES:'SHARED_FILES',
            CONFIGS:'CONFIGS',
            IMAGES:'IMAGES',
            COMPLETED:'COMPLETED'
        };

        var loadState = loadStates.SHARED_FILES;

        DataLoader.prototype.getStates = function() {
            return loadStates;
        };

        DataLoader.prototype.setupPipelineCallback = function(loadStateChange) {

        };

        DataLoader.prototype.loadData = function(onReady) {

            var _this = this;

            ThreeAPI.initThreeLoaders();

            var loadingCompleted = function() {
                onReady();
            };

            var loadStateChange = function(state) {
                //    console.log('loadStateChange', state)
                if (state == _this.getStates().IMAGES) {

                }

                if (state == _this.getStates().COMPLETED) {
                    loadingCompleted()
                }

            };

            evt.fire(evt.list().MESSAGE_UI, {channel:'pipeline_message', message:window.location.href});

            function pipelineCallback(started, remaining, loaded, files) {
                // console.log("SRL", loadState, started, remaining, loaded, [files]);

                PipelineAPI.setCategoryKeyValue("STATUS", "FILE_CACHE", loaded);

                loadProgress.setProgress(loaded / started);

                if (loadState == loadStates.CONFIGS && remaining == 0) {
                    console.log( "json cached:", PipelineAPI.getCachedConfigs());
                    loadState = loadStates.COMPLETED;
                    loadStateChange(loadState);
                }

                if (loadState == loadStates.SHARED_FILES && remaining == 0) {
                    console.log( "shared loaded....");
                    loadState = loadStates.CONFIGS;
                    loadStateChange(loadState);
                }
            }

            PipelineAPI.addProgressCallback(pipelineCallback);

            var loadJsonData = function() {

                function pipelineError(src, e) {
                    console.log("Pipeline error Ready", src, e);
                    evt.fire(evt.list().MESSAGE_UI, {channel:'pipeline_error', message:'Pipeline Error '+src+' '+e});
                }
                evt.fire(evt.list().MESSAGE_UI, {channel:'pipeline_message', message:"Request Worker Fetch"});
                PipelineAPI.dataPipelineSetup(jsonRegUrl, dataPipelineSetup, pipelineError);

            };

            _this.setupPipelineCallback(loadStateChange);
            loadJsonData();

        };

        DataLoader.prototype.notifyCompleted = function() {
            loadProgress.removeProgress();
        };

        return DataLoader;

    });