"use strict";

define([
    'application/ClientViewer',
    'application/DataLoader',
    '3d/SceneController',
    'io/PointerCursor',
    'PipelineAPI'
], function(
    ClientViewer,
    DataLoader,
    SceneController,
    PointerCursor,
    PipelineAPI
) {

    var dataLoader;
    var client;

    var Setup = function() {

    };

    Setup.init = function(onReady) {

        var sceneController = new SceneController();

        dataLoader = new DataLoader();

        var clientReady = function() {
            Setup.enableJsonPipelinePolling();
            dataLoader.loadShaderData();
            onReady(client);
        };

        client = new ClientViewer(new PointerCursor(), sceneController);

        var dataLoaded = function() {
            client.setupSimulation(clientReady);
        };

        dataLoader.loadData(dataLoaded)

    };

    Setup.completed = function() {
        dataLoader.notifyCompleted();

    };


    Setup.enableJsonPipelinePolling = function() {
        PipelineAPI.getPipelineOptions('jsonPipe').polling.enabled = true;
        PipelineAPI.getPipelineOptions('jsonPipe').polling.frequency = 45;
    };

    return Setup;

});
