AFRAME.registerSystem('teleporter', {
    init: function () {
        console.log("in teleporter system init");
        this.teleportPosition = "0 0 0";
        window.addEventListener('loaded', this.onSceneLoaded.bind(this));
    },
    onSceneLoaded: function(evt) {
        console.log("in voice-command system onSceneLoaded listener");
    },
});
AFRAME.registerComponent('teleporter', {

    schema: {
        character: { type: 'selector' },
        marker: { type: 'selector' }
    },
    init: function () {
        console.log("in teleporter init");
        this.isRaycasterActive = false;
        this.el.teleportPoint = "0 0 0";
        this.el.hasTeleportPoint = false;
        this.el.addEventListener('raycaster-intersection', function (evt) {
           // console.log('Raycast hit something!, evt intersection point: '+AFRAME.utils.coordinates.stringify(evt.detail.intersections[0].point));
            //var teleportSystem = document.querySelector('a-scene').systems['teleporter'];
            //teleportSystem.teleportPosition = "0 0 0";
            var intersectionPoint = evt.detail.intersections[0].point;
            this.teleportPoint = AFRAME.utils.coordinates.stringify(evt.detail.intersections[0].point);
            this.hasTeleportPoint = true;
            var markerPoint = intersectionPoint;
            markerPoint.y = markerPoint.y + 0.8; // TODO: find better way to set character height
            //console.log("in raycaster-intersection, components: "+this.components);
            //console.log("in raycaster-intersection, teleporter: "+this.components['teleporter']);
            var teleporterComponent = this.components['teleporter'];
            if (teleporterComponent.isRaycasterActive) {
                var marker = teleporterComponent.data.marker;
                marker.setAttribute("position", AFRAME.utils.coordinates.stringify(markerPoint));
                marker.setAttribute("visible", "true");
            }
        });
        this.el.addEventListener('raycaster-intersection-cleared', function (evt) {
           // console.log('Raycast intersection cleared!');
            this.hasTeleportPoint = false;
            var teleporterComponent = this.components['teleporter'];
            var marker = teleporterComponent.data.marker;
            marker.setAttribute("visible", "false");
        });
    },
    showRaycaster: function() {
        console.log("in showRaycaster");
        this.isRaycasterActive = true;
        this.el.setAttribute("material", "color: magenta; shader: flat");
    },
    teleport: function() {
        console.log("in teleport, rayCasterActive: "+this.isRaycasterActive+", hasTeleportPoint: "+this.el.hasTeleportPoint);
        if (this.isRaycasterActive && this.el.hasTeleportPoint) {
            var teleportPoint = AFRAME.utils.coordinates.parse(this.el.teleportPoint);
            teleportPoint.y = teleportPoint.y + 2; // TODO: find better way to set character height
            character.setAttribute("position", AFRAME.utils.coordinates.stringify(teleportPoint));
            this.data.marker.setAttribute("visible", "false");
        }
        this.isRaycasterActive = false;
        this.el.setAttribute("material", "color: cyan; shader: flat");
    },
    cancel: function() {
        console.log("in showRaycaster");
        this.isRaycasterActive = false;
        this.el.setAttribute("material", "color: cyan; shader: flat");
        this.data.marker.setAttribute("visible", "false");
    },
    play: function() {
        console.log("in teleporter play");
    }
});

