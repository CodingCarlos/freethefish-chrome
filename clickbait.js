const titleSelectors = 'article';
const API_URL = 'https://us-central1-free-the-fish.cloudfunctions.net';

let report = {};

window._cbStart = selectClickbaits
// selectClickbaits();

window.log = console.log;

function selectClickbaits() {
    //You can play with your DOM here or check URL against your regex
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
	console.log(event);
	console.log(event.path);
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
	elem.innerHTML += '<img src="https://ph-files.imgix.net/c0fb6382-09b4-4f92-a279-6345227cc9e1?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=48&fit=max&dpr=2" />';
	elem.innerHTML += '<h5>Reportar clickbait</h5>';
	elem.innerHTML += '<p>También puedes añadir el spoiler, si quieres</p>';
	elem.innerHTML += '<textarea placeholder="Escribe aquí el spoiler" id="cb-report__textarea"></textarea><br>';
	elem.innerHTML += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="cb-report__send">Reportar</button>';
	
	document.body.appendChild(elem);

	document.getElementById('cb-report__close').addEventListener('click', closeReport);
	document.getElementById('cb-report__send').addEventListener('click', sendReport);
}

function closeReport() {
	const title = document.getElementsByClassName('cb-reporting')[0];
	removeClass(title, 'cb-reporting');
	popup = document.getElementsByClassName('cb-report')[0];
	popup.remove();
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

	fetch(API_URL + '/report', miInit)
		.then(function(response) {
			console.log(response);
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
