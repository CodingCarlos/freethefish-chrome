// 'use strict';
// console.log('lolazo');
var firebaseConfig = {
    apiKey: "AIzaSyAsffRJEKkStkKhKDqlErLD-Lz7iCnXRUM",
    authDomain: "freethefish-dcc6c.firebaseapp.com",
    databaseURL: "https://freethefish-dcc6c.firebaseio.com",
    projectId: "freethefish-dcc6c",
    storageBucket: "",
    messagingSenderId: "857222472154",
    appId: "1:857222472154:web:12c5a25da39f4e67"
};
var database;

window.onload = function() {
    scripts();

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
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