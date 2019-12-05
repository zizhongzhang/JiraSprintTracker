// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ color: '#3aa757' }, function() {
        console.log('The color is green.')
    })
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: 'jira.teamxero.com' },
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ])
    })
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(
        sender.tab
            ? '----------------------------------------------from a content script:----------------------------------------------' +
                  sender.tab.url
            : '----------------------------------------------from a extension:----------------------------------------------'
    )
    if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' })
    if (request.boardId){
      console.log(request.boardId);
      sendResponse({ farewell: 'goodbye!!!!' })
    } 
})

 // send message to content script
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {boardId: 666}, function(response) {
    //console.log(response.farewell);
  });
});
