// VanillaHN uses version 0 of Hacker News' API.
//
// All URLs of Hacker News' API are hardcoded.
// We did not chose to have a variable with the
// version, because the URLs could change if
// the version changes. So we would eventually
// still have to refactor everything.
//
// The latest version of the documentation
// of Hacker News' API can be found here:
// https://github.com/HackerNews/API

initialize();

/**
 * Maximum amount of items per page. Hacker News uses
 * 30, so we do too. If we ever decide to change the
 * pageSize, it should be sufficient to only change
 * this.
 */
const pageSize = 30;

/**
 * Name of this page, for example "new". The default
 * page is "top".
 * 
 * It is redundant to set "top" as the value of this
 * attribute here, because it will be set in the
 * default case of the switch statement in the
 * function initialize().
 */
var pageName;

/**
 * Sets pageName to the current page, according to
 * url param "pageName", and calls the appropriate
 * function that contains the logic to initialize
 * this page.
 */
function initialize() {
  	const urlParams = new URLSearchParams(window.location.search);

	// If url param "pageName" is not present or
	// if it is not a real page, and the default
	// "top" will be used.
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
			// Note that Hacker News does not have
			// a page named "item". However, we use
			// it for the pages like "comments".
			pageName = "item";
			initItemPage();
			break;
		default:
			pageName = "top";
			initTopPage();
  	}
}

/**
 * Initializes "top" page, by calling makeNavButtonsActive()
 * and constructStories().
 */
function initTopPage() {
	console.log("Initializing top page");
	makeNavButtonsActive();
	constructStories();
}

/**
 * Initializes "new" page, by calling makeNavButtonsActive()
 * and constructStories().
 */
function initNewPage() {
	console.log("Initializing new page");
	makeNavButtonsActive();
	constructStories();
}

/**
 * Initializes "show" page, by calling makeNavButtonsActive()
 * and constructStories().
 */
function initShowPage() {
	console.log("Initializing show page");
	makeNavButtonsActive();
	constructStories();
}

/**
 * Initializes "ask" page, by calling makeNavButtonsActive()
 * and constructStories().
 */
function initAskPage() {
	console.log("Initializing ask page");
	makeNavButtonsActive();
	constructStories();
}

/**
 * Initializes "job" page, by calling makeNavButtonsActive().
 */
function initJobPage() {
	console.log("Initializing job page");
	makeNavButtonsActive();
}

function initUserPage() {
  	console.log("Initializing user page");

	// User page does not need pagination, beacuse
	// we will only show one user on one page. So
	// we can safely remove the pagination to prevent
	// unneeded noise and provide a clean page.
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

	const urlParams = new URLSearchParams(window.location.search);

	// Verify if there is a param id present.
	// If not, redirect to index, because
	// we cannot show comments, without
	// an item id.
	if (!urlParams.has("id")) {
		window.location.href = window.location.pathname;
	}

	// We are sure we have an item id in the params.
	itemId = urlParams.get("id");
}

function makeNavButtonsActive() {
	console.log("Making nav buttons of page [" + pageName + "] active");
	const buttons = document.getElementsByClassName("nav-" + pageName);

	Array.prototype.forEach.call(buttons, function(button) {
		button.classList.add("active");
	});
}

/**
 * Removes the pagination element. Used for cases where
 * pagination is not needed, like for the "item" page.
 */
function removePagination() {
	document.getElementById("pagination").remove();
}

/**
 * Returns the current page number. The default page
 * number is "1".
 * 
 * @param {Array} Array with ids of items
 * @return {number} current page number
 */
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

function applyPagination(items) {
	console.log("Applying pagination");

	// Create variable for current page number,
	// to prevent calling getCurrentPageNumber()
	// several times.
	const currentPage = getCurrentPageNumber(items);
	
	// By default, the previous and next page buttons
	// are an anchor element, without a href attribute
	// and with the class disabled. So only if there
	// if a previous or next page, we must apply
	// logic to the button(s).

	// If there is a previous page, we will
	// determine the number of the previous
	// page and make the previous page
	// button link to it.
	if (items.length - (pageSize * currentPage) > 0) {
		// If we enter this if, it means there is a previous page.

		// We must use parseInt(), otherwise it
		// will be treated as a String.
		const prevPageNumber = parseInt(currentPage) + 1;

		console.log("Prev page number is [" + prevPageNumber + "]");

		const prevPageButton = document.getElementById("prev-page");
	
		prevPageButton.classList.remove("disabled");
		prevPageButton.href = "?pageName=" + pageName + "&p=" + prevPageNumber;
	}

	// If current page is greater than 1, there
	// must be a next page. In that case, we will
	// make the next page button link to it.
	if (currentPage > 1) {
		// If we enter this if, it means there is a next page.

		// We must use parseInt(), otherwise it
		// will be treated as a String.
		const nextPageNumber = parseInt(currentPage) - 1;

		console.log("Next page number is [" + nextPageNumber + "]");

		const nextPageButton = document.getElementById("next-page");

		nextPageButton.classList.remove("disabled");
		nextPageButton.href = "?pageName=" + pageName + "&p=" + nextPageNumber;
	}

	const begin = (currentPage - 1) * pageSize;
	const end = currentPage * pageSize;

	// Specify the start value for numbering the
	// individual list items. See:
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol#Attributes
	document.querySelector("#result > ol").setAttribute("start", begin + 1);

	// Return a shallow copy of a portion of the array items,
	// into a new array object selected from begin to end
	// (end not included). Note that the original array
	// will not be modified.
	// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
	return items.slice(begin, end);
}

function constructStories() {
	const xmlhttp = new XMLHttpRequest();
	const result = document.getElementById("result");

	// First, retrieve all ids of the  stories of this page.
	xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
			let items = JSON.parse(this.responseText);
			result.innerHTML = "";

			// We can only create the ol element. We cannot
			// create 30 li elements, because there may not
			// be 30 items for this page.
			//
			const ol = document.createElement("ol");
			result.appendChild(ol);
			
			// Apply pagination to Array, before we call constructItems().
			items = applyPagination(items);
			constructItems(items);
    	}
  	};

  	xmlhttp.open(
		"GET",
		"https://hacker-news.firebaseio.com/v0/" + pageName + "stories.json",
		true
	);
	xmlhttp.send();
}

/**
 * Retrieves item in JSON and constructs HTML for it.
 * The HTML of an item looks like the following:
 * <li class="">
 *     <article id="12345678">
 * 	       <h2 class="mb-1">
 *             <a href="https://github.com/TonnyGaric/VanillaHN" class="text-body">
 *                 Show HN: VanillaHN: a simple Hacker News client, built using only plain (vanilla) JavaScript—no frameworks involved.
 *             </a>
 *         </h2>
 *         <p class="small text-muted">
 *             123 points by <a href="?pageName=user&amp;id=TonnyGaric" class="text-muted">TonnyGaric</a> | <a href="?pageName=item&amp;id=12345678" class="text-muted">123 comments</a>
 *         </p>
 *     </article>
 * </li>
 * 
 * Note that the li element has an empty class attribute,
 * because when the JSON of this item is succesfully
 * retrieved, we remove the loading class.
 * 
 * @param {Array} Array with ids of items 
 */
function constructItems(items) {
  	items.forEach(id => {
		const xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				const json = JSON.parse(this.response);

				const h2 = document.createElement("h2");
				h2.classList.add("mb-1");

				const urlAnchor = document.createElement("a");
				// If this item does not have a url, this means
				// that we must use the "item" page with the id
				// of this item, for the href attribute.
				if (json.url == null) {
					// This item can be for example a comment or a user.
					urlAnchor.href = "?pageName=item&id=" + json.id;
				} else {
					urlAnchor.href = json.url;
				}
				urlAnchor.classList.add("text-body");
				urlAnchor.appendChild(document.createTextNode(json.title));
				h2.appendChild(urlAnchor);

				const p = document.createElement("p");
				p.classList.add("small", "text-muted");

				const byAnchor = document.createElement("a");
				byAnchor.href = "?pageName=user&id=" + json.by;
				byAnchor.classList.add("text-muted");
				byAnchor.appendChild(document.createTextNode(json.by));

				const commentsAnchor = document.createElement("a");
				commentsAnchor.href = "?pageName=item&id=" + json.id;
				commentsAnchor.classList.add("text-muted");
				commentsAnchor.appendChild(document.createTextNode(json.descendants + " comments"));

				p.appendChild(document.createTextNode(json.score + " points by "));
				p.appendChild(byAnchor);
				p.appendChild(document.createTextNode(" | "));
				p.appendChild(commentsAnchor);

				const article = document.getElementById(id);

				// Before appending the h2 and p element to article,
				// remove the classes loading and mb-3. Because we
				// are not loading any more, and the p element
				// has enough margin on the bottom.
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