
GitNotify = {
	bitbucketFeedUrl : "http://localhost/social_coding/feed.xml",
	// bitbucketFeedUrl : "https://bitbucket.org/firecreekmic/rss/feed?token=35e0869ce04dcc4dde65657d327a0e14",
	notificationTime : 3000,
	intervalTime : 6000,
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

		// stop function if there is no bitbucketFeedUrl
		if(this.bitbucketFeedUrl == null || this.bitbucketFeedUrl == "") {
			return;
		}

		var resetPubDate = false;
		// check bitbucketFeedUrl from localStorage
		if(localStorage.getItem("bitbucketFeedUrl") != null) {
			this.bitbucketFeedUrl = localStorage.getItem("bitbucketFeedUrl");
			resetPubDate = true;
		}

		console.log("loading...");
		$.get(this.bitbucketFeedUrl, function(feed) {
			var jsonFeed = $.xml2json(feed);

			if(resetPubDate) {
				if(jsonFeed.channel.item[0].pubDate != localStorage.getItem("lastPubDate")) {
					localStorage.removeItem("lastPubDate");
				}
			}

			// check recent feed data
			if(jsonFeed.channel.item[0].pubDate > localStorage.getItem("lastPubDate") || localStorage.getItem("lastPubDate") == null) {
				localStorage.setItem("lastPubDate", jsonFeed.channel.item[0].pubDate);
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
		for(var i = 0; i < 10; i++) {
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
		// var titleRegex = /(.*) (committed) .* to (.*)/;
		// [1] = username
		// [2] = event (committed)
		// [3] = project
		// var title = titleRegex.exec(jsonFeed.channel.item[0].title);
		var title = jsonFeed.channel.item[0].title;

		var link = jsonFeed.channel.item[0].link;

		var commitMsg = jsonFeed.channel.item[3].description.p;
		
		var pubDate = jsonFeed.channel.item[0].pubDate;

		var notification = webkitNotifications.createNotification(
		  this.bitbucketIcon48,
		  // notification title
		  // title[1]+' '+title[2]+' to '+title[3],
		  title,
		  // notification body text
		  pubDate
		);

		// show notification
		notification.show();

		// close notification every ... sec
		setTimeout(function(){ notification.close(); }, this.notificationTime);
	}

}
