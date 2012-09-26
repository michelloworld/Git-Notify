
GitNotify = {
	bitbucketFeedUrl    : "",
	notificationTime    : 3000,
	intervalTime        : 12000,
	githubIcon19        : "images/github-icon-19.png",
	githubIcon48        : "images/github-icon-48.png",
	bitbucketIcon19     : "images/bitbucket-icon19.png",
	bitbucketIcon48     : "images/bitbucket-icon48.png",

	init : function() {
		this.checkFeed();
		this.checkFeedInterval();
	},

	checkFeed : function() {
		var self = this;

		var resetPubDate = false;
		// check bitbucketFeedUrl from localStorage
		if(localStorage.getItem("bitbucketFeedUrl") != null) {
			this.bitbucketFeedUrl = localStorage.getItem("bitbucketFeedUrl");
			resetPubDate = true;
		}

		// stop function if there is no bitbucketFeedUrl
		if(this.bitbucketFeedUrl == null || this.bitbucketFeedUrl == "") {
			return;
		}

		console.log("loading...");
		$.get(this.bitbucketFeedUrl, function(feed) {
			var jsonFeed = $.xml2json(feed);

			var itemSelected = self.checkItemSelected(jsonFeed);

			if(resetPubDate) {
				if(itemSelected.pubDate != localStorage.getItem("lastPubDate")) {
					localStorage.removeItem("lastPubDate");
				}
			}

			// check recent feed data
			if(itemSelected.pubDate > localStorage.getItem("lastPubDate") || localStorage.getItem("lastPubDate") == null) {
				localStorage.setItem("lastPubDate", itemSelected.pubDate);
				localStorage.setItem("jsonFeed", JSON.stringify(jsonFeed));

				// show notify
				self.notify(jsonFeed);

				// show Feed data at popup page
				self.showFeed();
			}

		});
	},

	showFeed : function() {
		$("#content ul").html("");
		
		// load jsonFeed from localStorage
		var jsonFeed = localStorage.getItem("jsonFeed");

		// check if jsonFeed is null then stop
		if(jsonFeed == null || jsonFeed == "") {
			return;
		}

		jsonFeed = JSON.parse(jsonFeed);

		// render html feed
		var item = jsonFeed.channel.item;

		for(var i = 0; (i < item.length && i <= 9); i++) {
			$("#content ul").append("<li><a href=\""+item[i].link+"\">"+item[i].title+"<div>"+item[i].pubDate+"</div>"+"</a></li>");
		}

		$("ul li a").live("click", function() {
			chrome.tabs.create({ url: $(this).attr("href") });
		});
	},

	checkFeedInterval : function() {
		var self = this;

		setTimeout(function() {
			self.checkFeed();
			self.checkFeedInterval();
		}, this.intervalTime);
	},

	notify : function(jsonFeed) {
		var itemSelected = this.checkItemSelected(jsonFeed);

		var title = itemSelected.title;
		
		var pubDate = itemSelected.pubDate;

		var notification = webkitNotifications.createNotification(
		  this.bitbucketIcon48,
		  title,
		  pubDate
		);

		// show notification
		notification.show();

		// close notification every ... sec
		setTimeout(function(){ notification.close(); }, this.notificationTime);
	},

	checkItemSelected : function(jsonFeed) {
		// fix if there is one committed in feed
		var itemSelected = jsonFeed.channel.item;
		if(jsonFeed.channel.item.length > 1) {
			itemSelected = jsonFeed.channel.item[0];
		}

		return itemSelected;
	}

}
