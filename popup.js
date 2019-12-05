'use strict'

const trim = values => values.map((x) => x.trim())

const button = document.getElementById('save')
button.onclick = function() {
    const completeStatusInput = document.getElementById('completeStatus')
    const completeStatus = trim(completeStatusInput.value.split(','))

    const excludeStatusInput = document.getElementById('excludeStatus')
    const excludeStatus = trim(excludeStatusInput.value.split(','))
    
    chrome.storage.sync.set(
        { status: { completeStatus, excludeStatus } },
        function() {
            console.log(`Successfully called back`)
        }
    )
}
