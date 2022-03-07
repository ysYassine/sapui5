/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"week31/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});