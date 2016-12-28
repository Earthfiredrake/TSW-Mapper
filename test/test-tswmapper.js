QUnit.module("model.coordinate");
QUnit.test("Instantiation", function(assert) {
	var name = "Test";
	var x = 100;
	var y = 200;
	var coord = new tswMapper.model.coordinate(name, x, y);

	assert.equal(coord.name, name);
	assert.equal(coord.x, x);
	assert.equal(coord.y, y);
});

QUnit.test("Decoupling", function(assert) {
	var name = "Test";
	var x = 100;
	var y = 200;
	var coord = new tswMapper.model.coordinate(name, x, y);

	assert.equal(coord.name, name);
	assert.equal(coord.x, x);
	assert.equal(coord.y, y);
	assert.notDeepEqual(coord, tswMapper.model);

	var name2 = "Test2";
	var x2 = 101;
	var y2 = 202;
	var coord2 = new tswMapper.model.coordinate(name2, x2, y2);

	assert.notDeepEqual(coord, coord2);
	assert.notDeepEqual(coord, tswMapper.model.coordinate);
	assert.notDeepEqual(coord2, tswMapper.model.coordinate);
});

QUnit.module("parser.extract");
QUnit.test("No whitespace on end", function(assert) {
	var name = "The Carpathian Fangs";
	var x = 1000;
	var y = 2000;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	coord2 = new tswMapper.model.coordinate(name, 1001, 2002);

	var text = "The Carpathian Fangs (1000, 2000) - Meetup: Auto -\n";
	text = text + "The Carpathian Fangs (1001, 2002) - Meetup: Auto -";
	var result = tswMapper.parser.extract(text);

	assert.deepEqual(result, [coord1, coord2]);
});

QUnit.test("4 digit coordinates", function(assert) {
	var name = "The Carpathian Fangs";
	var x = 1000;
	var y = 2000;
	var coord = new tswMapper.model.coordinate(name, x, y);

	var text = "The Carpathian Fangs (1000, 2000) - Meetup: Auto - ";
	var result = tswMapper.parser.extract(text);

	assert.deepEqual(result, [coord]);
});

QUnit.module("parser.extract");
QUnit.test("1 and 2 digit coordinates", function(assert) {
	var name = "The Carpathian Fangs";
	var x = 1;
	var y = 20;
	var coord = new tswMapper.model.coordinate(name, x, y);

	var text = "The Carpathian Fangs (1, 20) - Meetup: Auto - ";
	var result = tswMapper.parser.extract(text);

	assert.deepEqual(result, [coord]);
});

QUnit.test("Negative coordinates", function(assert) {
	var name = "The Carpathian Fangs";
	var x = -1000;
	var y = -2000;
	var coord = new tswMapper.model.coordinate(name, x, y);

	var text = "The Carpathian Fangs (-1000, -2000) - Meetup: Auto - ";
	var result = tswMapper.parser.extract(text);

	assert.deepEqual(result, [coord]);
});

QUnit.test("Multiple entries", function(assert) {
	var entries = [];

	var name = "The Carpathian Fangs";
	var x = -1000;
	var y = -2000;
	var coord = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord);

	name = "Savage Coast";
	x = 30;
	y = 400;
	coord = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord);

	var text = "The Carpathian Fangs (-1000, -2000) - Meetup: Auto - \n";
	text += "Savage Coast (30, 400) - Meetup: Auto - ";
	var result = tswMapper.parser.extract(text);

	assert.deepEqual(result, entries);
});

QUnit.module("parser.sort");
QUnit.test("Empty", function(assert) {
	var entries = [];
	var result = tswMapper.parser.sort(entries);

	assert.deepEqual(result, []);
});

QUnit.test("Sort name", function(assert) {
	var entries = [];

	var name = "The Carpathian Fangs";
	var x = -1000;
	var y = -2000;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 30;
	y = 400;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.sort(entries);

	assert.deepEqual(result, [coord2, coord1]);
});

QUnit.test("X coord", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 70;
	var y = -2000;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 30;
	y = 400;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.sort(entries);

	assert.deepEqual(result, [coord2, coord1]);
});

QUnit.test("Y coord", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 70;
	var y = -2000;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 70;
	y = 400;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.sort(entries);

	assert.deepEqual(result, [coord1, coord2]);
});

QUnit.module("parser.filter");
QUnit.test("Empty", function(assert) {
	var entries = [];
	var result = tswMapper.parser.filter(entries);

	assert.deepEqual(result, []);
});

QUnit.test("No duplicate - different name", function(assert) {
	var entries = [];

	var name = "The Carpathian Fangs";
	var x = 30;
	var y = 400;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 30;
	y = 400;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.filter(entries);

	assert.deepEqual(result, [coord1, coord2]);
});

QUnit.test("No duplicate - same name, different X", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 40;
	var y = 40;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 30;
	y = 40;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.filter(entries);

	assert.deepEqual(result, [coord1, coord2]);
});

QUnit.test("No duplicate - same name, same x, different y", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 40;
	var y = 400;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 40;
	y = 30;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.filter(entries);

	assert.deepEqual(result, [coord1, coord2]);
});

QUnit.test("Duplicate - same x", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 40;
	var y = 40;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 40;
	y = 45;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.filter(entries);

	assert.deepEqual(result, [coord1]);
});

QUnit.test("Duplicate - same y", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 45;
	var y = 40;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 40;
	y = 40;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var result = tswMapper.parser.filter(entries);

	assert.deepEqual(result, [coord1]);
});

QUnit.module("parser.group");
QUnit.test("Empty", function(assert) {
	var entries = [];
	var result = tswMapper.parser.group(entries);

	assert.deepEqual(result, []);
});

QUnit.test("1 location 1 coord", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 60;
	var y = 40;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	var expected = [
		new tswMapper.model.map(coord1.name, coord1.x, coord1.y)
	];
	var result = tswMapper.parser.group(entries);

	assert.deepEqual(result, expected);
});

QUnit.test("1 location 2 coord", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 60;
	var y = 40;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "Savage Coast";
	x = 40;
	y = 40;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var expected = [
		new tswMapper.model.map(coord1.name, coord1.x, coord1.y)
	];
	expected[0].coordinates.push([coord2.x, coord2.y]);
	var result = tswMapper.parser.group(entries);

	assert.deepEqual(result, expected);
});

QUnit.test("2 location", function(assert) {
	var entries = [];

	var name = "Savage Coast";
	var x = 60;
	var y = 40;
	var coord1 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord1);

	name = "The Blue Mountain";
	x = 40;
	y = 40;
	var coord2 = new tswMapper.model.coordinate(name, x, y);
	entries.push(coord2);

	var expected = [
		new tswMapper.model.map(coord1.name, coord1.x, coord1.y),
		new tswMapper.model.map(coord2.name, coord2.x, coord2.y)
	];
	var result = tswMapper.parser.group(entries);

	assert.deepEqual(result, expected);
});
