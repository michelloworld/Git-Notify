// global function getSetting from localstorage
Object.prototype.getSetting = function(callback) {
	var self = this;

	// self.bitbucketFeedUrl = (localStorage.getItem("bitbucketFeedUrl") == null) ? self.bitbucketFeedUrl : localStorage.getItem("bitbucketFeedUrl");
	// self.notificationTime = localStorage.getItem("notificationTime")*1000;
	chrome.storage.local.get(["bitbucketFeedUrl", "notificationTime"], function(data) {
		self.bitbucketFeedUrl = data.bitbucketFeedUrl;
		self.notificationTime = data.notificationTime*1000;

		// optional callback function
		if(callback && typeof(callback) === "function") {
			callback();
		}
	});
}