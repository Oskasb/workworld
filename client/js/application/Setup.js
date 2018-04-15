"use strict";

define([
    'application/ClientViewer',
    'application/DataLoader',
    '3d/SceneController',
    'io/PointerCursor'
], function(
    ClientViewer,
    DataLoader,
    SceneController,
    PointerCursor
) {

    var dataLoader;
    var client;

    var Setup = function() {

    };

    Setup.init = function(onReady) {
        var sceneController = new SceneController();

        dataLoader = new DataLoader();



        var clientReady = function() {
            onReady(client);
        };

        client = new ClientViewer(new PointerCursor(), sceneController);

        var dataLoaded = function() {
            client.setupSimulation(clientReady);
        };

        dataLoader.loadData(dataLoaded)

    };

    Setup.completed = function() {
        dataLoader.notifyCompleted()
    };

    return Setup;

});
