// # Ghost bootloader
// Orchestrates the loading of Ghost
// When run from command line.

// Get chocolatey environment variable and change to that directory.
var ChocolateyInstall = process.env.ChocolateyInstall;
var PackageName = 'ghost';
var PackageVersion = '0.5.5';
var GhostDir = path.join(ChocolateyInstall,'lib',PackageName,PackageVersion);
process.chdir(GhostDir);

var express,
    ghost,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
ghost = require('./core');
errors = require('./core/server/errors');

// Create our parent express app instance.
parentApp = express();

ghost().then(function (ghostServer) {
    // Mount our ghost instance on our desired subdirectory path if it exists.
    parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

    // Let ghost handle starting our server instance.
    ghostServer.start(parentApp);
}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});