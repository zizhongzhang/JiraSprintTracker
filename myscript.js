if (
    document.location.href.indexOf(
        'https://{jira_domain}/secure/RapidBoard.jspa?rapidView=2206'
    ) != -1
) {

    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        console.log(response.farewell);
      });
      
    var xhr = new XMLHttpRequest()
    xhr.open(
        'GET',
        'https://{jira_domain}/rest/agile/1.0/board/2206/sprint?state=active',
        true
    )
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText)
            console.log(resp)
            localStorage.setItem('test', resp)
        }
    }
    xhr.send()

    xhr.open(
        'GET',
        'https://{jira_domain}/rest/agile/1.0/sprint/10323/issue',
        true
    )
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            let json = JSON.parse(xhr.responseText)
            let totalPoints = json.issues
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
                "div[data-sprint-id='10323'] span.days-left"
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
            const actualPercentage = getPercentage(totalPoints, actualPoints)
            const percentageDiff = actualPercentage - expectedPercentage

            const message = `- ${Math.abs(percentageDiff)}% (${Math.abs(
                pointDiff
            )}pts) ${pointDiff > 0 ? 'ahead' : 'behind'}`
            
            element.textContent += message
        }
    }
    xhr.send()
}

const getExpectedPoints = (sprintPoints, duration, remainingDays) => {
    let pointsPerday = sprintPoints / duration
    return (duration - remainingDays) * pointsPerday
}

const getPercentage = (sprintPoints, points) => {
    return (points / sprintPoints) * 100
}
