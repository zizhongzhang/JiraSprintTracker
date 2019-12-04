if (
    document.location.href.indexOf(
        'https://{jira_domain}/secure/RapidBoard.jspa?rapidView=2206'
    ) != -1
) {
    var xhr = new XMLHttpRequest()
    xhr.open(
        'GET',
        'https://{jira_domain}/rest/agile/1.0/board/{boardId}/sprint?state=active',
        true
    )
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            var resp = JSON.parse(xhr.responseText)
            console.log(resp)
            localStorage.setItem('test', resp)
        }
    }
    xhr.send()

    xhr.open(
        'GET',
        'https://{jira_domain}/rest/agile/1.0/sprint/{sprintId}/issue',
        true
    )
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            let json = JSON.parse(xhr.responseText)
            let points = json.issues
                .filter(x => x.fields.status.name == 'Ready for Live')
                .map(x => x.fields['customfield_10004'])
                .reduce((a, b) => a + b, 0)
            console.log(points)
        }
    }
    xhr.send()

    let element = document.querySelector(
        "div[data-sprint-id='10323'] span.days-left"
    )
    element.textContent += ' - 10% (4pts) behind'
}
