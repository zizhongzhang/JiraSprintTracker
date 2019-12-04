// Checking page title
// if (document.title.indexOf("Google") != -1) {
    //Creating Elements
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://{jira_domain}/rest/agile/1.0/board/{boardId}/sprint?state=active", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            localStorage.setItem("test", resp);
        }
    }
    xhr.send();
    
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    //Appending to DOM 
    document.body.appendChild(btn);
// }