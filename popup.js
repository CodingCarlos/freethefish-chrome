// 'use strict';

window.onload = function() {
    scripts();
};

document.getElementById("test").addEventListener('click', () => {
    // window.log("Popup DOM fully loaded and parsed");
    scripts();
});

function scripts() {
    // We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + domScripts + ')();' //argument here is a string but function.toString() returns function's code
    // }, (results) => {
        // Here we have just the innerHTML and not DOM structure
        // console.log(results);
    });
}

function domScripts() {
    window._cbStart();
}