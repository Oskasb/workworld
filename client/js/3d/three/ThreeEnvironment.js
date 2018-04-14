"use strict";


define(['../../PipelineObject',
    'Events'

], function(
    PipelineObject,
    evt
) {

    var enabled;
    var envList = {};
    var skyList = {};

    var worldSetup = {};
    var world = {};
    var currentEnvId;

    var currentEnvConfig;
    var currentSkyConfig;

    var worldCenter = new THREE.Vector3(0, 0, 0);
    var calcVec = new THREE.Vector3();
    var calcVec2 = new THREE.Vector3();

    var theta;
    var phi;

    var transitionTime = 1;
    var transitionProgress = 0;

    var sky;
    var scene;
    var camera;
    var renderer;
    var sunSphere;



    var fogColor = new THREE.Color(1, 1, 1);
    var dynamicFogColor = new THREE.Color(1, 1, 1);
    var ambientColor = new THREE.Color(1, 1, 1);
    var dynamicAmbientColor = new THREE.Color(1, 1, 1);

    var ThreeEnvironment = function() {

    };

    ThreeEnvironment.loadEnvironmentData = function() {

        var worldListLoaded = function(scr, data) {
            for (var i = 0; i < data.params.length; i++){
                worldSetup[data.params[i].id] = data.params[i]
            }
            currentEnvId = data.defaultEnvId;
        };
        new PipelineObject("WORLD", "THREE", worldListLoaded);
    };


    var initSky = function() {

        // Add Sky Mesh
        sky = new THREE.Sky();
        scene.add( sky.mesh );

        // Add Sun Helper
        sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 2000, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: 0xffffff } )
        );

        sunSphere.position.y = - 700000;
        sunSphere.visible = false;
    //    scene.add( sunSphere );

    };


    var applyColor = function(Obj3d, color) {
        if (Obj3d) {
            if (Obj3d.color) {
                Obj3d.color.r=color[0];
                Obj3d.color.g=color[1];
                Obj3d.color.b=color[2];
            } else {
                Obj3d.color = new THREE.Color(color[0],color[1], color[2]);
            }


        }

    };


    var applyFog = function(Obj3d, density) {
        Obj3d.density = density;
    };

    var applyEnvironment = function() {

        var config = currentEnvConfig;

        for (var key in config) {


            if (config[key].color) {

                if (key == 'sun') {

                    world[key].position.copy(sunSphere.position);
                    world[key].lookAt(worldCenter)
                }

                if (key == 'moon') {

                    world[key].position.x = 10 -sunSphere.position.x * 0.2;
                    world[key].position.y = 1000 +sunSphere.position.y * 5;
                    world[key].position.z = 10 -sunSphere.position.z * 0.2;
                    world[key].lookAt(worldCenter)
                }


                if (key == 'fog') {
                    fogColor.setRGB(config[key].color[0],config[key].color[1],config[key].color[2]);
                }

                if (key == 'ambient') {
                    ambientColor.setRGB(config[key].color[0],config[key].color[1],config[key].color[2]);
                }

                applyColor(world[key], config[key].color);
            }

            if (config[key].density) {
                applyFog(world[key], config[key].density);
                //    renderer.setClearColor(new THREE.Color(config[key].color[0],config[key].color[1], config[key].color[2]))
            }
        }
    };

    function applySkyConfig() {

        var config = currentSkyConfig;

        var uniforms = sky.uniforms;
        uniforms.turbidity.value = config.turbidity;
        uniforms.rayleigh.value = config.rayleigh;
        uniforms.luminance.value = config.luminance;
        uniforms.mieCoefficient.value = config.mieCoefficient;
        uniforms.mieDirectionalG.value = config.mieDirectionalG;

        theta = Math.PI * ( config.inclination - 0.5 );
        phi = 2 * Math.PI * ( config.azimuth - 0.5 );

        sunSphere.position.x = config.distance * Math.cos( phi );
        sunSphere.position.y = config.distance * Math.sin( phi ) * Math.sin( theta );
        sunSphere.position.z = config.distance * Math.sin( phi ) * Math.cos( theta );

        sunSphere.visible = true;

        sunSphere.lookAt(worldCenter);

        sky.uniforms.sunPosition.value.copy( sunSphere.position );

        //    renderer.render( scene, camera );

    }

    

    var sunRedness;
    var sunFactor;
    var updateDynamigFog = function(sunInTheBack) {

        dynamicFogColor.copy(fogColor);

        sunRedness = world.sun.color.r * 0.5;
        sunFactor = (sunRedness - sunInTheBack * (1 - sunRedness)) * 0.15;
        dynamicFogColor.lerp(world.sun.color,   sunFactor);
        dynamicFogColor.lerp(ambientColor,      sunFactor);
        world.fog.color.copy(dynamicFogColor)

    };


    var updateDynamigAmbient = function(sunInTheBack) {

        dynamicAmbientColor.copy(ambientColor);
        dynamicAmbientColor.lerp(world.fog.color, 0.2 + sunInTheBack * 0.2);
        //    dynamicAmbientColor.lerp(ambientColor, 0.2 - sunInTheBack * 0.2);
        world.ambient.color.copy(dynamicAmbientColor)

    };


    var interpolateEnv = function(current, target, fraction) {


        for (var key in current) {
            if (fraction >= 1) {
                if (current[key].color) {
                    current[key].color[0] = target[key].color[0];
                    current[key].color[1] = target[key].color[1];
                    current[key].color[2] = target[key].color[2];
                }

                if (current[key].density) {
                    current[key].density = target[key].density;
                }
            } else  {
                if (current[key].color) {
                    current[key].color[0] = MATH.interpolateFromTo(current[key].color[0], target[key].color[0],  fraction);
                    current[key].color[1] = MATH.interpolateFromTo(current[key].color[1], target[key].color[1],  fraction);
                    current[key].color[2] = MATH.interpolateFromTo(current[key].color[2], target[key].color[2],  fraction);
                }

                if (current[key].density) {
                    current[key].density = MATH.interpolateFromTo(current[key].density, target[key].density,  fraction);
                }
            }
        }

        return current;
    };

    var interpolateSky = function(current, target, fraction) {

        for (var key in current) {
            if (fraction >= 1) {
                current[key] = target[key]
            } else {
                current[key] = MATH.interpolateFromTo(current[key], target[key],  fraction);
            }

        }

        return current;
    };

    var calcTransitionProgress = function(tpf) {
        transitionProgress += tpf;
        return MATH.calcFraction(0, transitionTime, transitionProgress);
    };

    var tickEnvironment = function(e) {

        var fraction = calcTransitionProgress(evt.args(e).tpf) * 0.05;

        if (fraction > 1.01) {
            return;
        }

        var useSky = interpolateSky(currentSkyConfig, skyList[currentEnvId], fraction);

        interpolateEnv(currentEnvConfig, envList[currentEnvId], fraction);

        if (fraction < 1) {
            applyEnvironment();
            applySkyConfig()
        }

        theta = Math.PI * ( useSky.inclination - 0.5 );
        phi = 2 * Math.PI * ( useSky.azimuth - 0.5 );

        sunSphere.position.x = camera.position.x + useSky.distance * Math.cos( phi );
        sunSphere.position.y = camera.position.y + useSky.distance * Math.sin( phi ) * Math.sin( theta );
        sunSphere.position.z = camera.position.z + useSky.distance * Math.sin( phi ) * Math.cos( theta );


        sky.mesh.position.copy(camera.position);

        sky.uniforms.sunPosition.value.copy( sunSphere.position );

        world.sun.position.copy(sunSphere.position);
        world.sun.lookAt(camera.position);


        calcVec.x = 0;
        calcVec.y = 0;
        calcVec.z = 1;

        calcVec2.x = 0;
        calcVec2.y = 0;
        calcVec2.z = 1;

        calcVec.applyQuaternion(sunSphere.quaternion);
        calcVec2.applyQuaternion(camera.quaternion);

        calcVec.normalize();
        calcVec2.normalize();

        var sunInTheBack = calcVec.dot(calcVec2);

        updateDynamigFog(sunInTheBack);
        updateDynamigAmbient(sunInTheBack);

    };

    ThreeEnvironment.readDynamicValue = function(worldProperty, key) {
        return world[worldProperty][key];  
    };

    ThreeEnvironment.enableEnvironment = function() {
        if (enabled) return;
        enabled = true;
        scene.add( sky.mesh );
        evt.on(evt.list().CLIENT_TICK, tickEnvironment);
    };

    ThreeEnvironment.getEnvConfigs = function() {
        return envList;
    };

    ThreeEnvironment.getCurrentEnvId = function() {
        return currentEnvId;
    };

    ThreeEnvironment.disableEnvironment = function() {
        if (!enabled) return;
        enabled = false;
        scene.remove( sky.mesh );
        evt.removeListener(evt.list().CLIENT_TICK, tickEnvironment);
    };

    ThreeEnvironment.setEnvConfigId = function(envConfId, time) {
        transitionTime = time || 5;
        transitionProgress = 0;
        currentEnvId = envConfId;
    };

    ThreeEnvironment.initEnvironment = function(store) {

        scene = store.scene;
        renderer = store.renderer;
        camera = store.camera;

        initSky();

        var createEnvWorld = function(worldSetup) {

            for (var key in world) {
                scene.remove(world[key]);
            }

            world = {};

            for (key in worldSetup) {

                if (key == "ambient") {

                    world[key] = new THREE.AmbientLight(0x000000);
                    scene.add(world[key]);
                    
                } else if (key == "fog") {
                    scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
                    world[key] = scene.fog;
                } else {
                    world[key] = new THREE.DirectionalLight(0x000000);
                    scene.add(world[key]);
                }
            }
        };


        var environmentListLoaded = function(scr, data) {

            for (var i = 0; i < data.length; i++){

                envList[data[i].id] = {};
                skyList[data[i].id] = {};
                var configs = data[i].configs;

                skyList[data[i].id] = data[i].sky;

                for (var j = 0; j < configs.length; j++) {

                    envList[data[i].id][configs[j].id] = configs[j];
                }
            }

            currentSkyConfig = skyList['current'];
            currentEnvConfig= envList['current'];

            applySkyConfig();
            applyEnvironment();


        };

        createEnvWorld(worldSetup);

        new PipelineObject("ENVIRONMENT", "THREE", environmentListLoaded);

    };

    return ThreeEnvironment;

});