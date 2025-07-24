const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const score_element = document.getElementById("score");
const field_element = document.getElementById("field");
let score = 5;
let own_field = 0;
let super_gompei_count = 0;

function changeScore(amount, sqft) {
    score += amount;
    own_field += sqft;
    score_element.innerHTML = "Score: " + score;
    field_element.innerHTML = "Sqft: " + own_field;

    // Update the stores to block buying expensive boxes
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));
        let field = parseInt(store.getAttribute("field"));

        if ((score < cost) || (field * -1 > own_field)) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}
function buy(store) {
    const cost = parseInt(store.getAttribute("cost"));
    let field = parseInt(store.getAttribute("field"));

    if (score < cost || field * -1 > own_field) {
        return;
    }

    changeScore(-cost, field);

    field *= -1;

    while (field > 0) {
        field -= 5;
        for (let x = 0; x < widget_container.childNodes.length; x++) {
            console.log(widget_container.childNodes[x].getAttribute("name"))
            try {
                if (widget_container.childNodes[x].getAttribute("name") === "Lawn") {
                widget_container.childNodes[x].remove()
                break;
                }
            } catch (e) {
            console.log(e)
            }
        }
    }

    // If Super-Gompei already exists
    const superGompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
    if (store.getAttribute("name") === "Super-Gompei" && superGompei) {
        superGompei.setAttribute("reap", (parseInt(superGompei.getAttribute("reap")) + 100));
        super_gompei_count += 1;
        document.body.style = "--gompei-count: " + super_gompei_count + ";"
        return;
    }
    


    const widget = store.firstElementChild.cloneNode(true);
    widget.onclick = () => {
        harvest(widget);
    }
    console.log(store)
    widget_container.appendChild(widget);

    if (widget.getAttribute("auto") == 'true') {
        widget.setAttribute("harvesting", "");
        setup_end_harvest(widget);
    }
}

function setup_end_harvest(widget) {
    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;
    // Set harvesting flag
    widget.setAttribute("harvesting", "");

    // If manual, collect points now
    changeScore(parseInt(widget.getAttribute("reap")), parseInt(widget.getAttribute("reap2")));
    showPoint(widget);

    setup_end_harvest(widget);
}


function showPoint(widget) {
    let number = document.createElement("span");
    number.className = "point";
    number.innerHTML = "+" + widget.getAttribute("reap");
    number.onanimationend = () => {
        widget.removeChild(number);
    }
    widget.appendChild(number);
}

changeScore(0, 0);