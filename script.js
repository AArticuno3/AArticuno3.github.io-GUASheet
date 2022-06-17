let root = document.documentElement
const itemForms = [...document.querySelectorAll("[item-form]")]
const expandForms = [...document.querySelectorAll("[expand-form]")]

// Creating real time HP updating

function logHealth() {
  let currentCore = document.querySelectorAll("[data-Core]").value
  let currentStr = document.querySelectorAll("[data-Str]").value
  let currentHealth = [...document.querySelectorAll("[data-HP]")][0].value
  let maximumHealth = document.getElementById("HP_MAX").innerHTML

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
})


itemForms[0].addEventListener("click", e => {
    const clickTarget = e.target
  
  if (clickTarget.matches("[item-add]")) {
    let thisStep = clickTarget
    thisStep.classList.toggle("closed")
    addListItem(thisStep)
    thisStep.nextElementSibling.classList.add("active")
    thisStep.parentElement.parentElement.lastChild.firstElementChild.classList.toggle("closed")
  }
  
  if (clickTarget.matches("[item-del]")) {
    let thisStep = clickTarget.parentElement.parentElement
    delListItem(thisStep)
  }
  
})

itemForms[1].addEventListener("click", e => {
    const clickTarget = e.target
  
  if (clickTarget.matches("[item-add]")) {
    let thisStep = clickTarget
    thisStep.classList.toggle("closed")
    addListItem(thisStep)
    thisStep.nextElementSibling.classList.add("active")
    thisStep.parentElement.parentElement.lastChild.firstElementChild.classList.toggle("closed")
  }
  
  if (clickTarget.matches("[item-del]")) {
    let thisStep = clickTarget.parentElement
    delListItem(thisStep)
  }
  
})

function addListItem(itemStep) {
  const thisWeaponContent = itemStep.parentElement.innerHTML
  const newItem = document.createElement("li")
  newItem.innerHTML = thisWeaponContent
  itemStep.parentElement.parentElement.appendChild(newItem)
}

async function delListItem(itemStep) {
  itemStep.classList.toggle("disabled")
  itemStep.parentElement.classList.toggle("disabled")
  await new Promise(resolve => setTimeout(resolve, 1000));
  itemStep.parentElement.remove()
}

document.addEventListener("click", e => {
  const clickTarget = e.target
  if (clickTarget.matches("[data-expand]")) {
    const currentItem = clickTarget.parentElement.parentElement.parentElement
    const currentForm = currentItem.parentElement
    const expandFormList = [...currentForm.parentElement.children]
    
    currentItem.classList.add("open")
    
    expandFormList.forEach(form => {
      if (form !== currentForm) {
        form.classList.remove("expand")
        form.classList.remove("contract")
        if (currentForm.classList.contains("expand") || currentForm.classList.contains("contract")) {
        } else {
          form.classList.add("contract")
        }
      }
    })
    
    if (currentForm.classList.contains("expand")) {
      currentForm.classList.remove("expand")      
    } else if (currentForm.classList.contains("contract")) {
      currentForm.classList.remove("contract")      
    } else {
      currentForm.classList.add("expand")
    }
    
  }
  
  if (clickTarget.matches(".skillBox")) {
    const thisForm = [...clickTarget.parentElement.children]
    thisForm.forEach(step => {
      if (step == clickTarget) {
        if (clickTarget.classList.contains("open")) {
          clickTarget.classList.remove("open")
          thisForm[0].classList.add("open")
        } else {
          clickTarget.classList.add("open")          
        }
      } else {
        step.classList.remove("open")
      }      
    })
  }
})