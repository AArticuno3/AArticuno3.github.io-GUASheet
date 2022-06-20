let root = document.documentElement
const itemForms = [...document.querySelectorAll("[item-form]")]
const expandForms = [...document.querySelectorAll("[expand-form]")]

// Creating real time HP updating

function logHealth() {
  let currentHealth = [...document.querySelectorAll("[data-HP]")][0].value
  let maximumHealth = [...document.querySelectorAll("[data-HP-MAX]")][0].value

  let hpRatio = (100*(currentHealth/maximumHealth))
  if (hpRatio < 100) {
    root.style.setProperty('--hp-percent', parseInt(hpRatio) + "%" );
  } else {
    root.style.setProperty('--hp-percent', "100%" );
  }
  console.log("Current HP is " + currentHealth)
  console.log("Max HP is " + maximumHealth)
  console.log("Current HP is " + hpRatio + "%")
}

// Creating the Unfoldable Skills Tabs

document.addEventListener("click", e => {
  const clickTarget = e.target
  
  if (clickTarget.matches("[data-expand]")) {
    const currentItem = clickTarget.parentElement.parentElement
    const currentForm = currentItem.parentElement
    const expandFormList = [...currentForm.parentElement.children]
 
    expandFormList.forEach(form => {
      if (form !== currentForm) {
        form.classList.remove("open")
      }
    })
    
    if (currentForm.classList.contains("open")) {
      currentForm.classList.remove("open")
    } else {
      currentForm.classList.add("open")
    }
    
  }

  const unfoldForm = [...document.querySelectorAll("[unfold-form]")][0]
  
  if(clickTarget.matches("[data-unfold]") || clickTarget.matches("[unfold-form]")) {
    unfoldForm.classList.add("open")
  } else {
    unfoldForm.classList.remove("open")
  }
})

// Creating a send link directly to Discord

const webhookURL = "https://discord.com/api/webhooks/760935288306139148/65rOm6Yns8SKFaFo7zHVTcJEV5mtmWSkAXl7UoLJ9eS8s1jaT79VFpY65HEGqMkZmqD_"

function sendMessage() {
  let currentMessage = [...document.querySelectorAll("[data-message]")][0]
  console.log(currentMessage.value)
  const webhookMessage = { "content": currentMessage.value }
  webhookMessage.username = " - "
  
  fetch(webhookURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)

  currentMessage.value = ""
}








