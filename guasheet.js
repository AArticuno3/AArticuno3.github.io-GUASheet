const root = document.documentElement
const itemForms = [...document.querySelectorAll("[item-form]")]
const expandForms = [...document.querySelectorAll("[expand-form]")]
const wrapper = [...document.getElementsByClassName("main")][0]
const bgHolder = [...document.querySelectorAll("[data-bgHolder]")][0]
const portraitImage = [...document.querySelectorAll("[data-Portrait]")][0]

const webhookMessageURL = "https://discord.com/api/webhooks/991574971191136286/tpfpEboznsKgpCRh43BrxCbGsOjVsviEF10UEz-3yJud_so2Y2DtahZbQ6YIgOpFDp2w"
const webhookLogURL = "https://discord.com/api/webhooks/991575238204739616/pyxq1bAQXe9BBDwhPYeay99vCxH784mB5rqyCyA2xvoiUPs6kmQWjgXUnYzPGehQmyVe"

const rollCL = 3

let charName = ""

let currentHealth = 16
let maximumHealth = 16

// Creating a parallax Background--scroll-depth

wrapper.onscroll = () => {
  let scrollMax = wrapper.scrollHeight
  let scrollDistance = wrapper.scrollTop
  
  let bgScrollRatio = parseInt(100 * scrollDistance / scrollMax) / 100
  
  root.style.setProperty('--scroll-depth', bgScrollRatio )
  root.scrollTop = 0
}

// Creating Name uptading

function logName() {
  charName = document.getElementById("characterName").value

  if (charName == "") {
    charName = "Player"
  } else {
    console.log(charName)
  }
  
  if (charName == "Gamemaster" || charName == "Jim" || charName == "Kevrok" || charName == "Aloise") {
    portraitImage.classList.add("open")
    root.style.setProperty('--portrait-image', "url('images/" + charName + ".png')" )
  } else if (charName == "Essedon") {
    portraitImage.classList.add("open")
  }
  const debugMessage = "name changed to " + charName
  console.log(debugMessage)
  const webhookMessage = { "content": debugMessage }
  fetch(webhookLogURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
}

// Creating HP updating

function logHealth() {
  let currentCore = [...document.querySelectorAll("[data-Core]")][0].value

  if (currentCore == "") {
    currentCore = 4
  }

  let currentStr = [...document.querySelectorAll("[data-Str]")][0].value

  if (currentStr == "") {
    currentStr = 0
  }

  let maxHealthDisplay = [...document.querySelectorAll("[data-HP-MAX]")][0]

  if (maxHealthDisplay.value == "") {
    maximumHealth = parseInt(currentCore) * ( parseInt(currentCore) + parseInt(currentStr) )
  } else {
    maximumHealth = maxHealthDisplay.value
  }

  maxHealthDisplay.placeholder = maximumHealth
  
  let currentHealthDisplay = [...document.querySelectorAll("[data-HP]")][0]
  if (currentHealthDisplay.value == "") {
    currentHealthDisplay.placeholder = maximumHealth
    currentHealth = maximumHealth
  } else if (parseInt(currentHealthDisplay.value) > maximumHealth) {
    currentHealthDisplay.value = maximumHealth
    currentHealth = maximumHealth    
  } else if (parseInt(currentHealthDisplay.value) < 0) {
    currentHealthDisplay.value = 0
    currentHealth = 0    
  } else {
    currentHealth = currentHealthDisplay.value
  }

  let hpRatio = parseInt(10000*(currentHealth/maximumHealth)) / 100
  if (hpRatio < 100) {
    root.style.setProperty('--hp-percent', parseInt(hpRatio) + "%" );
  } else {
    root.style.setProperty('--hp-percent', "100%" );
  }
  console.log("Current HP is " + currentHealth)
  console.log("Max HP is " + maximumHealth)
  console.log("Current HP is " + hpRatio + "%")
}

// Creating real time Stats updating

function logStats() {
  let currentCore = [...document.querySelectorAll("[data-Core]")][0].value
  if (currentCore == "") {
    currentCore = 0
  }
  let currentStr = [...document.querySelectorAll("[data-Str]")][0].value
  if (currentStr == "") {
    currentStr = 0
  }
  let currentDex = [...document.querySelectorAll("[data-Dex]")][0].value
  if (currentDex == "") {
    currentDex = 0
  }
  let currentSprint = [...document.querySelectorAll("[data-Sprint]")][0].value
  if (currentSprint == "") {
    currentSprint = 0
  }
  let currentSpring = [...document.querySelectorAll("[data-Spring]")][0].value
  if (currentSpring == "") {
    currentSpring = 0
  }
  let currentStamina = [...document.querySelectorAll("[data-Stamina]")][0].value
  if (currentStamina == "") {
    currentStamina = 0
  }

  let jumpHeight  = 0.5*currentCore + 1*currentSpring + "ft"
  let fallHeight  = 2*currentCore + 5*currentStr + 2*currentSpring + "ft"
  let moveSpeed   = 2*currentCore + 5*currentDex + 2*currentSprint + "ft/AP"
  let carryWeight = 25*currentCore + 25*currentStr + 25*currentStamina + "Lb"

  document.querySelectorAll("[data-jumpHeight]")[0].innerHTML = jumpHeight
  document.querySelectorAll("[data-fallHeight]")[0].innerHTML = fallHeight
  document.querySelectorAll("[data-moveSpeed]")[0].innerHTML = moveSpeed
  document.querySelectorAll("[data-carryWeight]")[0].innerHTML = carryWeight
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

  // Creating Unfoldable magic petals

  const unfoldForm = [...document.querySelectorAll("[unfold-form]")][0]
  
  if(clickTarget.matches("[data-unfold]") || clickTarget.matches("[unfold-form]")) {
    unfoldForm.classList.add("open")
  } else {
    unfoldForm.classList.remove("open")
  }

  // Magic To Roll press => Roll in Sheet and send Roll to Discord

  resetMessage()

  if (clickTarget.parentElement.classList.contains("magicPoints") || clickTarget.parentElement.classList.contains("magicDesc")) {

    
    const floatRoll = [...document.querySelectorAll("[rollerDisplay]")][0]
    const displayRoll = [...document.getElementsByClassName("rollerDisplay")][0]

    const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
    displayMessage.classList.add("show")

    let generatedMessage = ""

    let coreDice = document.getElementById("coreBonus").value
    
    if (coreDice == "") {
      coreDice = 0
    } else if ( parseInt(currentHealth) < (parseInt(coreDice) * parseInt(coreDice)) ) {
      coreDice = parseInt(coreDice) - Math.floor(((parseInt(coreDice) * parseInt(coreDice)) - parseInt(currentHealth)) / (parseInt(coreDice)))
    }

    let magicDice = document.getElementById("magicCoreBonus").value

    if (magicDice == "") {
      magicDice = 0
    }

    let currentMagicDice = 0

    if (clickTarget.parentElement.classList.contains("magicCorePoints") || clickTarget.parentElement.parentElement.classList.contains("magicCorePoints") || clickTarget.parentElement.parentElement.parentElement.classList.contains("magicCorePoints")) {
      currentMagicDice = 0
      generatedMessage = "Magic Roll: "
    } else {
      currentMagicDice = clickTarget.parentElement.parentElement.getElementsByClassName("magicBonus")[0].children[0].value
      generatedMessage = clickTarget.parentElement.parentElement.getElementsByClassName("magicBonus")[0].children[0].id.slice(0,-5).replace(/^\w/, (c) => c.toUpperCase()) + " Magic Roll: "
    }

    if (currentMagicDice == "") {
      currentMagicDice = 0
    }

    let magicDifficulty = clickTarget.parentElement.parentElement.parentElement.parentElement.parentElement.classList[1]

    displayMessage.children[0].innerHTML = generatedMessage

    const totalDice = parseInt(coreDice) + parseInt(magicDice) + parseInt(currentMagicDice)

    const diceRoll = rollDice(totalDice, rollCL, 0)
    displayRoll.children[0].innerHTML = diceRoll
    floatRoll.children[0].innerHTML = diceRoll

    const webhookMessage = { "content": generatedMessage + "[" + diceRoll + "||/" + magicDifficulty.slice(5) + "||]" }
    if (charName == "Gamemaster" || charName == "Jim" || charName == "Kevrok" || charName == "Aloise") {
      webhookMessage.username = charName
      webhookMessage.avatar_url = avatarImageGetter(charName)
      fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    } else if (charName == "Essedon") {
      webhookMessage.username = charName
      fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    }

  }

  // Attribute Name press => Roll in Sheet and send Roll to Discord

  resetMessage()

  if (clickTarget.classList.contains("attrName") || clickTarget.parentElement.classList.contains("attrName")) {

    
    const floatRoll = [...document.querySelectorAll("[rollerDisplay]")][0]
    const displayRoll = [...document.getElementsByClassName("rollerDisplay")][0]

    const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
    displayMessage.classList.add("show")

    let generatedMessage = ""

    let coreDice = document.getElementById("coreBonus").value
    
    if (coreDice == "") {
      coreDice = 0
    } else if ( parseInt(currentHealth) < (parseInt(coreDice) * parseInt(coreDice)) ) {
      coreDice = Math.floor((parseInt(currentHealth)) / (parseInt(coreDice)))
    }

    let attrDice = 0

    if (clickTarget.classList.contains("attrName")) {
      generatedMessage = clickTarget.children[1].innerHTML
      attrDice = [...clickTarget.parentElement.getElementsByClassName("attrBonus")][0].children[0].value
    } else {
      generatedMessage = clickTarget.innerHTML
      attrDice = [...clickTarget.parentElement.parentElement.getElementsByClassName("attrBonus")][0].children[0].value
    }

    if (attrDice == "") {
      attrDice = 0
    } else if (generatedMessage == "STR") {
      console.log(attrDice)
      attrDice = parseInt(attrDice) - Math.floor( (parseInt(maximumHealth) - parseInt(currentHealth)) / (parseInt(coreDice)) )
      if (attrDice < 0) { attrDice = 0 }
    }

    displayMessage.children[0].innerHTML = generatedMessage + " Roll: "

    const totalDice = parseInt(coreDice) + parseInt(attrDice)

    const diceRoll = rollDice(totalDice, rollCL, 0)
    displayRoll.children[0].innerHTML = diceRoll
    floatRoll.children[0].innerHTML = diceRoll

    const webhookMessage = { "content": generatedMessage + " Roll: [" + diceRoll + "]" }
    if (charName == "Gamemaster" || charName == "Jim" || charName == "Kevrok" || charName == "Aloise") {
      webhookMessage.username = charName
      webhookMessage.avatar_url = avatarImageGetter(charName)
      fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    } else if (charName == "Essedon") {
      webhookMessage.username = charName
      fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    }

  }

  // Skill Name press => Roll in Sheet and send Roll to Discord

  resetMessage()
  
  if (clickTarget.classList.contains("skillName") || clickTarget.parentElement.classList.contains("skillName")) {
    
    const floatRoll = [...document.querySelectorAll("[rollerDisplay]")][0]
    const displayRoll = [...document.getElementsByClassName("rollerDisplay")][0]

    const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
    displayMessage.classList.add("show")
    const displayMastery = [...document.getElementsByClassName("masteryBounusDisplay")][0]
    const displayArmor = [...document.getElementsByClassName("armorBonusDisplay")][0]

    let generatedMessage = ""

    let coreDice = document.getElementById("coreBonus").value
    
    if (coreDice == "") {
      coreDice = 0
    } else if ( parseInt(currentHealth) < (parseInt(coreDice) * parseInt(coreDice)) ) {
      coreDice = parseInt(coreDice) - Math.floor(((parseInt(coreDice) * parseInt(coreDice)) - parseInt(currentHealth)) / (parseInt(coreDice)))
    }

    let attrDice = clickTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("attrBonus")[0].children[0].value

    if (attrDice == "") {
      attrDice = 0
    } else if (clickTarget.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("attrName")[0].children[1].value == "STR") {
      attrDice = parseInt(attrDice) - Math.floor( (parseInt(maximumHealth) - parseInt(currentHealth)) / (parseInt(coreDice)) )
      if (attrDice < 0) { attrDice = 0 }
    }

    let skillDice = clickTarget.parentElement.parentElement.parentElement.getElementsByClassName("skillBonus")[0].children[0].value

    if (skillDice == "") {
      skillDice = 0
    } 

    let skillMastery = clickTarget.parentElement.parentElement.parentElement.getElementsByClassName("skillMastery")[0].children[0].value.slice(1)

    if (skillMastery == "") {
      skillMastery = 0
    }

    let skillFlat = clickTarget.parentElement.parentElement.parentElement.getElementsByClassName("skillFlat")[0].children[0].value.slice(1)

    if (skillFlat == "") {
      skillFlat = 0
    }

    let skillBonus = parseInt(skillFlat) + parseInt(skillMastery)

    if (clickTarget.classList.contains("skillName")) {
      generatedMessage = clickTarget.children[0].innerHTML + " Roll: "
    } else {
      generatedMessage = clickTarget.innerHTML + " Roll: "
    }

    displayMessage.children[0].innerHTML = generatedMessage

    const totalDice = parseInt(coreDice) + parseInt(attrDice) + parseInt(skillDice)

    const diceRoll = rollDice(totalDice, rollCL, skillBonus)
    displayRoll.children[0].innerHTML = diceRoll
    if (skillMastery > 0) {
      displayMastery.classList.add("show")
      displayMastery.children[0].innerHTML = "+" + skillMastery
    }
    if (skillFlat > 0) {
      displayArmor.classList.add("show")
      displayArmor.children[0].innerHTML = "+" + skillFlat
    }
    if (skillBonus > 0) {
      let totalRoll = diceRoll + skillBonus
      floatRoll.children[0].innerHTML = totalRoll
    } else {
      floatRoll.children[0].innerHTML = diceRoll
    }

    const webhookMessage = { "content": generatedMessage + "[" + diceRoll + "]" }
    if (charName == "Gamemaster" || charName == "Jim" || charName == "Kevrok" || charName == "Aloise") {
      webhookMessage.username = charName
      webhookMessage.avatar_url = avatarImageGetter(charName)
      fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    } else if (charName == "Essedon") {
      webhookMessage.username = charName
      fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    }

  }

})

// Creating a button to send link directly to Discord

function sendMessage() {
  let currentMessage = [...document.querySelectorAll("[data-message]")][0]
  console.log(currentMessage.value)
  const webhookMessage = { "content": currentMessage.value }
  if (charName == "Gamemaster" || charName == "Jim" || charName == "Kevrok" || charName == "Aloise") {
    webhookMessage.username = charName
    webhookMessage.avatar_url = avatarImageGetter(charName)
    fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
  } else if (charName == "Essedon") {
    webhookMessage.username = charName
    fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
  }

  currentMessage.value = ""
}

// Creating a rolling function

function rollDice(dice,rollCL,bonus) {
  let diceRollTotal = 0
  let debugMessage = "Last Roll by " + charName + ": ["
  console.log("rolling " + dice + " dice...")

  for (let i = 0; i < dice; i++) {
    let currentRoll = parseInt(Math.random()*(6) + 1)
    
    if (currentRoll > rollCL) {
      debugMessage = debugMessage.concat("**" + currentRoll + "**")
      diceRollTotal++      
    } else {
      debugMessage = debugMessage.concat(currentRoll)
    }

    if (i != (dice - 1)) {      
      debugMessage = debugMessage.concat(",")
    }

  }
  debugMessage = debugMessage.concat("]")
  
  if (bonus !== "") {
    debugMessage = debugMessage.concat(" + " + bonus)
  }
  
  const webhookMessage = { "content": debugMessage }
  fetch(webhookLogURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)

  return diceRollTotal
}

// Message Reset on click

function resetMessage() {
  const floatRoll = [...document.querySelectorAll("[rollerDisplay]")][0]
  const displayRoll = [...document.getElementsByClassName("rollerDisplay")][0]
  displayRoll.children[0].innerHTML = "   "
  displayRoll.classList.remove("show")
  const displayArmor = [...document.getElementsByClassName("armorBonusDisplay")][0]
  displayArmor.children[0].innerHTML = "   "
  displayArmor.classList.remove("show")
  const displayShield = [...document.getElementsByClassName("shieldBonusDisplay")][0]
  displayShield.children[0].innerHTML = "   "
  displayShield.classList.remove("show")
  const displayBonus = [...document.getElementsByClassName("masteryBounusDisplay")][0]
  displayBonus.children[0].innerHTML = "   "
  displayBonus.classList.remove("show")
  const displayWeapon = [...document.getElementsByClassName("weaponBonusDisplay")][0]
  displayWeapon.children[0].innerHTML = "   "
  displayWeapon.classList.remove("show")
  const displayRacial = [...document.getElementsByClassName("racialBonusDisplay")][0]
  displayRacial.children[0].innerHTML = "   "
  displayRacial.classList.remove("show")
  const displayWeapMag = [...document.getElementsByClassName("weaponMagicDisplay")][0]
  displayWeapMag.children[0].innerHTML = "   "
  displayWeapMag.classList.remove("show")
  const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
  displayMessage.children[0].innerHTML = "   "
  displayMessage.classList.remove("show")
}

// Handling Portrait dropping into the image slot

function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        const file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);

        root.style.setProperty('--portrait-image', "url('images/" + file.name + "')" )
        portraitImage.classList.add("open")
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      // console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  }
}

function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

// Avatar image urls **gotta be here unfortunately

function avatarImageGetter(name) {
  // if (name == "Essedon") {
  //   return ""
  // }
  if (name == "Jim") {
    return "https://imgur.com/6FWdZKB.png"    
  }
  if (name == "Kevrok") {
    return "https://imgur.com/u7G3dPN.png"    
  } else {
    return "null"
  }
  // if (name == "Aloise") {
  //   return ""    
  // }
  // if (name == "") {
  //   return ""
  // }
}