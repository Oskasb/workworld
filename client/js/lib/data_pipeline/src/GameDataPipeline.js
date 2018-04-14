"use strict";

define([
		'data_pipeline/pipes/JsonPipe',
		'data_pipeline/pipes/ImagePipe'
	],
	function(
		JsonPipe,
		ImagePipe
	) {

		var GameDataPipeline = function() {

		};

		GameDataPipeline.loadConfigFromUrl = function(url, dataUpdated, fail) {
			JsonPipe.loadJsonFromUrl(url, dataUpdated, fail)
		};

		GameDataPipeline.storeJson = function(json, url) {
			JsonPipe.saveJsonToUrl(json, url)
		};


		GameDataPipeline.loadImageFromUrl = function(url, dataUpdated, fail) {
			ImagePipe.registerPollCallback(url, dataUpdated);
			ImagePipe.loadImage(url, dataUpdated, fail)
		};


		GameDataPipeline.tickDataLoader = function(tpf) {
			JsonPipe.tickJsonPipe(tpf);
			ImagePipe.tickImagePipe(tpf);
		};

		GameDataPipeline.applyPipelineOptions = function(opts, pipelineErrorCb, ConfigCache) {
			JsonPipe.setJsonPipeOpts(opts.jsonPipe, pipelineErrorCb, ConfigCache);
			ImagePipe.setImagePipeOpts(opts.imagePipe, pipelineErrorCb);
		};

        GameDataPipeline.registerUrlForPoll = function(url) {
            JsonPipe.pollUrl(url);
            ImagePipe.pollUrl(url);
        };

        GameDataPipeline.removeUrlFromPoll = function(url) {
            JsonPipe.removeUrlPoll(url);
            ImagePipe.removeUrlPoll(url);
        };

		return GameDataPipeline
	});