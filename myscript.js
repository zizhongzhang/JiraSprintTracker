'use strict'

const origin = document.location.origin
const jiraEndpoints = {
    activeSprint: boardId =>
        `${origin}/rest/agile/1.0/board/${boardId}/sprint?state=active`,
    sprintIssue: sprintId =>
        `${origin}/rest/agile/1.0/sprint/${sprintId}/issue`,
}
const arrayNotEmpty = array => Array.isArray(array) && array.length
const displaySprintInfoByBoardId = (boardId, completeStatus, excludeStatus) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', jiraEndpoints.activeSprint(boardId), true)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var json = JSON.parse(xhr.responseText)
            const sprintId = json.values[0].id
            displaySprintInfoBySprintId(sprintId, completeStatus, excludeStatus)
        }
    }
    xhr.send()

    const displaySprintInfoBySprintId = (
        sprintId,
        completeStatus,
        excludeStatus
    ) => {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', jiraEndpoints.sprintIssue(sprintId), true)
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                let json = JSON.parse(xhr.responseText)
                const issuesToExlude = arrayNotEmpty(excludeStatus)
                    ? filter(json.issues, excludeStatus)
                    : []

                let totalPoints = json.issues
                    .filter(function(el) {
                        return issuesToExlude.indexOf(el) < 0
                    })
                    .map(x => x.fields['customfield_10004'])
                    .reduce((a, b) => a + b, 0)

                let actualPoints = filter(json.issues, completeStatus)
                    .map(x => x.fields['customfield_10004'])
                    .reduce((a, b) => a + b, 0)

                const sprintDuration = 10
                let element = document.querySelector(
                    `div[data-sprint-id='${sprintId}'] span.days-left`
                )
                const remainingDays = element.textContent.match(/^\d+/g, '')[0]

                const expectedPoints = getExpectedPoints(
                    totalPoints,
                    sprintDuration,
                    remainingDays
                )
                const pointDiff = actualPoints - expectedPoints

                const expectedPercentage = getPercentage(
                    totalPoints,
                    expectedPoints
                )
                const actualPercentage = getPercentage(
                    totalPoints,
                    actualPoints
                )
                const percentageDiff = actualPercentage - expectedPercentage

                const message = `- ${format(percentageDiff)}% (${format(
                    pointDiff
                )}pts) ${pointDiff > 0 ? 'ahead' : 'behind'}`

                if (pointDiff > 0) {
                    element.textContent += message
                    element.style.color = 'green'
                    element.style.padding = '5px'
                    element.style.fontWeight = 'bold'
                } else {
                    element.textContent += message
                    element.style.color = 'white'
                    element.style.padding = '5px'
                    element.style.fontWeight = 'bold'
                    element.style.backgroundColor = 'red'
                }
            }
        }
        xhr.send()

        const getExpectedPoints = (sprintPoints, duration, remainingDays) => {
            let pointsPerday = sprintPoints / duration
            return (duration - remainingDays) * pointsPerday
        }

        const getPercentage = (sprintPoints, points) => {
            return (points / sprintPoints) * 100
        }

        const format = value => {
            return Math.round(Math.abs(value))
        }

        const filter = (issues, statuses) => {
            let newIssues = []
            statuses.forEach(status => {
                newIssues = newIssues.concat(
                    issues.filter(
                        issue =>
                            issue.fields.status.name.toLowerCase() ===
                            status.toLowerCase()
                    )
                )
            })
            return newIssues
        }
    }
}

const href = document.location.href
const matchedValues = href.match(/rapidView=\d+/g, '')
if (matchedValues) {
    const boardId = matchedValues[0].match(/\d+/g, '')
    chrome.storage.sync.get('status', function(data) {
        const completeStatus = data.status.completeStatus
        const excludeStatus = data.status.excludeStatus

        if (arrayNotEmpty(completeStatus)) {
            displaySprintInfoByBoardId(boardId, completeStatus, excludeStatus)
        }
    })
}
