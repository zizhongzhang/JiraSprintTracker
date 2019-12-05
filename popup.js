// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

let input = document.getElementById('boardId')

input.onchange = function(element) {
    let value = element.target.value
    chrome.storage.sync.set({boardId: value}, function() {
      console.log(`board id is ${boardId}.`);
    });

    chrome.runtime.sendMessage({ boardId: value }, function(response) {
        console.log(response.farewell)
    })
    localStorage.setItem('boardId', value)
}
