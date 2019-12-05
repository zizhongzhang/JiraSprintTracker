'use strict'
const completeStatusInput = document.getElementById('completeStatus')
const excludeStatusInput = document.getElementById('excludeStatus')
const button = document.getElementById('save')
const body = document.getElementById('body')

body.onload = () => {
    chrome.storage.sync.get('status', function(data) {
        const completeStatus = data.status.completeStatus
        const excludeStatus = data.status.excludeStatus
        completeStatusInput.value = completeStatus.join() 
        excludeStatusInput.value = excludeStatus.join()
    })
}

const trim = values => values.map(x => x.trim())
button.onclick = () => {
    const completeStatus = trim(completeStatusInput.value.split(','))
    const excludeStatus = trim(excludeStatusInput.value.split(','))

    chrome.storage.sync.set(
        { status: { completeStatus, excludeStatus } },
        function() {
            console.log(`Successfully called back`)
        }
    )
}
