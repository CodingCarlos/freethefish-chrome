// 'use strict';
var alertMode = document.getElementById("switch-1");
var check = document.getElementById("check");

window.onload = function() {
    chrome.storage.local.get(['alertMode'], function (data) {
    	if (data.alertMode === false) {
    		check.MaterialSwitch.off();
    	} else {
    		check.MaterialSwitch.on();
    	}

    	scripts();
    });
};

// scripts();

document.getElementById("test").addEventListener('click', () => {
    // window.log("Popup DOM fully loaded and parsed");
    scripts();
});

alertMode.addEventListener('change', () => {
	chrome.storage.local.set({ alertMode: alertMode.checked });
	console.log(alertMode.checked);
})

function scripts() {
    let alert = alertMode.checked;

    // We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + domScripts + ')(' + alert + ');' //argument here is a string but function.toString() returns function's code
    }, () => {
        connect() //this is where I call my function to establish a connection     
    });
}

function domScripts(alert) {
    window._cbStart(alert);
}

function connect() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const port = chrome.tabs.connect(tabs[0].id);
        
        // Post message
        port.postMessage({ function: 'html' });
        
        // On Message
        port.onMessage.addListener((response) => {
            console.log('%%%%%%%%%%');
            console.log('%%%%%%%%%%');
            console.log(response);
            console.log('%%%%%%%%%%');
            console.log('%%%%%%%%%%');
        });
    });

    // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //     if (request.method == "getLocalStorage") {
    //         chrome.storage.local.get([request.key], function (data) {
    //             sendResponse({data: data});
    //         });
    //     } else {
    //         sendResponse({}); // snub them.
    //     }
    // });
}

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.method == "getLocalStorage") {
//         chrome.storage.local.get([request.key], function (data) {
//             sendResponse({data: data});
//         });
//     } else {
//         sendResponse({}); // snub them.
//     }
// });
