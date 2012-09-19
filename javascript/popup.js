
Popup = {
	bitbucketFeedId : "#bitbucket-feed-url",
	notificationTimeId : "#notification-time",

	init : function() {
		this.tabs();
		this.saveSetting();
		this.showSetting();
		GitNotify.showFeed();
	},

	tabs : function() {
		var aLinks = $("header nav a");
		aLinks.on("click", function(e) {
			e.preventDefault();
			// remove all active class
			aLinks.removeClass("active");
			// add class to current object
			$(this).addClass("active");

			// find tab content
			var content = $(this).attr("href");
			// hide all content
			$(".container article").hide();
			// show current content
			$(content).show();
		});
	},

	saveSetting : function() {
		var self = this;
		var form = $("form");
		form.on("submit", function(e) {
			e.preventDefault();
			var bitbucketFeedUrl = $(self.bitbucketFeedId).val();
			var notificationTime = $(self.notificationTimeId).val();

			// check if add a new feed url then clear old storage before save a new one
			if(chrome.extension.getBackgroundPage().localStorage.getItem("bitbucketFeedUrl") != bitbucketFeedUrl) {
				chrome.extension.getBackgroundPage().localStorage.removeItem("bitbucketFeedUrl");
				chrome.extension.getBackgroundPage().localStorage.removeItem("lastPubDate");
				chrome.extension.getBackgroundPage().localStorage.removeItem("jsonFeed");
			}

			// save setting to background page localStorage
			chrome.extension.getBackgroundPage().localStorage.setItem("bitbucketFeedUrl", bitbucketFeedUrl);
			chrome.extension.getBackgroundPage().localStorage.setItem("notificationTime", notificationTime);

			$("#message").html("Don't close until loading complete.");
			
			setTimeout(function() {
				// // check feed
				GitNotify.checkFeed();
			}, 100);
			
		});
	},

	showSetting : function() {
		$(this.bitbucketFeedId).val(chrome.extension.getBackgroundPage().localStorage.getItem("bitbucketFeedUrl"));
		$(this.notificationTimeId).val(chrome.extension.getBackgroundPage().localStorage.getItem("notificationTime"));
	}

}


$(function() {
	Popup.init();

	$("#loading").ajaxStart(function() {
		$(this).show();
	}).ajaxStop(function() {
		$(this).hide();
		
		$("#message").html("Complete!");
	});
})
