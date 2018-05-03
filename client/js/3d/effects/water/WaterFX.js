"use strict";

define([
        'ThreeAPI',
        'Events',
        '3d/effects/water/WaterMaterial',
        'PipelineObject'
    ],
    function(
        ThreeAPI,
        evt,
        WaterMaterial,
        PipelineObject
    ) {

        var waterList = {};
        var terrainIndex = {};
        var terrainMaterial;
        var waterGeometry;

        var world;

        var oceanId = 'main_ocean';

        var calcVec = new THREE.Vector3();

        var parameters = {
            width: 100000,
            height: 100000,
            widthSegments: 128,
            heightSegments: 128,
            depth: 1500,
            param: 4,
            filterparam: 1
        };
        var waterNormals;
        var water = {};

        var waterMaterial;

        var WaterFX = function(waterReady) {
            waterMaterial = new WaterMaterial(ThreeAPI);
            this.loadData(waterReady);
        };


        WaterFX.prototype.loadData = function(waterReady) {

            var materialReady = function() {

                waterReady();

            }

            var oceansLoaded = function(scr, data) {
                for (var i = 0; i < data.length; i++){
                    waterList[data[i].id] = data[i];
                    waterMaterial.addWaterMaterial(data[i].id, data[i].textures, data[i].shader, materialReady);
                }

            };
            new PipelineObject("OCEANS", "THREE", oceansLoaded);
        };

        WaterFX.prototype.initWaterEffect = function() {


            world = ThreeAPI.getEnvironment().getEnvironmentDynamicWorld();

            waterGeometry = new THREE.PlaneBufferGeometry( parameters.width, parameters.height, 16, 16 );

            var simpleWater = true;

            if (simpleWater) {
                var material = waterMaterial.getMaterialById(oceanId);
                var waterMesh = new THREE.Mesh(waterGeometry, material);
            } else {
                waterMesh = new THREE.Water(
                    waterGeometry,
                    {
                        textureWidth: 512,
                        textureHeight: 512,
                        waterNormals: new THREE.TextureLoader().load( 'client/assets/images/textures/tiles/waternormals3.png', function ( texture ) {
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        }),
                        alpha: 1.0,
                        sunDirection: new THREE.Vector3(0.2, 0.3, 0),
                        sunColor: 0xffffff,
                        waterColor: 0x000e0f,
                        distortionScale:  2.7,
                        //     fog: undefined
                      fog: ThreeAPI.getScene().fog !== undefined
                    }
                );

                var tickWater = function() {
                    waterMesh.material.uniforms.time.value += 1.0 / 60.0;
                    this.updateWaterEffect(waterMesh.material.uniforms);
                }.bind(this)


                evt.on(evt.list().CLIENT_TICK, tickWater);

            }

            waterMesh.rotation.x = -Math.PI * 0.5;
            ThreeAPI.addToScene( waterMesh );



        };

        var color;
        var rot;

        var applyUniformEnvironmentColor = function(uniform, worldProperty) {
            color = ThreeAPI.readEnvironmentUniform(worldProperty, 'color');
            uniform.value.r = color.r;
            uniform.value.g = color.g;
            uniform.value.b = color.b * 1.5;
        };

        var applyUniformEnvironmentRotation = function(uniform, worldProperty) {
            rot = ThreeAPI.readEnvironmentUniform(worldProperty, 'rotation');
            uniform.value.x = -rot.x;
            uniform.value.y = -rot.y;
            uniform.value.z = -rot.z;
        };


        WaterFX.prototype.updateWaterEffect = function(uniforms) {

            applyUniformEnvironmentColor(uniforms.waterColor, 'ambient');
        //    applyUniformEnvironmentColor(uniforms.sunColor, 'sun');
        //    applyUniformEnvironmentRotation(uniforms.sunDirection, 'sun');


        };

        return WaterFX;

    });