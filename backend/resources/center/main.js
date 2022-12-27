//@ts-check

(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { guides: [] };

    /** @type {Array<{ extensionId: string, id: string, title: string, description: string, disabled?: boolean }>} */
    let guides = oldState.guides;
    updateGuideList(guides);

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'refreshData':
                {
                    guides = message.data.items;
                    updateGuideList(guides);
                    break;
                }
        }
    });

    /**
     * @param {Array<{ extensionId: string, id: string, title: string, description: string, disabled?: boolean }>} guides
     */
    function updateGuideList(guides) {
        const ul = document.querySelector('.guide-list');
        const oParent = ul?.parentElement;
        ul.textContent = '';
        if (!guides) return;
        for (const guide of guides) {
            const li = document.createElement('li');
            li.className = 'guide-item';
            if (guide.disabled === true) {
                li.ariaDisabled = "true";
                li.classList.add("disabled");
            }
            const oHeader = document.createElement('div');
            oHeader.className = 'guide-header';
            const label = document.createElement('label');
            label.className = 'guide-title';
            label.title = guide.title;
            label.textContent = guide.title;
            oHeader.appendChild(label);

            const oDetail = document.createElement('div');
            oDetail.className = 'guide-detail';
            const textNode=document.createTextNode(guide.description);
            oDetail.appendChild(textNode);

            const oWrapper = document.createElement('div');
            oWrapper.appendChild(oHeader);
            oWrapper.appendChild(oDetail);
            li.appendChild(oWrapper);

            li.addEventListener('click', () => {
                if(li.classList.contains("selected")) {
                    li.classList.add("focused");
                } else {
                    for (const item of ul?.children) {
                        item.classList.remove("selected", "focused");
                    }
                    li.classList.add("selected", "focused");
                }
                onGuideClicked(guide);
            });
            oParent?.addEventListener("focusout", () => {
                for (const item of ul?.children) {
                    item.classList.remove("focused");
                }
            });

            ul.appendChild(li);
        }

        // Update the saved state
        vscode.setState({ guides: guides });
    }

    /** 
     * @param {any} guide 
     */
    function onGuideClicked(guide) {
        vscode.postMessage({ type: 'guideSelected', value: {renderType: guide.type?guide.type:"collection", extensionId: guide.extensionId, id: guide.id, title: guide.title, description: guide.description} });
    }
}());
