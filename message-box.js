export function Message(type, img, message) {
    let box = document.createElement("div");
    let text = document.createElement("p");
        text.innerText = message;
        box.appendChild(text);
    let line = document.createElement("hr");
        box.appendChild(line);
    let icon = document.createElement("span");
        icon.innerText = img;
        box.appendChild(icon);
    let closeBTN = document.createElement("button");
        closeBTN.innerHTML = '<span style="'+ 'color: black; font-size: 40px;"' +' class="material-symbols-outlined">close</span>';
        box.appendChild(closeBTN);

    box.classList.add("message-box");
    icon.classList.add("material-symbols-outlined");
    closeBTN.classList.add("closeBTN");

    closeBTN.addEventListener('click', function() {
        box.remove();
    });

    box.style.cssText = `
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;

        height: 300px;
        width: 700px;

        background-color: #222222;
        border: 10px solid lime;
        border-radius: 13px;

        display: flex;
        flex-direction: row;
    `;
    icon.style.cssText = `
        height: 100%;
        width: 300px;

        font-size: 150px;
        color: lime;

        display: flex;
        justify-content: center;
        align-items: center;

        order: 0;
    `;
    line.style.cssText = `
        opacity: 0.1;
        order: 1;
    `;
    text.style.cssText = `
        width: 400px;
        padding: 20px;
        order: 2;

        text-align: center;
        font-size: 25px;
        font-family: Rubik;
        font-weight: bold;
        color: lime;

        display: flex;
        justify-content: center;
        align-items: center;
    `;
    closeBTN.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;

        height: 50px;
        width: 50px;

        border-width: 0 0 10px 10px;
        border-color: lime;
        border-style: solid;
        border-radius:  0 0 0 10px;

        background: lime;
    `;

    if (type == 2) {
        box.style.borderColor = "red";
        icon.style.color = "red";
        text.style.color = "red";
        closeBTN.style.backgroundColor = "red";
        closeBTN.style.borderColor = "red";
    };

    

    document.body.appendChild(box);
};

// Message(2, "info", "lorem ipsum");
