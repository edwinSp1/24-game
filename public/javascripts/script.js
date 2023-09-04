var switchButton = document.getElementById("switch")
function getEl(id) {
  return document.getElementById(id)
}
var states = ["possible", "impossible"]
var i = 0
function showTable() {
  if(i === 0) {
    getEl(states[i]).style.display = "none"
    getEl(states[i+1]).style.display = "table"
    switchButton.innerHTML = `show ${states[i]}`
    i = 1
  } else {
    getEl(states[i]).style.display = "none"
    getEl(states[i-1]).style.display = "table"
    switchButton.innerHTML = `show ${states[i]}`
    i = 0
  }
}
switchButton.addEventListener("click", showTable)