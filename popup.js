'use strict'

const button = document.getElementById('save')
button.onclick = function() {
    const completeStatusInput = document.getElementById('completeStatus')
    const completeStatus = completeStatusInput.value.split(',')

    const excludeStatusInput = document.getElementById('excludeStatus')
    const excludeStatus = excludeStatusInput.value.split(',')

    chrome.storage.sync.set({ status: { completeStatus, excludeStatus } }, function() {
        console.log(`Successfully called back`)
    })
}