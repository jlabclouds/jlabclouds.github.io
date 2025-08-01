import hljs from 'static/scripts/highlight-11.10.0.min.js'

export function initializeAssistantChat(options) {
    const container = document.getElementById(options.containerId);

    if (container.assistantChat) {
        console.log("Assistant chat already created.");
        return;
    }

    const assistantChat = new AssistantChat(options);
    container.assistantChat = assistantChat;

    assistantChat.initializeExistingMessages();
    assistantChat.attachTextareaKeyDownEvent();
}

export function initializeCurrentMessage(options) {
    const container = document.getElementById(options.containerId);
    const assistantChat = container.assistantChat;

    if (!assistantChat) {
        console.log("Assistant chat not initialized.");
        return;
    }

    assistantChat.initializeCurrentMessage(options.chatMessageId);
}

export function completeCurrentMessage(options) {
    const container = document.getElementById(options.containerId);
    const assistantChat = container.assistantChat;

    if (!assistantChat) {
        console.log("Assistant chat not initialized.");
        return;
    }

    assistantChat.completeCurrentMessage(options.chatMessageId);
}

export function scrollToBottomChatAssistant(options) {
    const container = document.getElementById(options.containerId);
    const assistantChat = container.assistantChat;

    if (!assistantChat) {
        console.log("Assistant chat not initialized.");
        return;
    }

    assistantChat.scrollToBottom();
}

class AssistantChat {
    constructor(options) {
        this.chatAssistantContainer = document.getElementById(options.containerId);
        this.scrollBottomButton = document.getElementById(options.scrollBottomButtonId);
        this.form = document.getElementById(options.formId);
        this.textarea = document.getElementById(options.textareaId);
        this.messageCount = 0;

        this.chatAssistantContainer.addEventListener("scroll", () => {
            this.updateScrollTimeout();
            this.checkScrollPosition();
        });

        // Watch for both the chat area resizing and its content changing.
        var resizeObserver = new ResizeObserver(() => {
            this.checkScrollPosition();
        });
        resizeObserver.observe(this.chatAssistantContainer);
        var mutationObserver = new MutationObserver((r) => {
            this.checkScrollPosition();
        });
        mutationObserver.observe(this.chatAssistantContainer, { childList: true, subtree: true, characterData: true });

        this.scrollBottomButton.addEventListener("click", () => this.scrollToBottom());
    }

    scrollToBottom() {
        this.scrollBottomButton.style.display = 'none';
        this.chatAssistantContainer.scrollTop = this.chatAssistantContainer.scrollHeight;

        // Because the scroll behavior is smooth, the element isn't immediately scrolled to the bottom.
        // Detect when the element is scrolling and don't raise events until it is finished.
        this.scrollingToBottom = true;
        this.updateScrollTimeout();
    }

    updateScrollTimeout() {
        if (this.scrollTimeout) {
            // Cancel previous timer.
            clearTimeout(this.scrollTimeout);
        }

        // Set a new timer. The element has finished scrolling when the timer passes.
        this.scrollTimeout = setTimeout(() => {
            this.scrollingToBottom = false;
            this.checkScrollPosition();
        }, 150);
    }

    checkScrollPosition() {
        if (this.scrollingToBottom) {
            return;
        }

        var scrollableDiv = this.chatAssistantContainer;

        const isScrollable = scrollableDiv.scrollHeight > scrollableDiv.clientHeight;
        const isAtBottom = scrollableDiv.scrollTop + scrollableDiv.clientHeight >= scrollableDiv.scrollHeight - 10;

        // The scroll to bottom button is displayed if:
        // - There is a scroll bar
        // - We're not scrolled to the bottom
        // - There are messages (i.e. we're not on the splash view)
        if (isScrollable && !isAtBottom && this.messageCount > 0) {
            this.scrollBottomButton.style.display = '';
        } else {
            this.scrollBottomButton.style.display = 'none';
        }
    }

    initializeExistingMessages() {
        // Highlight code blocks in existing messages.
        var chatMessageElements = this.chatAssistantContainer.getElementsByClassName("assistant-message");

        var chatMessageElement = null;
        for (var i = 0; i < chatMessageElements.length; i++) {
            chatMessageElement = chatMessageElements[i];
            this.highlightCodeBlocks(chatMessageElement);
            this.messageCount++;
        }

        this.reactToNextStepsSize(chatMessageElement);
    }

    initializeCurrentMessage(chatMessageId) {
        // New message has started. Stop observing the old message.
        if (this.observer) {
            this.observer.disconnect();
        }

        this.messageCount++;

        // Follow up messages have been hidden so reset scroll to bottom button.
        this.scrollBottomButton.style.display = 'none';
        this.scrollBottomButton.style.setProperty("--next-steps-height", `0px`);

        const chatMessageElement = document.getElementById(chatMessageId);
        if (!chatMessageElement) {
            console.log(`Couldn't find ${chatMessageId}.`);
            return;
        }

        // Watch chat message for changes and highlight code blocks.
        // We're doing this in the client rather than via a Blazor invoke to avoid delay between HTML changing
        // and the code blocks being highlighted.
        this.observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === "childList" || mutation.type === "characterData") {
                    this.highlightCodeBlocks(mutation.target);
                }
            }
        });

        const config = { childList: true, subtree: true, characterData: true };
        this.observer.observe(chatMessageElement, config);
    }

    completeCurrentMessage(chatMessageId) {
        var chatMessage = document.getElementById(chatMessageId);

        // Run client logic when the assistant message is finished returning...
        if (chatMessage.classList.contains("assistant-message")) {
            // Focus the text area for entering the next message.
            this.textarea.focus();

            this.reactToNextStepsSize(chatMessage);
        }
    }

    reactToNextStepsSize(lastChatMessage) {
        // Get the height of the next steps area and subtract from the min height of the previous message.
        // This prevents the next steps being added to the UI from pushing the previous message up.
        var nextSteps = document.getElementsByClassName("chat-assistant-next-steps")[0];
        if (nextSteps) {
            if (lastChatMessage && lastChatMessage.classList.contains("last-message")) {
                lastChatMessage.style.setProperty("--next-steps-height", `${nextSteps.clientHeight}px`);
            }

            this.scrollBottomButton.style.setProperty("--next-steps-height", `${nextSteps.clientHeight}px`);
        }

        // Update check of scroll position after sizes are adjusted.
        this.checkScrollPosition();
    }

    highlightCodeBlocks(chatMessageElement) {
        var codeBlocks = chatMessageElement.getElementsByClassName("code-block");

        for (var i = 0; i < codeBlocks.length; i++) {
            var codeBlock = codeBlocks[i];

            var codeElements = codeBlock.getElementsByTagName("code");
            if (codeElements.length > 0) {
                var codeElement = codeElements[0];

                // Already highlighted.
                if (codeElement.dataset.highlighted) {
                    continue;
                }
                // No language specified. Don't try to auto detect.
                if (!codeElement.dataset.language) {
                    continue;
                }

                hljs.highlightElement(codeElement);
            }
        }
    }

    attachTextareaKeyDownEvent() {
        this.textarea.addEventListener('input', () => this.resizeToFit(this.textarea));
        this.afterPropertyWritten(this.textarea, 'value', () => this.resizeToFit(this.textarea));

        this.resizeToFit(this.textarea);
        this.textarea.focus();

        var previousHasValue = this.textarea.value != '';
        this.textarea.addEventListener("keydown", (event) => {
            // Only send message to the server if the enter key is pressed.
            // Allow enter+shift to add a new line in the textarea.
            if (event.key === "Enter" && !event.shiftKey) {
                // Prevents newline insertion.
                event.preventDefault();

                // Blazor listens on the change event to bind the value.
                this.textarea.dispatchEvent(new CustomEvent('change', { bubbles: true }));
                // Submit form.
                this.form.dispatchEvent(new CustomEvent('submit', { bubbles: true }));
            } else {
                setTimeout(() => {
                    var hasValue = this.textarea.value != '';
                    if (previousHasValue != hasValue) {
                        this.textarea.dispatchEvent(new CustomEvent('change', { bubbles: true }));
                        previousHasValue = hasValue;
                    }
                }, 0);
            }
        });
    }

    resizeToFit(elem) {
        const lineHeight = parseFloat(getComputedStyle(elem).lineHeight);

        elem.rows = 1;
        const numLines = Math.ceil(elem.scrollHeight / lineHeight);
        elem.rows = Math.min(5, Math.max(1, numLines));
    }

    afterPropertyWritten(target, propName, callback) {
        const descriptor = this.getPropertyDescriptor(target, propName);
        Object.defineProperty(target, propName, {
            get: function () {
                return descriptor.get.apply(this, arguments);
            },
            set: function () {
                const result = descriptor.set.apply(this, arguments);
                callback();
                return result;
            }
        });
    }

    getPropertyDescriptor(target, propertyName) {
        return Object.getOwnPropertyDescriptor(target, propertyName)
            || this.getPropertyDescriptor(Object.getPrototypeOf(target), propertyName);
    }
}

// SIG // Begin signature block
// SIG // MIIoQwYJKoZIhvcNAQcCoIIoNDCCKDACAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // UxgzGbPs2H2gZzRuKXqFbYFcgKPGyEpkP4+7l+w5v9Gg
// SIG // gg12MIIF9DCCA9ygAwIBAgITMwAABARsdAb/VysncgAA
// SIG // AAAEBDANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTI0MDkxMjIwMTExNFoX
// SIG // DTI1MDkxMTIwMTExNFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // tCg32mOdDA6rBBnZSMwxwXegqiDEUFlvQH9Sxww07hY3
// SIG // w7L52tJxLg0mCZjcszQddI6W4NJYb5E9QM319kyyE0l8
// SIG // EvA/pgcxgljDP8E6XIlgVf6W40ms286Cr0azaA1f7vaJ
// SIG // jjNhGsMqOSSSXTZDNnfKs5ENG0bkXeB2q5hrp0qLsm/T
// SIG // WO3oFjeROZVHN2tgETswHR3WKTm6QjnXgGNj+V6rSZJO
// SIG // /WkTqc8NesAo3Up/KjMwgc0e67x9llZLxRyyMWUBE9co
// SIG // T2+pUZqYAUDZ84nR1djnMY3PMDYiA84Gw5JpceeED38O
// SIG // 0cEIvKdX8uG8oQa047+evMfDRr94MG9EWwIDAQABo4IB
// SIG // czCCAW8wHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFPIboTWxEw1PmVpZS+AzTDwo
// SIG // oxFOMEUGA1UdEQQ+MDykOjA4MR4wHAYDVQQLExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xFjAUBgNVBAUTDTIzMDAx
// SIG // Mis1MDI5MjMwHwYDVR0jBBgwFoAUSG5k5VAF04KqFzc3
// SIG // IrVtqMp1ApUwVAYDVR0fBE0wSzBJoEegRYZDaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9jcmwvTWlj
// SIG // Q29kU2lnUENBMjAxMV8yMDExLTA3LTA4LmNybDBhBggr
// SIG // BgEFBQcBAQRVMFMwUQYIKwYBBQUHMAKGRWh0dHA6Ly93
// SIG // d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvTWlj
// SIG // Q29kU2lnUENBMjAxMV8yMDExLTA3LTA4LmNydDAMBgNV
// SIG // HRMBAf8EAjAAMA0GCSqGSIb3DQEBCwUAA4ICAQCI5g/S
// SIG // KUFb3wdUHob6Qhnu0Hk0JCkO4925gzI8EqhS+K4umnvS
// SIG // BU3acsJ+bJprUiMimA59/5x7WhJ9F9TQYy+aD9AYwMtb
// SIG // KsQ/rst+QflfML+Rq8YTAyT/JdkIy7R/1IJUkyIS6srf
// SIG // G1AKlX8n6YeAjjEb8MI07wobQp1F1wArgl2B1mpTqHND
// SIG // lNqBjfpjySCScWjUHNbIwbDGxiFr93JoEh5AhJqzL+8m
// SIG // onaXj7elfsjzIpPnl8NyH2eXjTojYC9a2c4EiX0571Ko
// SIG // mhENF3RtR25A7/X7+gk6upuE8tyMy4sBkl2MUSF08U+E
// SIG // 2LOVcR8trhYxV1lUi9CdgEU2CxODspdcFwxdT1+G8YNc
// SIG // gzHyjx3BNSI4nOZcdSnStUpGhCXbaOIXfvtOSfQX/UwJ
// SIG // oruhCugvTnub0Wna6CQiturglCOMyIy/6hu5rMFvqk9A
// SIG // ltIJ0fSR5FwljW6PHHDJNbCWrZkaEgIn24M2mG1M/Ppb
// SIG // /iF8uRhbgJi5zWxo2nAdyDBqWvpWxYIoee/3yIWpquVY
// SIG // cYGhJp/1I1sq/nD4gBVrk1SKX7Do2xAMMO+cFETTNSJq
// SIG // fTSSsntTtuBLKRB5mw5qglHKuzapDiiBuD1Zt4QwxA/1
// SIG // kKcyQ5L7uBayG78kxlVNNbyrIOFH3HYmdH0Pv1dIX/Mq
// SIG // 7avQpAfIiLpOWwcbjzCCB3owggVioAMCAQICCmEOkNIA
// SIG // AAAAAAMwDQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290
// SIG // IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDExMB4XDTEx
// SIG // MDcwODIwNTkwOVoXDTI2MDcwODIxMDkwOVowfjELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0EgMjAxMTCCAiIwDQYJKoZI
// SIG // hvcNAQEBBQADggIPADCCAgoCggIBAKvw+nIQHC6t2G6q
// SIG // ghBNNLrytlghn0IbKmvpWlCquAY4GgRJun/DDB7dN2vG
// SIG // EtgL8DjCmQawyDnVARQxQtOJDXlkh36UYCRsr55JnOlo
// SIG // XtLfm1OyCizDr9mpK656Ca/XllnKYBoF6WZ26DJSJhIv
// SIG // 56sIUM+zRLdd2MQuA3WraPPLbfM6XKEW9Ea64DhkrG5k
// SIG // NXimoGMPLdNAk/jj3gcN1Vx5pUkp5w2+oBN3vpQ97/vj
// SIG // K1oQH01WKKJ6cuASOrdJXtjt7UORg9l7snuGG9k+sYxd
// SIG // 6IlPhBryoS9Z5JA7La4zWMW3Pv4y07MDPbGyr5I4ftKd
// SIG // gCz1TlaRITUlwzluZH9TupwPrRkjhMv0ugOGjfdf8NBS
// SIG // v4yUh7zAIXQlXxgotswnKDglmDlKNs98sZKuHCOnqWbs
// SIG // YR9q4ShJnV+I4iVd0yFLPlLEtVc/JAPw0XpbL9Uj43Bd
// SIG // D1FGd7P4AOG8rAKCX9vAFbO9G9RVS+c5oQ/pI0m8GLhE
// SIG // fEXkwcNyeuBy5yTfv0aZxe/CHFfbg43sTUkwp6uO3+xb
// SIG // n6/83bBm4sGXgXvt1u1L50kppxMopqd9Z4DmimJ4X7Iv
// SIG // hNdXnFy/dygo8e1twyiPLI9AN0/B4YVEicQJTMXUpUMv
// SIG // dJX3bvh4IFgsE11glZo+TzOE2rCIF96eTvSWsLxGoGyY
// SIG // 0uDWiIwLAgMBAAGjggHtMIIB6TAQBgkrBgEEAYI3FQEE
// SIG // AwIBADAdBgNVHQ4EFgQUSG5k5VAF04KqFzc3IrVtqMp1
// SIG // ApUwGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEwCwYD
// SIG // VR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0j
// SIG // BBgwFoAUci06AjGQQ7kUBU7h6qfHMdEjiTQwWgYDVR0f
// SIG // BFMwUTBPoE2gS4ZJaHR0cDovL2NybC5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2VyQXV0
// SIG // MjAxMV8yMDExXzAzXzIyLmNybDBeBggrBgEFBQcBAQRS
// SIG // MFAwTgYIKwYBBQUHMAKGQmh0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0MjAx
// SIG // MV8yMDExXzAzXzIyLmNydDCBnwYDVR0gBIGXMIGUMIGR
// SIG // BgkrBgEEAYI3LgMwgYMwPwYIKwYBBQUHAgEWM2h0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvZG9jcy9w
// SIG // cmltYXJ5Y3BzLmh0bTBABggrBgEFBQcCAjA0HjIgHQBM
// SIG // AGUAZwBhAGwAXwBwAG8AbABpAGMAeQBfAHMAdABhAHQA
// SIG // ZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0BAQsFAAOCAgEA
// SIG // Z/KGpZjgVHkaLtPYdGcimwuWEeFjkplCln3SeQyQwWVf
// SIG // Liw++MNy0W2D/r4/6ArKO79HqaPzadtjvyI1pZddZYSQ
// SIG // fYtGUFXYDJJ80hpLHPM8QotS0LD9a+M+By4pm+Y9G6XU
// SIG // tR13lDni6WTJRD14eiPzE32mkHSDjfTLJgJGKsKKELuk
// SIG // qQUMm+1o+mgulaAqPyprWEljHwlpblqYluSD9MCP80Yr
// SIG // 3vw70L01724lruWvJ+3Q3fMOr5kol5hNDj0L8giJ1h/D
// SIG // Mhji8MUtzluetEk5CsYKwsatruWy2dsViFFFWDgycSca
// SIG // f7H0J/jeLDogaZiyWYlobm+nt3TDQAUGpgEqKD6CPxNN
// SIG // ZgvAs0314Y9/HG8VfUWnduVAKmWjw11SYobDHWM2l4bf
// SIG // 2vP48hahmifhzaWX0O5dY0HjWwechz4GdwbRBrF1HxS+
// SIG // YWG18NzGGwS+30HHDiju3mUv7Jf2oVyW2ADWoUa9WfOX
// SIG // pQlLSBCZgB/QACnFsZulP0V3HjXG0qKin3p6IvpIlR+r
// SIG // +0cjgPWe+L9rt0uX4ut1eBrs6jeZeRhL/9azI2h15q/6
// SIG // /IvrC4DqaTuv/DDtBEyO3991bWORPdGdVk5Pv4BXIqF4
// SIG // ETIheu9BCrE/+6jMpF3BoYibV3FWTkhFwELJm3ZbCoBI
// SIG // a/15n8G9bW1qyVJzEw16UM0xgholMIIaIQIBATCBlTB+
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9NaWNy
// SIG // b3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDExAhMzAAAE
// SIG // BGx0Bv9XKydyAAAAAAQEMA0GCWCGSAFlAwQCAQUAoIGu
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3
// SIG // DQEJBDEiBCCkO3onhzIWKmf7nTPGcywZi95QuGA8Novp
// SIG // 5P+Fz+SjBzBCBgorBgEEAYI3AgEMMTQwMqAUgBIATQBp
// SIG // AGMAcgBvAHMAbwBmAHShGoAYaHR0cDovL3d3dy5taWNy
// SIG // b3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAHYpBZ/D
// SIG // 3L6Fh2ii5AN9Apj6Kb4Ncy4YgahMUAsOLeedAAOIMhV0
// SIG // 7ubtUnr8NKO1fP9YvMHz2ylFpf3ZMyD4Vp6s90kgdjQj
// SIG // B4T9AOWIu8dj8d40RPLKRYxJjRCjNM6Wn/tEQsWwNDlQ
// SIG // I3JfJ6RGUi236ErbdOR6oRaFpPOxxbDbQZ6lZtHP3LTK
// SIG // zlptQpna2Q2TTUmYaXRi3goRdHEpVLCY+Eivdaw7bcBB
// SIG // SJcFODEya2GTvWq9K/6EG9vzR5OaNF1HJBx15UVj0MLZ
// SIG // kikUkBwBgdhE2kjzRE0a/s4z9gMyn9eDB4TTrKx1nDW+
// SIG // zr7iIkOPB15/QtkonVvbo9HEre2hghevMIIXqwYKKwYB
// SIG // BAGCNwMDATGCF5swgheXBgkqhkiG9w0BBwKggheIMIIX
// SIG // hAIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBWQYLKoZIhvcN
// SIG // AQkQAQSgggFIBIIBRDCCAUACAQEGCisGAQQBhFkKAwEw
// SIG // MTANBglghkgBZQMEAgEFAAQg2ZkdjBvm214uY+IX/cEa
// SIG // Qs0FXQSU6s/nlKw/hGdMuAcCBmguJ1SANhgSMjAyNTA2
// SIG // MDYxNDI0MzkuMDNaMASAAgH0oIHZpIHWMIHTMQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQg
// SIG // SXJlbGFuZCBPcGVyYXRpb25zIExpbWl0ZWQxJzAlBgNV
// SIG // BAsTHm5TaGllbGQgVFNTIEVTTjo1MjFBLTA1RTAtRDk0
// SIG // NzElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // U2VydmljZaCCEf4wggcoMIIFEKADAgECAhMzAAACAAvX
// SIG // qn8bKhdWAAEAAAIAMA0GCSqGSIb3DQEBCwUAMHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTI0MDcyNTE4
// SIG // MzEyMVoXDTI1MTAyMjE4MzEyMVowgdMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xLTArBgNVBAsTJE1pY3Jvc29mdCBJcmVs
// SIG // YW5kIE9wZXJhdGlvbnMgTGltaXRlZDEnMCUGA1UECxMe
// SIG // blNoaWVsZCBUU1MgRVNOOjUyMUEtMDVFMC1EOTQ3MSUw
// SIG // IwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2
// SIG // aWNlMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKC
// SIG // AgEAr1XaadKkP2TkunoTF573/tF7KJM9Doiv3ccv26mq
// SIG // nUhmv2DM59ikET4WnRfo5biFIHc6LqrIeqCgT9fT/Gks
// SIG // 5VKO90ZQW2avh/PMHnl0kZfX/I5zdVooXHbdUUkPiZfN
// SIG // XszWswmL9UlWo8mzyv9Lp9TAtw/oXOYTAxdYSqOB5Uzz
// SIG // 1Q3A8uCpNlumQNDJGDY6cSn0MlYukXklArChq6l+KYrl
// SIG // 6r/WnOqXSknABpggSsJ33oL3onmDiN9YUApZwjnNh9M6
// SIG // kDaneSz78/YtD/2pGpx9/LXELoazEUFxhyg4KdmoWGNY
// SIG // wdR7/id81geOER69l5dJv71S/mH+Lxb6L692n8uEmAVw
// SIG // 6fVvE+c8wjgYZblZCNPAynCnDduRLdk1jswCqjqNc3X/
// SIG // WIzA7GGs4HUS4YIrAUx8H2A94vDNiA8AWa7Z/HSwTCyI
// SIG // geVbldXYM2BtxMKq3kneRoT27NQ7Y7n8ZTaAje7Blfju
// SIG // 83spGP/QWYNZ1wYzYVGRyOpdA8Wmxq5V8f5r4HaG9zPc
// SIG // ykOyJpRZy+V3RGighFmsCJXAcMziO76HinwCIjImnCFK
// SIG // GJ/IbLjH6J7fJXqRPbg+H6rYLZ8XBpmXBFH4PTakZVYx
// SIG // B/P+EQbL5LNw0ZIM+eufxCljV4O+nHkM+zgSx8+07BVZ
// SIG // PBKslooebsmhIcBO0779kehciYMCAwEAAaOCAUkwggFF
// SIG // MB0GA1UdDgQWBBSAJSTavgkjKqge5xQOXn35fXd3OjAf
// SIG // BgNVHSMEGDAWgBSfpxVdAF5iXYP05dJlpxtTNRnpcjBf
// SIG // BgNVHR8EWDBWMFSgUqBQhk5odHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpb3BzL2NybC9NaWNyb3NvZnQlMjBU
// SIG // aW1lLVN0YW1wJTIwUENBJTIwMjAxMCgxKS5jcmwwbAYI
// SIG // KwYBBQUHAQEEYDBeMFwGCCsGAQUFBzAChlBodHRwOi8v
// SIG // d3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL01p
// SIG // Y3Jvc29mdCUyMFRpbWUtU3RhbXAlMjBQQ0ElMjAyMDEw
// SIG // KDEpLmNydDAMBgNVHRMBAf8EAjAAMBYGA1UdJQEB/wQM
// SIG // MAoGCCsGAQUFBwMIMA4GA1UdDwEB/wQEAwIHgDANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAKPCG9njRtIqQ+fuECgxzWMsQ
// SIG // OI3HvW7sV9PmEWCCOWlTuGCIzNi3ibdLZS0b2IDHg0yL
// SIG // rtdVuBi3FxVdesIXuzYyofIe/alTBdV4DhijLTXtB7Ng
// SIG // Ono7G12iO3t6jy1hPSquzGLry/2mEZBwIsSoS2D+H+3H
// SIG // CJxPDyhzMFqP+plltPACB/QNwZ7q+HGyZv3v8et+rQYg
// SIG // 8sF3PTuWeDg3dR/zk1NawJ/dfFCDYlWNeCBCLvNPQBce
// SIG // MYXFRFKhcSUws7mFdIDDhZpxqyIKD2WDwFyNIGEezn+n
// SIG // d4kXRupeNEx+eSpJXylRD+1d45hb6PzOIF7BkcPtRtFW
// SIG // 2wXgkjLqtTWWlBkvzl2uNfYJ3CPZVaDyMDaaXgO+H6Di
// SIG // rsJ4IG9ikId941+mWDejkj5aYn9QN6ROfo/HNHg1timw
// SIG // pFoUivqAFu6irWZFw5V+yLr8FLc7nbMa2lFSixzu96zd
// SIG // nDsPImz0c6StbYyhKSlM3uDRi9UWydSKqnEbtJ6Mk+Yu
// SIG // xvzprkuWQJYWfpPvug+wTnioykVwc0yRVcsd4xMznnnR
// SIG // tZDGMSUEl9tMVnebYRshwZIyJTsBgLZmHM7q2TFK/X99
// SIG // 44SkIqyY22AcuLe0GqoNfASCIcZtzbZ/zP4lT2/N0pDb
// SIG // n2ffAzjZkhI+Qrqr983mQZWwZdr3Tk1MYElDThz2D0Mw
// SIG // ggdxMIIFWaADAgECAhMzAAAAFcXna54Cm0mZAAAAAAAV
// SIG // MA0GCSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0
// SIG // aWZpY2F0ZSBBdXRob3JpdHkgMjAxMDAeFw0yMTA5MzAx
// SIG // ODIyMjVaFw0zMDA5MzAxODMyMjVaMHwxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQSAyMDEwMIICIjANBgkqhkiG9w0BAQEF
// SIG // AAOCAg8AMIICCgKCAgEA5OGmTOe0ciELeaLL1yR5vQ7V
// SIG // gtP97pwHB9KpbE51yMo1V/YBf2xK4OK9uT4XYDP/XE/H
// SIG // ZveVU3Fa4n5KWv64NmeFRiMMtY0Tz3cywBAY6GB9alKD
// SIG // RLemjkZrBxTzxXb1hlDcwUTIcVxRMTegCjhuje3XD9gm
// SIG // U3w5YQJ6xKr9cmmvHaus9ja+NSZk2pg7uhp7M62AW36M
// SIG // EBydUv626GIl3GoPz130/o5Tz9bshVZN7928jaTjkY+y
// SIG // OSxRnOlwaQ3KNi1wjjHINSi947SHJMPgyY9+tVSP3PoF
// SIG // VZhtaDuaRr3tpK56KTesy+uDRedGbsoy1cCGMFxPLOJi
// SIG // ss254o2I5JasAUq7vnGpF1tnYN74kpEeHT39IM9zfUGa
// SIG // RnXNxF803RKJ1v2lIH1+/NmeRd+2ci/bfV+Autuqfjbs
// SIG // Nkz2K26oElHovwUDo9Fzpk03dJQcNIIP8BDyt0cY7afo
// SIG // mXw/TNuvXsLz1dhzPUNOwTM5TI4CvEJoLhDqhFFG4tG9
// SIG // ahhaYQFzymeiXtcodgLiMxhy16cg8ML6EgrXY28MyTZk
// SIG // i1ugpoMhXV8wdJGUlNi5UPkLiWHzNgY1GIRH29wb0f2y
// SIG // 1BzFa/ZcUlFdEtsluq9QBXpsxREdcu+N+VLEhReTwDwV
// SIG // 2xo3xwgVGD94q0W29R6HXtqPnhZyacaue7e3PmriLq0C
// SIG // AwEAAaOCAd0wggHZMBIGCSsGAQQBgjcVAQQFAgMBAAEw
// SIG // IwYJKwYBBAGCNxUCBBYEFCqnUv5kxJq+gpE8RjUpzxD/
// SIG // LwTuMB0GA1UdDgQWBBSfpxVdAF5iXYP05dJlpxtTNRnp
// SIG // cjBcBgNVHSAEVTBTMFEGDCsGAQQBgjdMg30BATBBMD8G
// SIG // CCsGAQUFBwIBFjNodHRwOi8vd3d3Lm1pY3Jvc29mdC5j
// SIG // b20vcGtpb3BzL0RvY3MvUmVwb3NpdG9yeS5odG0wEwYD
// SIG // VR0lBAwwCgYIKwYBBQUHAwgwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAU1fZWy4/oolxiaNE9
// SIG // lJBb186aGMQwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMuY3JsMFoG
// SIG // CCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXRfMjAxMC0wNi0yMy5jcnQwDQYJKoZIhvcN
// SIG // AQELBQADggIBAJ1VffwqreEsH2cBMSRb4Z5yS/ypb+pc
// SIG // FLY+TkdkeLEGk5c9MTO1OdfCcTY/2mRsfNB1OW27DzHk
// SIG // wo/7bNGhlBgi7ulmZzpTTd2YurYeeNg2LpypglYAA7AF
// SIG // vonoaeC6Ce5732pvvinLbtg/SHUB2RjebYIM9W0jVOR4
// SIG // U3UkV7ndn/OOPcbzaN9l9qRWqveVtihVJ9AkvUCgvxm2
// SIG // EhIRXT0n4ECWOKz3+SmJw7wXsFSFQrP8DJ6LGYnn8Atq
// SIG // gcKBGUIZUnWKNsIdw2FzLixre24/LAl4FOmRsqlb30mj
// SIG // dAy87JGA0j3mSj5mO0+7hvoyGtmW9I/2kQH2zsZ0/fZM
// SIG // cm8Qq3UwxTSwethQ/gpY3UA8x1RtnWN0SCyxTkctwRQE
// SIG // cb9k+SS+c23Kjgm9swFXSVRk2XPXfx5bRAGOWhmRaw2f
// SIG // pCjcZxkoJLo4S5pu+yFUa2pFEUep8beuyOiJXk+d0tBM
// SIG // drVXVAmxaQFEfnyhYWxz/gq77EFmPWn9y8FBSX5+k77L
// SIG // +DvktxW/tM4+pTFRhLy/AsGConsXHRWJjXD+57XQKBqJ
// SIG // C4822rpM+Zv/Cuk0+CQ1ZyvgDbjmjJnW4SLq8CdCPSWU
// SIG // 5nR0W2rRnj7tfqAxM328y+l7vzhwRNGQ8cirOoo6CGJ/
// SIG // 2XBjU02N7oJtpQUQwXEGahC0HVUzWLOhcGbyoYIDWTCC
// SIG // AkECAQEwggEBoYHZpIHWMIHTMQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMS0wKwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBP
// SIG // cGVyYXRpb25zIExpbWl0ZWQxJzAlBgNVBAsTHm5TaGll
// SIG // bGQgVFNTIEVTTjo1MjFBLTA1RTAtRDk0NzElMCMGA1UE
// SIG // AxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIj
// SIG // CgEBMAcGBSsOAwIaAxUAjJOfLZb3ivipL3sSLlWFbLrW
// SIG // jmSggYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMDANBgkqhkiG9w0BAQsFAAIFAOvtE4MwIhgPMjAy
// SIG // NTA2MDYwNzEzMDdaGA8yMDI1MDYwNzA3MTMwN1owdzA9
// SIG // BgorBgEEAYRZCgQBMS8wLTAKAgUA6+0TgwIBADAKAgEA
// SIG // AgIJQwIB/zAHAgEAAgISgTAKAgUA6+5lAwIBADA2Bgor
// SIG // BgEEAYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIB
// SIG // AAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEBCwUA
// SIG // A4IBAQALCeXfN9Q4TpzneyiXO+Cs8A7W6WGKCODF6TCh
// SIG // oRdcXMs09+1komjgA6tQWTsE/+wgrMvLtH5GGn7RCOzW
// SIG // Xncl1cq1yZ6soMpv4YRwLtagolJCQv7h5pnZkBx7/XLu
// SIG // 5jrZldxzcr6V5AtjvlK2OkE6GTlyisHJYBbjZyEOLWOX
// SIG // 8Wa9PgSJqa44k6+7ca6QN+V5St4WPONlIekEwIHlNIsj
// SIG // oMS2JhMcq0X9YMmm1v3Jd3VhSNinXyPWl+jApJBxPOZu
// SIG // TqHnJP8fqpviU2HTRLknYnsC6OabUu/KAToW0eQTNCCp
// SIG // Osnaz9lsIuZR4J0H+WOnrVXK1mpxPKcMgNJA48DnMYIE
// SIG // DTCCBAkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEm
// SIG // MCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENB
// SIG // IDIwMTACEzMAAAIAC9eqfxsqF1YAAQAAAgAwDQYJYIZI
// SIG // AWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG
// SIG // 9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgDZvygpOFFtKR
// SIG // lZhUyNgoCW+bX6NbfKXjZUwk+dfzABkwgfoGCyqGSIb3
// SIG // DQEJEAIvMYHqMIHnMIHkMIG9BCDUyO3sNZ3burBNDGUC
// SIG // V4NfM2gH4aWuRudIk/9KAk/ZJzCBmDCBgKR+MHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAACAAvXqn8b
// SIG // KhdWAAEAAAIAMCIEIIlrtCOcMYGnQGy+wsJIFLo+OtX6
// SIG // wCWtZLH2Z00GzJL0MA0GCSqGSIb3DQEBCwUABIICAF+u
// SIG // m6w9SOLgrfNM71R4BRYc17M1PLnpWDkIlN7OeLlwFY1g
// SIG // nu2oJ8AVsyRGuhd5bD+sbH5o3d86MX/SV31wE2UcYN+u
// SIG // RvGhL2sUOa+aK6hL1UWnSZz7RVTeznLX6XTPOjmOE+m6
// SIG // 3NYu5zk7B4tgycefHm6zUndzhjJlKhR0PJ0bLDbDMQqy
// SIG // cr3tyPUvT/FBVfSkB0XBZRyh4OdLeuK2aTjRxP2MpcqR
// SIG // Ribbe8uW6+2Atn4a9kTTBxX5Ae19eeyEbm7ZvSj40Ul+
// SIG // Rb10tGWOYJv4HC1TaZo+7zC02qn8yBiJ4xB8UphjO9aw
// SIG // XmHmI3DvdBDDdF2vgADk73hHpK6s+7bGAILosSlxyDwV
// SIG // vfKQcs6xSE2Lzsu1Cpiaq5nmfn27Kz15DasGGMYBWlOl
// SIG // +IuTIhwbPazr1Vb+cFlQvSzkpCuAPf8BatLs5JgKXAXi
// SIG // Ebxuj4KSbsIwwRLT1mnEPk4/0/UcjqSqtcMQprOUv86X
// SIG // nf3Y1gnUtGs1cvfgaicmBsjFla558jBp9CjYK2GXNw9K
// SIG // 7wY27whKHA40LAm8cfvKY+9L5xjKLA0HMDfe2U7jZrU3
// SIG // sPeBzAAdQVLDr7BukPfTcW5R6kbYVM6Ge5jb7UJl21Cq
// SIG // JheVku/LQgA368gZEo2BWvOLbtfyzAM2CQeV4Mcq0mSW
// SIG // lSSkL9xZiDJsK3r5YaGM
// SIG // End signature block
