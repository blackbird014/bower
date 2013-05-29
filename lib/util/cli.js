var mout = require('mout');
var nopt = require('nopt');
var renderers = require('../renderers');

function readOptions(options, argv) {
    var types;
    var noptOptions;
    var parsedOptions = {};
    var shorthands = {};

    options = options || {};

    types = mout.object.map(options, function (option) {
        return option.type;
    });
    mout.object.forOwn(options, function (option, name) {
        shorthands[option.shorthand] = '--' + name;
    });

    noptOptions = nopt(types, shorthands, argv);

    // Filter only the specified options because nopt parses every --
    options = mout.object.filter(noptOptions, function (value, key) {
        return !!options[key];
    });

    // Construct the final options, making every key camelCase
    mout.object.forOwn(options, function (value, key) {
        parsedOptions[mout.string.camelCase(key)] = value;
    });

    parsedOptions.argv = noptOptions.argv;

    return parsedOptions;
}

function getRenderer(config) {
    if (config.json) {
        return new renderers.Json();
    }

    return new renderers.Standard(config.color);
}

module.exports.readOptions = readOptions;
module.exports.getRenderer = getRenderer;