chrome.storage.sync.get('sprint', function(data) {
    console.log(data)
    const boardId = data.sprint.boardId
    if (boardId && document.location.href.indexOf(data.sprint.link) != -1)
        displaySprintInfoByBoardId(boardId)
})

const origin = document.location.origin
const jiraEndpoints = {
    activeSprint: boardId =>
        `${origin}/rest/agile/1.0/board/${boardId}/sprint?state=active`,
    sprintIssue: sprintId =>
        `${origin}/rest/agile/1.0/sprint/${sprintId}/issue`,
}

const displaySprintInfoByBoardId = boardId => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', jiraEndpoints.activeSprint(boardId), true)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var json = JSON.parse(xhr.responseText)
            const sprintId = json.values[0].id
            displaySprintInfoBySprintId(sprintId)
        }
    }
    xhr.send()

    const displaySprintInfoBySprintId = sprintId => {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', jiraEndpoints.sprintIssue(sprintId), true)
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                let json = JSON.parse(xhr.responseText)
                let totalPoints = json.issues
                    .filter(x => x.fields.status.name != 'Cancelled')
                    .map(x => x.fields['customfield_10004'])
                    .reduce((a, b) => a + b, 0)

                let actualPoints = json.issues
                    .filter(
                        x =>
                            x.fields.status.name == 'Ready for Live' ||
                            x.fields.status.name == 'Done'
                    )
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

                element.textContent += message
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
    }
}
