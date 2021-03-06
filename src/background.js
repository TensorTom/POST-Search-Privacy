chrome.webRequest.onBeforeRequest.addListener(
	function (details) {
		chrome.tabs.update(details.tabId, {
			url: chrome.runtime.getURL("src/search.html"),
		})
		const url = new URL(details.url)
		let qel
		if (url.searchParams.has('q'))
			qel = 'q'
		if (url.searchParams.has('query'))
			qel = 'query'
		const qval = url.searchParams.getAll(qel)
		const handler = function (tabId, changeInfo) {
			if (tabId === details.tabId && changeInfo.status === "complete") {
				chrome.tabs.onUpdated.removeListener(handler)
				chrome.tabs.sendMessage(tabId, {
					data: qval,
					qel: qel,
					url: url
				})
			}
		}
		chrome.tabs.onUpdated.addListener(handler)
		chrome.tabs.sendMessage(details.tabId, {
			data: qval,
			qel: qel,
			url: url
		})
		return { cancel: true }
	},
	{
		urls: [
			"https://duckduckgo.com/?*q=*",
			"https://start.duckduckgo.com/?*q=*",
			"http://duckduckgo.com/?*q=*",
			"http://start.duckduckgo.com/?*q=*",
			"http://www.startpage.com/sp/search?*query=*",
			"http://startpage.com/sp/search?*query=*",
			"https://www.startpage.com/sp/search?*query=*",
			"https://startpage.com/sp/search?*query=*",
			"http://www.startpage.com/do/search?*q=*",
			"http://startpage.com/do/search?*q=*",
			"https://www.startpage.com/do/search?*q=*",
			"https://startpage.com/do/search?*q=*"
		],
	},
	["blocking"]
)
