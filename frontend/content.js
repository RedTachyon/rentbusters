"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const statuses = [
    { className: "bustable", text: "Bustable?", color: "green", fontColor: "white" },
    { className: "not-bustable", text: "Not bustable?", color: "red", fontColor: "white" },
    { className: "maybe-bustable", text: "Maybe bustable?", color: "yellow", fontColor: "black" },
    { className: "unclear", text: "Unclear", color: "lightgray", fontColor: "black" },
    { className: "na", text: "No information", color: "darkgray", fontColor: "white" },
    { className: "waiting", text: "Waiting", color: "lightblue", fontColor: "black" }
];
// Function to define our styles once
function defineStyles() {
    const styleElement = document.createElement('style');
    statuses.forEach(status => {
        const styleRule = `
            .${status.className}::after {
                content: '${status.text}';
                background-color: ${status.color};
                border-radius: 50px; /* Large value to ensure ends are semi-circles */
                padding: 5px 15px;   /* Space around the text */
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                color: ${status.fontColor};
            }
        `;
        styleElement.innerHTML += styleRule;
    });
    document.head.appendChild(styleElement);
}
function getStatusClassName(apiResult) {
    switch (apiResult) {
        case "bustable": return "bustable";
        case "not bustable": return "not-bustable";
        case "maybe": return "maybe-bustable";
        case "unclear": return "unclear";
        case "N/A": return "na";
        default: return "na"; // Handle any other cases, though ideally there shouldn't be any
    }
}
function modifyFundaWebsite() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!document.head.querySelector('style[data-style="custom-statuses"]')) {
            defineStyles();
        }
        const divs = Array.from(document.querySelectorAll('div[data-test-id="search-result-item"]'));
        // Set the initial status to "waiting"
        divs.forEach((div) => {
            if (div instanceof HTMLElement) {
                div.classList.add('waiting');
                div.style.position = 'relative';
            }
        });
        // Extract the links from the divs
        const links = divs.map(div => {
            const anchor = div.querySelector('a[href]');
            return anchor ? anchor.getAttribute('href') : null;
        }).filter(Boolean);
        if (links.length === 0) {
            console.error('No links found.');
            return;
        }
        try {
            // Fetch data from the API
            const response = yield fetch('https://rentbusters-1-l0052534.deta.app/lookup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(links)
            });
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }
            const apiResults = yield response.json();
            console.log('API results:', apiResults);
            // Update the divs based on the API response
            divs.forEach((div, index) => {
                if (div instanceof HTMLElement) {
                    // Remove the "waiting" class
                    div.classList.remove('waiting');
                    const statusClassName = getStatusClassName(apiResults["results"][index]);
                    div.classList.add(statusClassName);
                }
            });
        }
        catch (error) {
            console.error('Error fetching data from API:', error);
        }
    });
}
function observeForPageChanges() {
    const targetNode = document.querySelector('.pt-4'); // Navigation bar
    if (!targetNode) {
        console.log("Pagination element not found. Unable to observe for changes.");
        return;
    }
    const observerOptions = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            // Check for added nodes or removed nodes
            if (mutation.type === 'childList') {
                modifyFundaWebsite();
                break; // We only need to detect one change to call the function
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);
}
modifyFundaWebsite();
// Start observing
observeForPageChanges();
