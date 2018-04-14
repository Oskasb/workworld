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

        var worldListLoaded = function(src, data) {

            console.log("Load Env World Data:", src, data);

            for (var i = 0; i < data.params.length; i++){
                worldSetup[data.params[i].id] = data.params[i]
            }
            currentEnvId = data.defaultEnvId;

            console.log("worldSetup:", currentEnvId, worldSetup);
        };

        var data = {
            "defaultEnvId":"sunny_day",
            "params":[
                {"id":"sun",      "THREE":"DirectionalLight"},
                {"id":"moon",     "THREE":"DirectionalLight"},
                {"id":"ambient",  "THREE":"AmbientLight"    },
                {"id":"fog",      "THREE":"FogExp2"         }
            ]
        };

        worldListLoaded('local', data);

    //    new PipelineObject("WORLD", "THREE", worldListLoaded);
    };

    var initSky = function() {

        console.log("Init sky");

        // Add Sky Mesh
        sky = new THREE.Sky();
        scene.add( sky.mesh );

        // Add Sun Helper
        sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 2000, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: 0xffffff } )
        );

        sunSphere.position.y = - 70;
        sunSphere.visible = false;
        scene.add( sunSphere );
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

    //    console.log("Tick Env")

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

            console.log("Env List Loaded", data);

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


        var envData = [
            {
                "id":"current",
                "sky":{
                    "luminance":  0 ,
                    "turbidity":  0 ,
                    "rayleigh": 0 ,
                    "mieCoefficient": 0 ,
                    "mieDirectionalG":  0 ,
                    "inclination": 0.5,
                    "azimuth": 0.5,
                    "distance": 1000
                },
                "configs":[
                    {"id":"sun",     "color":[0,  0,  0]},
                    {"id":"moon",    "color":[0,  0,  0]},
                    {"id":"ambient", "color":[1,  1,  1]},
                    {"id":"fog",     "color":[1,  1,  1], "density":0.00001}
                ]
            },
            {
                "id":"flat",
                "sky":{
                    "luminance":  0 ,
                    "turbidity":  0 ,
                    "rayleigh":   0 ,
                    "mieCoefficient":   0,
                    "mieDirectionalG":  0,
                    "inclination": 0.5,
                    "azimuth": 0.5,
                    "distance": 1000
                },
                "configs":[
                    {"id":"sun",     "color":[0,  0,  0]},
                    {"id":"moon",    "color":[0,  0,  0]},
                    {"id":"ambient", "color":[1,  1,  1]},
                    {"id":"fog",     "color":[1,  1,  1], "density":0.00001}
                ]
            },
            {
                "id":"fadeout",
                "sky":{
                    "luminance":         0.0,
                    "turbidity":         20.7 ,
                    "rayleigh":          20.5 ,
                    "mieCoefficient":    20.5 ,
                    "mieDirectionalG":   20.5 ,
                    "inclination": 0.30,
                    "azimuth": 0.25,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0,  0,  0]},
                    {"id":"moon",    "color":[0,  0,  0]},
                    {"id":"ambient", "color":[0,  0,  0]},
                    {"id":"fog",     "color":[0,  0,  0],  "density":1.0}
                ]
            },
            {
                "id":"high_noon",
                "sky":{
                    "luminance":       0.7  ,
                    "turbidity":       1    ,
                    "rayleigh":        0.53 ,
                    "mieCoefficient":  0.005,
                    "mieDirectionalG": 0.8  ,
                    "inclination": 0.30,
                    "azimuth": 0.31,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0.98,  0.90,  0.55]},
                    {"id":"moon",    "color":[0.24,  0.35,  0.42]},
                    {"id":"ambient", "color":[0.00,  0.05,   0.20]},
                    {"id":"fog",     "color":[0.73,  0.91,  1], "density":0.0015}
                ]
            },
            {
                "id":"sunny_day",
                "sky":{
                    "luminance":       0.7  ,
                    "turbidity":       1    ,
                    "rayleigh":        0.53 ,
                    "mieCoefficient":  0.005,
                    "mieDirectionalG": 0.8  ,
                    "inclination": 0.30,
                    "azimuth": 0.12,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0.92,  0.81,  0.45]},
                    {"id":"moon",    "color":[0.12,  0.35,  0.42]},
                    {"id":"ambient", "color":[0.05,  0.11,  0.25]},
                    {"id":"fog",     "color":[0.74,  0.86,  1], "density":0.002}
                ]
            },
            {
                "id":"morning",
                "sky":{
                    "luminance":       0.99  ,
                    "turbidity":       5.71  ,
                    "rayleigh":        0.9   ,
                    "mieCoefficient":  0.015 ,
                    "mieDirectionalG": 0.7  ,
                    "inclination": 0.30,
                    "azimuth": 0.25,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0.98, 0.76,  0.15]},
                    {"id":"moon",    "color":[0.01, 0.25,  0.25]},
                    {"id":"ambient", "color":[0.06, 0.1,   0.35]},
                    {"id":"fog",     "color":[0.63, 0.69,  0.99], "density":0.003}
                ]
            },
            {
                "id":"evening",
                "sky":{
                    "luminance":         0.5    ,
                    "turbidity":         11.71  ,
                    "rayleigh":          2.1    ,
                    "mieCoefficient":    0.005  ,
                    "mieDirectionalG":   0.7  ,
                    "inclination": 0.30,
                    "azimuth": 0.4965,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0.95,  0.42,  0.00]},
                    {"id":"moon",    "color":[0.25,  0.20,  0.42]},
                    {"id":"ambient", "color":[0.25,  0.14,  0.11]},
                    {"id":"fog",     "color":[0.03,  0.01,  0.02], "density":0.005}
                ]
            },
            {
                "id":"night",
                "sky":{
                    "luminance":         0.08    ,
                    "turbidity":         21.71  ,
                    "rayleigh":          1.301    ,
                    "mieCoefficient":    0.015  ,
                    "mieDirectionalG":   0.202  ,
                    "inclination": 0.38,
                    "azimuth": 0.75,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0.026,  0.25,  0.38]},
                    {"id":"moon",    "color":[0.021,  0.03,  0.22]},
                    {"id":"ambient", "color":[0.222,  0.26,  0.89]},
                    {"id":"fog",     "color":[0.001,  0.001, 0.02], "density":0.009}
                ]
            },
            {
                "id":"pre_dawn",
                "sky":{
                    "luminance":         0.12 ,
                    "turbidity":         18.01 ,
                    "rayleigh":          3.51  ,
                    "mieCoefficient":    0.071 ,
                    "mieDirectionalG":   0.58  ,
                    "inclination":       0.5   ,
                    "azimuth":           0.5   ,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0.35,   0.43,  0.16]},
                    {"id":"moon",    "color":[0.001,  0.03,  0.12]},
                    {"id":"ambient", "color":[0.22,   0.33,  0.56]},
                    {"id":"fog",     "color":[0.022,  0.025, 0.052], "density":0.007}
                ]
            },
            {
                "id":"dawn",
                "sky":{
                    "luminance":         0.1    ,
                    "turbidity":         12.71  ,
                    "rayleigh":          0.0    ,
                    "mieCoefficient":    0.008  ,
                    "mieDirectionalG":   0.582  ,
                    "inclination":       0.50   ,
                    "azimuth":           0.19   ,
                    "distance":          10000
                },
                "configs":[
                    {"id":"sun",     "color":[0.85,  0.62,  0.30]},
                    {"id":"moon",    "color":[0.25,  0.20,  0.42]},
                    {"id":"ambient", "color":[0.35,  0.45,  0.06]},
                    {"id":"fog",     "color":[0.00,  0.06,  0.18],  "density":0.003}
                ]
            }
        ];

        environmentListLoaded('', envData);

        // new PipelineObject("ENVIRONMENT", "THREE", environmentListLoaded);

    };

    return ThreeEnvironment;

});