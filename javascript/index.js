
angular.module('zakavila', [])
.controller('ContentController', ['$scope', '$sce', function($scope, $sce) {
	$scope.contentObject = {"type":"textLine", "details":{"text":"loading..."}};
	window.trustAsHtml = $sce.trustAsHtml;
}]);

var contentObjectDictionary = {};

$(document).ready(function() {

	$.getJSON("contentObjectDictionary.json", function(data) {
		contentObjectDictionary = data;
		for (var property in contentObjectDictionary) {
			if (contentObjectDictionary.hasOwnProperty(property)&&contentObjectDictionary[property].details.text) {
				contentObjectDictionary[property].details.text = window.trustAsHtml(contentObjectDictionary[property].details.text);
			}
		}
		var targetPage = document.location.hash;
		if (targetPage=="") { targetPage = "index" };
		targetPage = targetPage.replace("#", "");
		angular.element("body").scope().contentObject = contentObjectDictionary[targetPage];
		angular.element("body").scope().$apply();
		document.getElementById("pageContent").style.opacity=0.95;
		document.getElementById("pageContent").offsetHeight;
		document.getElementById("pageContent").style.opacity=1.0;
	});

	$(document).on("click", ".choice", function() {
		var targetPage = angular.element(this).scope().choice.target;
		window.location.hash = targetPage;
	});

});

window.onpopstate = function(event) {
	var targetPage = document.location.hash;
	if (targetPage=="") { targetPage = "index" };
	targetPage = targetPage.replace("#", "");
	angular.element("body").scope().contentObject = contentObjectDictionary[targetPage];
	angular.element("body").scope().$apply();
	document.getElementById("pageContent").style.opacity=0.95;
	document.getElementById("pageContent").offsetHeight;
	document.getElementById("pageContent").style.opacity=1.0;
};