'use strict'

const input = document.getElementById('sprintLink')

input.onchange = function(element) {
    const link = element.target.value
    const boardId = link.match(/\d+/g, '')[0]
    chrome.storage.sync.set({ sprint: { boardId, link } }, function() {
        console.log(`board id is ${boardId}.`)
    })
}
