// ==UserScript==
// @name         Delta
// @namespace    http://tampermonkey.net/
// @version      0.8
// @icon         https://i.ibb.co/kh36nB5/delta.png
// @description  Delta client for Vanis.io
// @author       Fohz
// @match        https://vanis.io/*
// @grant        none
// @license      Copyright (c) 2023 Pheed Studio. All rights reserved. Unauthorized copying, distribution, modification, public display, or public performance of this copyrighted work is an infringement of the copyright holder's rights and will be subject to legal action.
// ==/UserScript==

function showLoader() {
    const overlay = createOverlay();
    const deltaText = createDeltaText();

    function createOverlay() {
        const overlay = document.createElement('div');

        overlay.classList.add('loadingDelta');

        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            zIndex: '9999',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });

        document.body.appendChild(overlay);

        return overlay;
    }

    function createDeltaText() {
        const deltaText = document.createElement('h2');

        Object.assign(deltaText.style, {
            fontSize: '60px',
            background: 'linear-gradient(45deg, #5718c2, #8036ff, #aa78ff, #cbadff, #aa78ff, #8036ff, #5718c2)',
            backgroundSize: '200% auto',
            animation: 'slide 2s infinite',
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
        });

        deltaText.innerHTML = 'Delta';

        return deltaText;
    }

    function addAnimationStyle() {
        const animationStyle = document.createElement('style');

        animationStyle.textContent = `
        @keyframes slide {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }
        `;

        document.head.appendChild(animationStyle);
    }

    overlay.appendChild(deltaText);

    addAnimationStyle();
}

function initDual() {
    (async a => {
        async function b() {
            for (let b of ["vendor.js", "main.js"])
                await fetch(`${a}/js/${b}`).then(a => a.text()).then(b => {
                    let a = document.createElement("script");
                    a.type = "text/javascript";
                    a.textContent = b;
                    document.head.appendChild(a);
                })
        }
        document.open();
        await fetch(`${a}/index.html`).then(a => a.text()).then(a => document.write(a));
        document.close();
        b();
    })
    ("https://raw.githubusercontent.com/Fohz67/Delta-Client-Content/main/multibox/")
}

function initSingle() {
    showLoader();

    fetch('https://raw.githubusercontent.com/Fohz67/Delta-Client-Content/main/script.js')
        .then(response => response.text())
        .then(code => {
            const script = document.createElement('script');
            script.textContent = code;
            (document.head || document.documentElement).appendChild(script);
            script.remove();
        });
}

if (location.host === 'vanis.io' && location.href !== 'https://vanis.io/delta-dual') {
    initSingle();
} else {
    initDual();
}