const API_URL = 'https://us-central1-free-the-fish.cloudfunctions.net';
const titleSelectors = 'article';
const titleLinkSelectors = 'a h2, h2 a, a h3, h3 a';

let report = {};

window._cbStart = addClickbait;

selectClickbaits();

window.log = console.log;

function selectClickbaits() {
	var links = document.querySelectorAll(titleLinkSelectors)
	var curatedLinks = [];

	for (var i = 0; i < links.length; i++) {
		if (links[i].tagName !== 'A') {
			curatedLinks[i] = getParentLink(links[i]);
		} else {
			curatedLinks[i] = links[i];
		}
	}
	// console.log(curatedLinks);

	searchClickbait(curatedLinks)
}

function searchClickbait(curatedLinks) {
	let data = {
		url: curatedLinks.map(link => link.href),
	};

	fetch(API_URL + '/test', {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then((response) => response.json())
		.then(function(response) {
			if (response.length > 0) {
				response.forEach((item, index) => {
					if (item !== null) {
						setClickbait(curatedLinks[index], item.spoiler || '');
					}
				});
			}
		})
		.catch(function(err) {
			console.error(err);
		});
}

function getParentLink(elem) {
	let parent = elem.parentElement;
	if (parent === null) {
		return elem;
	}

	if (parent.tagName.toUpperCase() === 'A') {
		return parent;
	}

	return getParentLink(parent);
}

function addClickbait() {
	// You can play with your DOM here or check URL against your regex
	var titles = document.querySelectorAll(titleSelectors)

	for (var i = 0; i < titles.length; i++) {
		var title = titles[i];
		addClass(title, 'baited');
		title.addEventListener('click', setSpoiler);
	}
}

function setSpoiler(event) {
	event.preventDefault();
	addClass(event.target, 'cb-reporting');

	reportDom(event.target);

	// Set report var URL
	for (var i = 0; i < event.path.length; i++) {
		var item = event.path[i];
		if (item.tagName === 'A') {
			report.url = item.href;
			break;
		}
	}

	var titles = document.querySelectorAll(titleSelectors);
	for (var i = 0; i < titles.length; i++) {
		var title = titles[i];
		removeClass(title, 'baited');
		title.removeEventListener('click', setSpoiler);
	}
}


function reportDom(element) {
	var bodyRect = document.body.getBoundingClientRect(),
		elemRect = element.getBoundingClientRect(),
		offsetY = elemRect.top - bodyRect.top,
		offsetX = elemRect.left - bodyRect.left;

	var close = document.createElement('a');
	close.innerText = 'x';
	close.className = 'cb-report__close';
	close.setAttribute('id', 'cb-report__close');

	var elem = document.createElement('div');
	elem.style.cssText = 'top:'+ (offsetY + 32) +'px; left:'+ offsetX +'px;';
	elem.className = 'cb-report';
	elem.appendChild(close);
	elem.innerHTML += '<div id="cb-report__moveme"></div>';
	elem.innerHTML += '<img src="https://ph-files.imgix.net/c0fb6382-09b4-4f92-a279-6345227cc9e1?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=48&fit=max&dpr=2" />';
	elem.innerHTML += '<h5>Reportar clickbait</h5>';
	elem.innerHTML += '<p>You can also write a spoiler to save time for the next person</p>';
	elem.innerHTML += '<textarea placeholder="Spoil here" id="cb-report__textarea"></textarea><br>';
	elem.innerHTML += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="cb-report__send">Report</button>';

	document.body.appendChild(elem);

	document.getElementById('cb-report__close').addEventListener('click', closeReport);
	document.getElementById('cb-report__send').addEventListener('click', sendReport);

	draggable(elem, document.getElementById('cb-report__moveme'));
}

function closeReport() {
	const title = document.getElementsByClassName('cb-reporting')[0];
	if (title) removeClass(title, 'cb-reporting');
	popup = document.getElementsByClassName('cb-report')[0];
	popup.remove();
}


function alertHasSpoiler(event) {
	event.preventDefault()
	var element = event.target;
	var bodyRect = document.body.getBoundingClientRect(),
		elemRect = element.getBoundingClientRect(),
		offsetY = elemRect.top - bodyRect.top,
		offsetX = elemRect.left - bodyRect.left;

	var close = document.createElement('a');
	close.innerText = 'x';
	close.className = 'cb-report__close';
	close.setAttribute('id', 'cb-report__close');

	var href = element.href || '#';
	var elem = document.createElement('div');
	elem.style.cssText = 'top:'+ (offsetY + 32) +'px; left:'+ offsetX +'px;';
	elem.className = 'cb-report';
	elem.appendChild(close);
	elem.innerHTML += '<div id="cb-report__moveme"></div>';
	elem.innerHTML += '<img src="https://ph-files.imgix.net/c0fb6382-09b4-4f92-a279-6345227cc9e1?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=48&fit=max&dpr=2" />';
	elem.innerHTML += '<h5>¿Seguro que quieres entrar?</h5>';
	elem.innerHTML += '<p>El artículo ha sido reportado como clickbait con el siguiente spoiler:</p>';
	elem.innerHTML += '<p>' + element.getAttribute('data-spoiler') + '</p>';
	elem.innerHTML += '<a href="' + href + '" class="button" id="cb-report__send">Entrar de todas formas</a>';

	document.body.appendChild(elem);

	document.getElementById('cb-report__close').addEventListener('click', closeReport);

	draggable(elem, document.getElementById('cb-report__moveme'));
}

function setClickbait(element, spoiler) {
	addClass(element, 'has-clickbait');
	element.setAttribute('data-spoiler', spoiler);
	element.addEventListener('click', alertHasSpoiler);
}

function sendReport() {
	report.spoiler = document.getElementById('cb-report__textarea').value || null;

	var miInit = {
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(report),
		mode: 'cors',
	};

	fetch(API_URL + '/test', miInit)
	// fetch(API_URL + '/report', miInit)
		.then(function(response) {
			let elem = document.querySelectorAll('a[href="' + report.url + '"]');
			for (var i = 0; i < elem.length; i++) {
				addClass(elem[i], 'has-clickbait');
			}
			report = {};
		})
		.catch(function(err) {
			console.error(err);
		});

	closeReport();
}

// Utils
function addClass(el, className) {
	if (el.classList)
	  el.classList.add(className);
	else
	  el.className += ' ' + className;
}

function removeClass(el, className) {
	if (el.classList)
	  el.classList.remove(className);
	else
	  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}


// DRAGGABLE
var initX, initY, firstX, firstY, object;

function draggable(dragMe, handler) {
	object = dragMe;
	handler.addEventListener('mousedown', function(e) {
		e.preventDefault();

		initX = object.offsetLeft;
		initY = object.offsetTop;
		firstX = e.pageX;
		firstY = e.pageY;

		this.addEventListener('mousemove', dragIt, false);

		window.addEventListener('mouseup', function() {
			handler.removeEventListener('mousemove', dragIt, false);
		}, false);
	}, false);
}

function dragIt(e) {
	object.style.left = initX+e.pageX-firstX + 'px';
	object.style.top = initY+e.pageY-firstY + 'px';
}
