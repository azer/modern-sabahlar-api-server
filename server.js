var podcast = require("./index");
var server = require("json-resources");

var resources = {
  '*': modernSabahlar
};

server(resources).start('', process.env.PORT || 5000);

function modernSabahlar (_, callback) {
  podcast(callback);
}
