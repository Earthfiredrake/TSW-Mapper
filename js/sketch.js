var scl = 0.7;

var baseURL = window.location.href;
baseURL = baseURL.slice(0, baseURL.lastIndexOf("/"));
var url = baseURL + "/dat/maps_krampus.json";
tswMapper.loadViews([url]);

var selViewIndex = 0;
var selMapIndex = 0;
var selCoordIndex = 0;
var selView;
var selMap;
var selCoord;

function setup() {
  var canvas = createCanvas(1080*scl, 1080*scl);
  canvas.parent("canvas");

  refresh();
  noLoop();
}

function draw() {
}

function ring(x, y, r) {
  stroke(255, 215, 0);
  ellipse(x, y, r, r);

  stroke(0);
  ellipse(x, y, r-2, r-2);
  ellipse(x, y, r+2, r+2);
}

function populateControls(level) {
  if (level == undefined) {
    level = 0;
  }

  if (level == 0) {
    if (selView !== undefined) {
      selView.remove();
    }

    selView = createSelect();
    selView.parent("map-view");
    for(var i=0; i < tswMapper.data.views.length; i++) {
      selView.option(tswMapper.data.views[i].name);
    }
    selView.changed(selectViewEvent);
  }

  if (level <= 1) {
    if (selMap !== undefined) {
      selMap.remove();
    }
    var view = getMapView();
    selMap = createSelect();
    selMap.parent("maps");
    for(var i=0; i < view.maps.length; i++) {
      selMap.option(view.maps[i].name);
    }
    selMap.changed(selectMapEvent);
  }

  if (level <= 2) {
    if (selCoord !== undefined) {
      selCoord.remove();
    }
    var map = getMap();
    selCoord = createSelect(true);
    selCoord.parent("coords");
    for (var i=0; i < map.coordinates.length; i++) {
      selCoord.option(map.coordinates[i]);
    }
    selCoord.changed(selectCoordEvent);
  }
}

function getMapView() {
  return tswMapper.data.views[selViewIndex];
}

function getMap() {
  return getMapView().maps[selMapIndex];
}

function getMapCoord() {
  return getMap().coordinates[selCoordIndex];
}

function getMapCoords() {
  return getMap().coordinates;
}


function drawPoints() {
  var m = getMap();
  var c = getMapCoords();
  for(var i = 0; i < c.length; i++) {
    var p = c[i];
    stroke(0);
    fill(255, 0, 0);
    rectMode(CENTER);

    var x = map(p[0], m.xMax, 0, m.imgWidth, 0);
    var y = map(p[1], m.yMax, 0, 0, m.imgHeight);
    rect(x*scl, y*scl, 4, 4);
  }
}

function drawSelected() {
    noFill();
    var r = 15;
    ring(p[0]*scl, height-p[1]*scl, r);
}

function selectViewEvent() {
  var index = 0;

  var v = selView.value();
  var views = tswMapper.data.views;
  for (var i = 0; i < views.length; i++) {
    if (v == views[i].name) {
      index = i;
    }
  }
  selViewIndex = index;
  refresh(1);
}

function selectMapEvent() {
  var index = 0;

  var v = selMap.value();
  var maps = getMapView().maps;
  for (var i = 0; i < maps.length; i++) {
    if (v == maps[i].name) {
      index = i;
    }
  }
  selMapIndex = index;
  refresh(2);
}

function selectCoordEvent() {
  refresh(3);
}

function refresh(level) {
  populateControls(level);

  var i = getMap().url;
  loadImage(i, function(img) {
    image(img, 0, 0, floor(img.width*scl), floor(img.height*scl));
    drawPoints();
  });

}
