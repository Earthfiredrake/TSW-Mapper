var tswMapper = {
  viewMode: 0,
  map: 0,
  coord: false,
  viewModes: [],
  getViewMode: function() {
    return this.viewMode;
  },
  getMaps: function() {
    return this.maps;
  },
  data: {
    mapInfo: [],
    views: []
  },
  model: {
    coordinate: function(name, x, y) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.str = function() {
        var s = this.name + " " + this.x + ", " + this.y;
        return s;
      }
    },
    map: function(name, x, y) {
      this.url = "";
      this.xOffset = 0;
      this.yOffset = 0;
      this.xMax = 0;
      this.yMax = 0;
      this.imgWidth = 0;
      this.imgHeight = 0;

      this.name =  "None";
      this.coordinates = [];
      if (name !== undefined) {
        this.name = name;
        this.coordinates = [[x, y]];
      }
    }
  },
  loadView: function(url) {
    function callback(data) {
      tswMapper.data.views.push(data);
    }

    var p5js = new p5();
    p5js.loadJSON(url, callback);
  },
  loadViews: function(urls) {
    for (var i = 0; i < urls.length; i++) {
      tswMapper.loadView(urls[i]);
    }
  },
  loadMapInfo: function(url) {
    function callback(data) {
      tswMapper.data.mapInfo = data;
    }

    var p5js = new p5();
    p5js.loadJSON(url, callback);
  },
  parser: {
    extract: function(input_text) {
      var entries = [];
      var match;

      var pattern = /^(.+) \((-?[0-9]{1,4}), (-?[0-9]{1,4})\) - Meetup: Auto - ?/gm;
      while (match = pattern.exec(input_text)) {
        var name = match[1];
        var x = Number(match[2]);
        var y = Number(match[3]);
        var entry = new tswMapper.model.coordinate(name, x, y);
        entries.push(entry);
      }
      return entries;
    },
    group: function(sorted_data) {
      var output = [];
      var map = new tswMapper.model.map();

      if (sorted_data.length > 0) {
        var dat = sorted_data[0];
        map = new tswMapper.model.map(dat.name, dat.x, dat.y);
      }
      for (var i = 1; i < sorted_data.length; i++) {
        var pDat = sorted_data[i-1];
        var dat = sorted_data[i];

        if (dat.name == pDat.name) {
          map.coordinates.push([dat.x, dat.y]);
        }
        else {
          output.push(map);
          map = new tswMapper.model.map(dat.name, dat.x, dat.y);
        }
      }
      if (map.coordinates.length > 0) {
        output.push(map);
      }
      return output;
    },
    merge: function(maps, mapInfo) {
      for (var i = 0; i < mapInfo.length; i++) {
        for (var j = 0; j < maps.length; j++) {
          if (maps[j].name == mapInfo[i].name) {
            for (var attrname in mapInfo[i]) {
              maps[j][attrname] = mapInfo[i][attrname];
            }
          }
        }
      }
      return maps;
    },
    process: function(input_text) {
      var data = this.extract(input_text);
      data = this.sort(data);
      data = this.filter(data);
      data = this.group(data);
      data = this.merge(data, tswMapper.data.mapInfo);
      data = this.format(data);
      return data;
    },
    sort: function(data) {
      data.sort(function(a, b) {
        //Sort by name
        var cmpName = a.name.localeCompare(b.name);
        if (cmpName != 0) {
          return cmpName;
        }
        //then by x coord
        var cmpX = a.x - b.x;
        if (cmpX != 0) {
          return cmpX;
        }
        //then by y coord
        return a.y - b.y;
      });
      return data;
    },
    filter: function(entries) {
      /* Filter duplicate coordinates
      */
      var minDist = 10;
      var output = [];

      if (entries.length > 0) {
        output.push(entries[0]);
      }
      for(var i = 1; i < entries.length; i++) {
        var entry = entries[i];
        var pEntry = entries[i-1];
        if (entry.name == pEntry.name) {
          //If names match then check coordinates are
          //greater than minimum diff distance.
          var xDiff = Math.abs(entry.x - pEntry.x);
          var yDiff = Math.abs(entry.y - pEntry.y);
          if (xDiff >= minDist || yDiff >= minDist) {
            output.push(entry);
          }
        }
        else {
          //Names don't match so not a dupe
          output.push(entry);
        }
      }
      return output;
    },
    format: function(entries) {
      return JSON.stringify(entries);
    }
  }
}
