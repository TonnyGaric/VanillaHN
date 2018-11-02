initialize();
const pageSize = 30;
var pageName;

function initialize() {
  	const urlParams = new URLSearchParams(window.location.search);

  	switch (urlParams.get("pageName")) {
		case "new":
			pageName = "new";
			initNewPage();
			break;
		case "show":
			pageName = "show";
			initShowPage();
			break;
		case "ask":
			pageName = "ask";
			initAskPage();
			break;
		case "job":
			pageName = "job";
			initJobPage();
			break;
		case "user":
			pageName = "user";
			initUserPage();
			break;
		case "item":
			pageName = "item";
			initItemPage();
			break;
		default:
			pageName = "top";
			initTopPage();
  	}
}

function initTopPage() {
	console.log("Initializing top page");

	makeNavButtonsActive();

	const xmlhttp = new XMLHttpRequest();
	const result = document.getElementById("result");

	// First, retrieve all ids of top stories
	xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
			let items = JSON.parse(this.responseText);
			result.innerHTML = "";
			const ol = document.createElement("ol");
			result.appendChild(ol);
			items = applyPagination(items);
			constructItems(items);
   	 	}
  	};

  	xmlhttp.open(
		"GET",
		"https://hacker-news.firebaseio.com/v0/topstories.json",
		true
	);
	xmlhttp.send();
}

function initNewPage() {
	console.log("Initializing new page");

	makeNavButtonsActive();

	const xmlhttp = new XMLHttpRequest();
	const result = document.getElementById("result");

	// First, retrieve all ids of top stories
	xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
			let items = JSON.parse(this.responseText);
			result.innerHTML = "";
			const ol = document.createElement("ol");
			result.appendChild(ol);
			items = applyPagination(items);
			constructItems(items);
    	}
  	};

  	xmlhttp.open(
		"GET",
		"https://hacker-news.firebaseio.com/v0/newstories.json",
		true
	);
	xmlhttp.send();
}

function initShowPage() {
	console.log("Initializing show page");
	makeNavButtonsActive();
}

function initAskPage() {
	console.log("Initializing ask page");
	makeNavButtonsActive();
}

function initJobPage() {
	console.log("Initializing job page");
	makeNavButtonsActive();
}

function initUserPage() {
  	console.log("Initializing user page");

	// User page does not need pagination,
	// so we can safely remove it.
	removePagination();

  	makeNavButtonsActive();

	const urlParams = new URLSearchParams(window.location.search);

	// Verify if there is a param id present.
	// If not, redirect to index, because
	// we cannot show a user, without a
	// user id.
	if (!urlParams.has("id")) {
		window.location.href = window.location.pathname;
	}

	// We are sure we have a user id in the params.
	userId = urlParams.get("id");

	const xmlhttp = new XMLHttpRequest();
	const result = document.getElementById("result");

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const json = JSON.parse(this.responseText);

			result.innerHTML = "";

			// If user is not found, return some feedback to user.
			if (json == null) {
				result.appendChild(document.createTextNode("No such user."));
				return;
			}

			const dl = document.createElement("dl");
			result.appendChild(dl);

			// Add username
			const usernameDt = document.createElement("dt");
			usernameDt.appendChild(document.createTextNode("Username"));
			dl.appendChild(usernameDt);

			const usernameDd = document.createElement("dd");
			usernameDd.appendChild(document.createTextNode(json.id));
			dl.appendChild(usernameDd);

			// Add created datetime
			const createdDt = document.createElement("dt");
			createdDt.appendChild(document.createTextNode("Created"));
			dl.appendChild(createdDt);

			const createdDd = document.createElement("dd");
			createdDd.appendChild(document.createTextNode(json.created));
			dl.appendChild(createdDd);

			// Add karma
			const karmaDt = document.createElement("dt");
			karmaDt.appendChild(document.createTextNode("Karma"));
			dl.appendChild(karmaDt);

			const karmaDd = document.createElement("dd");
			karmaDd.appendChild(document.createTextNode(json.karma));
			dl.appendChild(karmaDd);

			// about
			const aboutDt = document.createElement("dt");
			aboutDt.appendChild(document.createTextNode("About"));
			dl.appendChild(aboutDt);

			// If user did not provide an about text, Hacker News shows
			// "About" without any text. See user varal7 for example.
			// We will do the same.
			const aboutDd = document.createElement("dd");
			// If user did not provide an about text, json.about will be
			// undefined. Because null == undefined is true, the code
			// below will catch both null and undefined.
			if (json.about != null) {
				// Hacker News renders about as HTML, so we will too.
				aboutDd.innerHTML = json.about;
				dl.appendChild(aboutDd);
			}

			// TODO: add submissions URL
			// TODO: add comments URL
			// TODO: add favorites URL
		}
  	};

  	xmlhttp.open(
		"GET",
		"https://hacker-news.firebaseio.com/v0/user/" + userId + ".json",
		true
	);
	xmlhttp.send();
}

function initItemPage() {
	console.log("Initializing item page");
	makeNavButtonsActive();
}

function makeNavButtonsActive() {
	console.log("Making nav buttons of page [" + pageName + "] active");
	const buttons = document.getElementsByClassName("nav-" + pageName);

	Array.prototype.forEach.call(buttons, function(button) {
		button.classList.add("active");
	});
}

function removePagination() {
	document.getElementById("pagination").remove();
}

function applyPagination(items) {
	console.log("Applying pagination");

	const currentPage = getCurrentPageNumber(items);
	const begin = (currentPage - 1) * pageSize;
	const end = currentPage * pageSize;

	document.querySelector("#result > ol").setAttribute("start", begin + 1);

	// Apply logic for previous button
	const prevPageButton = document.getElementById("prev-page");
	const hasPrevPage = items.length - pageSize * currentPage > 0;
	const prevPageNumber = parseInt(currentPage) + 1;
	console.log("Has previous page [" + hasPrevPage + "]");
	if (hasPrevPage) {
		console.log("Prev page number is [" + prevPageNumber + "]");
		prevPageButton.classList.remove("disabled");
		prevPageButton.href = "?pageName=" + pageName + "&p=" + prevPageNumber;
	} else {
		prevPageButton.classList.add("disabled");
		prevPageButton.removeAttribute("href");
	}

	// Apply logic for next button
	const nextPageButton = document.getElementById("next-page");
	const hasNextPage = currentPage > 1;
	const nextPageNumber = parseInt(currentPage) - 1;
	console.log("Has next page [" + hasNextPage + "]");
	if (hasNextPage) {
		console.log("Next page number is [" + nextPageNumber + "]");
		nextPageButton.classList.remove("disabled");
		nextPageButton.href = "?pageName=" + pageName + "&p=" + nextPageNumber;
	} else {
		nextPageButton.classList.add("disabled");
		nextPageButton.removeAttribute("href");
	}

	return items.slice(begin, end);
}

function getCurrentPageNumber(items) {
	let page = 1;
	const urlParams = new URLSearchParams(window.location.search);

	if (urlParams.has("p") && !isNaN(urlParams.get("p"))) {
		page = urlParams.get("p");
	}

	// Current page number cannot be less than or equal to 0.
	// AND cannot be greater than the maximum number of pages.
	const maxPages = Math.ceil(items.length / pageSize);
	if (page <= 0 || page > maxPages) {
		page = 1;
	}

	console.log("Current page number is [" + page + "]");

	return page;
}

function constructItems(items) {
  	items.forEach(id => {
		const xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(this.response);

				const h2 = document.createElement("h2");
				h2.classList.add("mb-1");

				const urlAnchor = document.createElement("a");
				urlAnchor.href = json.url;
				urlAnchor.classList.add("text-body");
				urlAnchor.appendChild(document.createTextNode(json.title));
				h2.appendChild(urlAnchor);

				const p = document.createElement("p");
				p.classList.add("small", "text-muted");

				const byAnchor = document.createElement("a");
				byAnchor.href = "?pageName=user&id=" + json.by;
				byAnchor.classList.add("text-muted");
				byAnchor.appendChild(document.createTextNode(json.by));

				p.appendChild(document.createTextNode(json.score + " points by "));
				p.appendChild(byAnchor);
				p.appendChild(
					document.createTextNode(" | " + json.descendants + " comments")
				);

				const article = document.getElementById(id);
				article.parentElement.classList.remove("loading", "mb-3");
				article.appendChild(h2);
				article.appendChild(p);
			}
		};

		const li = document.createElement("li");
		li.classList.add("loading", "mb-3");
		const article = document.createElement("article");
		article.id = id;
		li.appendChild(article);
		document.querySelector("#result > ol").appendChild(li);

		xmlhttp.open(
			"GET",
			"https://hacker-news.firebaseio.com/v0/item/" + id + ".json",
			true
		);
		xmlhttp.send();
	});
}
