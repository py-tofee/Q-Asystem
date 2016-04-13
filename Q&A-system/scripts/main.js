/**
 * 功能：
 */
/*global define:true, require:true, angular:true, console:true */

(function() {
	"use strict";

	var pathRX = new RegExp(/\/[^\/]+$/), locationPath = location.pathname.replace(pathRX, '')

	define('angular', function() {
		if(angular) {
			return angular
		}
		return {}
	})

	define('postal', function() {
		if (postal) { 
			return postal 
		}
		return {}
	})

	require({
		async: true,
		aliases: [['text','dojo/text']],
		packages:
		[
			{
				name: 'controllers',
				location: locationPath + '/scripts/controllers'
			},
			{
				name: 'widgets',
				location: locationPath + '/scripts/widgets'
			},
			{
				name: 'scripts',
				location: locationPath + '/scripts'
			}

		]
	})

	require([
		'dojo/ready',
		'scripts/bootstrap'
		], function(ready, bootstrap) {
			ready(function () {
				console.info('start the bootstrapper')
				bootstrap.start()
			})
		})

}).call(this)