/// <reference types="chrome"/>

// Check whether new version is installed
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
    if (details.reason === 'install') {
        console.log('This is a first install!');
    } else if (details.reason === 'update') {
        const thisVersion: string = chrome.runtime.getManifest().version;
        console.log(`Updated from ${details.previousVersion} to ${thisVersion}`);
    }
});
