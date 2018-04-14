"use strict";


define([
        'Events',
        'PipelineObject',
        'ui/dom/DomLoadScreen',
        'ui/GameScreen',
        'ThreeAPI',
        'GameAPI',
        'PipelineAPI'
    ],
    function(
        evt,
        PipelineObject,
        DomLoadScreen,
        GameScreen,
        ThreeAPI,
        GameAPI,
        PipelineAPI
    ) {

        var client;
        var loadProgress;

        var setupReady = function() {
            GameAPI.initGameGui();
        };

        var systemReady = function() {

            GameAPI.initGameSystems();
            client.clientReady(setupReady);
        };

        GameAPI.setupGameWorker(systemReady);

        var path = './../../..';

        var loadUrls = [
            './Transport/MATH.js'
        ];

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

        DataLoader.prototype.preloadImages = function() {
            
            var imageOk = function(src, data) {
        //        console.log("imageok:", src, data);
            };

            var imageFail = function(src, err) {
        //        console.log("image cache fail", erc, err)
            }

            ThreeAPI.initThreeLoaders(ThreeAPI);

            var styles = PipelineAPI.getCachedConfigs()['styles'];

    //        console.log("STYLES ", styles);

            var imageStore = [];

            for (var key in styles) {

                if (styles[key].backgroundImage) {
                    if (imageStore.indexOf(styles[key].backgroundImage)) {
                        imageStore.push(styles[key].backgroundImage);
                        PipelineAPI.cacheImageFromUrl(styles[key].backgroundImage, imageOk, imageFail);
                    }
                }
            }

        //    console.log("Image count: ", imageStore.length, imageStore)


        };

        DataLoader.prototype.getStates = function() {
            return loadStates;
        };
        
        DataLoader.prototype.setupPipelineCallback = function(loadStateChange) {

        };
        
        DataLoader.prototype.loadData = function(ClientViewer, PointerCursor, sceneController, onReady) {

            var _this = this;

            var loadingCompleted = function() {

                var clientReady = function() {
                    onReady(client);
                };

                client = new ClientViewer(new PointerCursor(), sceneController);

                client.setupSimulation(clientReady);
            //    if (onReady) {

            //    }

            };


            var loadStateChange = function(state) {
            //    console.log('loadStateChange', state)
                if (state == _this.getStates().IMAGES) {
                    _this.preloadImages();
                }

                if (state == _this.getStates().COMPLETED) {
                    loadingCompleted()
                }

            };

            evt.fire(evt.list().MESSAGE_UI, {channel:'pipeline_message', message:window.location.href});
            
            function pipelineCallback(started, remaining, loaded, files) {
            //   console.log("SRL", loadState, started, remaining, loaded, files);

                PipelineAPI.setCategoryKeyValue("STATUS", "FILE_CACHE", loaded);

                loadProgress.setProgress(loaded / started);

                if (loadState == loadStates.IMAGES && remaining == 0) {
                    console.log("IMAGE COMPLETED", started, remaining, loaded);
                    loadState = loadStates.COMPLETED;
                    PipelineAPI.setCategoryData('STATUS', {PIPELINE:pipelineOn});
                    PipelineAPI.subscribeToCategoryKey('setup', 'DEBUG', setDebug);
                    loadStateChange(loadState);
                }

                if (loadState == loadStates.CONFIGS && remaining == 0) {
                    console.log( "json cached:", PipelineAPI.getCachedConfigs());
                    loadState = loadStates.IMAGES;
                    loadStateChange(loadState);
                }

                if (loadState == loadStates.SHARED_FILES && remaining == 0) {
                    console.log( "shared loaded....");
                    loadState = loadStates.CONFIGS;
                    loadStateChange(loadState);
                }
            }

            PipelineAPI.addProgressCallback(pipelineCallback);


            var sharedFilesLoaded = function() {
         //       console.log('sharedFilesLoaded')
                evt.fire(evt.list().SHARED_LOADED, {});
                function pipelineError(src, e) {
                    console.log("Pipeline error Ready", src, e);
                    evt.fire(evt.list().MESSAGE_UI, {channel:'pipeline_error', message:'Pipeline Error '+src+' '+e});
                }
                evt.fire(evt.list().MESSAGE_UI, {channel:'pipeline_message', message:"Request Worker Fetch"});
            //    PipelineAPI.setCategoryData(jsonRegUrl, dataPipelineSetup, pipelineError);
                PipelineAPI.dataPipelineSetup(jsonRegUrl, dataPipelineSetup, pipelineError);

            };


            var sharedLoaded = function() {
        //        console.log("Shared Loaded:", count, loadUrls.length, PipelineAPI.checkReadyState());

                evt.fire(evt.list().MESSAGE_UI, {channel:'pipeline_message', message:"Shared Loaded"});
                setTimeout(function() {

                    _this.setupPipelineCallback(loadStateChange);
                    sharedFilesLoaded();
                }, 0);
8
            };


            var filesLoaded = function() {

                    setTimeout(function() {
                        sharedLoaded();
                    }, 0)
                
            };




            var loadJS = function(url, location){

                var scriptTag = document.createElement('script');
                scriptTag.src = url;

                var scriptLoaded = function(e) {
                    if (loadUrls.length != 0) {
                        loadJS(loadUrls.shift(), document.body);
                    } else {
                //        console.log('scripts loaded',e);
                        filesLoaded();
                    }
                };


                scriptTag.addEventListener('load', scriptLoaded);
                location.appendChild(scriptTag);
            };

            var count = 0;

            var pipelineReady = function() {
                loadJS(loadUrls.shift(), document.body);
            };

            var particles = false;




        //    evt.once(evt.list().PARTICLES_READY, particlesReady);

            PipelineAPI.addReadyCallback(pipelineReady);



        };


        DataLoader.prototype.notifyCompleted = function() {

            evt.fire(evt.list().PLAYER_READY, {});
            loadProgress.removeProgress();
        };        

        return DataLoader;

    });


