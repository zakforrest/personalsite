
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
			if (contentObjectDictionary.hasOwnProperty(property)&&"text" in contentObjectDictionary[property].details) {
				contentObjectDictionary[property].details.text = contentObjectDictionary[property].details.text.split("!removethis!").join("");
				contentObjectDictionary[property].details.text = window.trustAsHtml(contentObjectDictionary[property].details.text);
			}
			else if (contentObjectDictionary.hasOwnProperty(property)&&contentObjectDictionary[property].type=="descriptionList"&&"choices" in contentObjectDictionary[property].details) {
				for (var index = 0; index < contentObjectDictionary[property].details.choices.length; index++) {
					contentObjectDictionary[property].details.choices[index].text = window.trustAsHtml(contentObjectDictionary[property].details.choices[index].text);
				}
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

	$(document).on("click", ".title", function() {
		window.location.hash = "";
	});

	$(document).on("click", ".choice", function() {
		var targetPage = angular.element(this).scope().choice.target;
		window.location.hash = targetPage;
	});	

	$(document).on("click", ".descriptionImageContainer", function() {
		var targetPage = document.location.hash;
		if (targetPage=="") { targetPage = "index" };
		targetPage = targetPage.replace("#", "");
		if (contentObjectDictionary[targetPage].details.preview) {
			var swipeboxImages = [];
			for (var index = 0; index < contentObjectDictionary[targetPage].details.imageUrl.length; index++) {
				var image = contentObjectDictionary[targetPage].details.imageUrl[index];
				swipeboxImages.push({ href: image, title: '' });
			}
			$.swipebox(swipeboxImages);
		}
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