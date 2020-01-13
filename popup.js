// 'use strict';
var reportMode = document.getElementById("switch-report");
var report = document.getElementById("report");

var alertMode = document.getElementById("switch-1");
var check = document.getElementById("check");

window.onload = function() {
    chrome.storage.local.get(['alertMode', 'reportMode'], function (data) {
    	if (data.alertMode === false) {
    		check.MaterialSwitch.off();
    	} else {
    		check.MaterialSwitch.on();
    	}

        if (data.reportMode === false) {
            report.MaterialSwitch.off();
        } else {
            report.MaterialSwitch.on();
        }

    	scripts();
    });
};

// scripts();

// document.getElementById("test").addEventListener('click', () => {
//     // window.log("Popup DOM fully loaded and parsed");
//     scripts();
// });

reportMode.addEventListener('change', () => {
    chrome.storage.local.set({ reportMode: reportMode.checked });

    if (reportMode.checked === false) {
        send('stopReporting');
    } else {
        send('startReporting');
    }
});

alertMode.addEventListener('change', () => {
	chrome.storage.local.set({ alertMode: alertMode.checked });
	console.log(alertMode.checked);
});

function scripts() {
    connect();
    // let alert = alertMode.checked;

    // // We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    // chrome.tabs.executeScript({
    //     code: '(' + domScripts + ')(' + alert + ');' //argument here is a string but function.toString() returns function's code
    // }, () => {
    //     connect() //this is where I call my function to establish a connection     
    // });
}

// function domScripts(alert) {
//     window._cbStart(alert);
// }

function activateReporting() {
    window._cbStartReporting();
}

function deactivateReporting() {
    window._cbStopReporting();
}

function connect() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const port = chrome.tabs.connect(tabs[0].id);
        
        // Post message
        // port.postMessage({ function: 'html' });
        
        // On Message
        port.onMessage.addListener((response) => {
            if (response === 'stopReporting') {
                console.log('STOP REPORTING')
                chrome.storage.local.set({ reportMode: false });
            } else {
                console.log('%%%%%%%%%%');
                console.log('Unknown message gotten:');
                console.log(response);
                console.log('%%%%%%%%%%');
            }
        });
    });
}

function send(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const port = chrome.tabs.connect(tabs[0].id);
        
        // Post message
        port.postMessage({ function: message });
    });
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
