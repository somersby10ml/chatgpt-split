// ==UserScript==
// @name         Chatgpt Split
// @version      0.1
// @description  Chatgpt Split
// @author       somersby10ml
// @match        https://chat.openai.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @run-at       document-end
// @grant        none
// ==/UserScript==


(async () => {
  'use strict';
  const options = {
    split: true,
    fullText: true,
  }


  const LIB_SPLIT_URL = 'https://unpkg.com/split.js/dist/split.min.js';
  // https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min.js

  const loadScript = async (scriptUrl) => {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = () => resolve();
      scriptElement.onerror = () => reject();
      document.head.appendChild(scriptElement);
    });
  };

  const loadStyleCode = (cssCode) => {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssCode;
    document.head.appendChild(styleElement);
  }

  const findSplitElement = () => {
    const xpathExpression = '//*[@id="__next"]/div[1]/div';
    const result = document.evaluate(
      xpathExpression,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    const foundElements = [];
    for (let i = 0; i < result.snapshotLength; i++) {
      const element = result.snapshotItem(i);
      foundElements.push(element);
    }
    return foundElements;
  }


  if (options.fullText) {
    // flex flex-col h-full text-sm dark:bg-gray-800
    const fullText = () => {
      const targets = document.getElementsByClassName('flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto');
      const classesToRemove = ['md:gap-6', 'md:max-w-2xl', 'lg:max-w-[38rem]', 'xl:max-w-3xl', 'md:py-6', 'lg:px-0'];
      for (let i=targets.length-1; i>=0; i--) {
        const target = targets[i];
        for (const className of classesToRemove) {
          target.classList.remove(className);
        }
      }
    }
    setInterval(() => {
      fullText();
    }, 2000)
    fullText();
  }

  if (options.split) {
    const splitStyleCode = `
      .split {
        display: flex;
        flex-direction: row;
      }

      .gutter {
        background-color: #eee;
        background-repeat: no-repeat;
        background-position: 50%;
      }

      .gutter.gutter-horizontal {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
        cursor: col-resize;
      }
    `;
    loadStyleCode(splitStyleCode);
    await loadScript(LIB_SPLIT_URL);
    setTimeout(() => {
      const elements = findSplitElement(); // wait for the element to be rendered
      elements[0].childNodes[0].style.width = '100%';
      Split([elements[0], elements[1]], {
        sizes: [10, 75],
      })
    }, 3000);
  }
})();
