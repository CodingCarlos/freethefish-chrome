const version = 4;
console.log('Clicbait prevention enabled. v'+ version);

window._cbStart = selectClickbaits

function selectClickbaits() {
    //You can play with your DOM here or check URL against your regex
    var titles = document.querySelectorAll('h3')

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

	var titles = document.querySelectorAll('h3');
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
	elem.innerHTML += '<h5>Reportar clickbait</h5>';
	elem.innerHTML += '<p>También puedes añadir un spoiler</p>';
	elem.innerHTML += '<textarea placeholder="(opcional) Añade un spoiler"></textarea><br>';
	elem.innerHTML += '<button>REPORT!</button>';
	
	document.body.appendChild(elem);

	document.getElementById('cb-report__close').addEventListener('click', closeReport);
}

function closeReport() {
	const title = document.getElementsByClassName('cb-reporting')[0];
	removeClass(title, 'cb-reporting');
	popup = document.getElementsByClassName('cb-report')[0];
	popup.remove();
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
