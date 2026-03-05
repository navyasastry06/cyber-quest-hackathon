

// Replace with the AppID you got from the InboxSDK website
const MY_APP_ID = 'sdk_VaultID_82e916ce03';


InboxSDK.load(2, MY_APP_ID).then(function(sdk) {
  sdk.Conversations.registerMessageViewHandler(function(messageView) {
    const sender = messageView.getSender();
    const emailAddress = sender.emailAddress;

    if (sdk.User.getEmailAddress() === emailAddress) return;

    const threadView = messageView.getThreadView();
    
    // 1. Create the container FIRST
    const uiContainer = createSidebarUI(emailAddress);
    
    // 2. Inject it into Gmail
    threadView.addSidebarContentPanel({
      title: 'VaultID Identity Report',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png',
      el: uiContainer
    });

    // 3. Pass the EXACT container to our fetch function
    scanEmail(emailAddress, uiContainer);
  });
});

function createSidebarUI(email) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="padding: 15px; background-color: #0f172a; color: #e2e8f0; border-radius: 8px; border: 1px solid #334155; font-family: sans-serif;">
      <h3 style="margin-top: 0; color: #38bdf8;">🔍 Scanning Sender...</h3>
      <p style="font-size: 14px;"><strong>${email}</strong></p>
      <hr style="border-color: #1e293b; margin: 15px 0;"/>
      <p style="margin-bottom: 0;">Status: <span style="color: #fbbf24; font-weight: bold;">Verifying with AI...</span></p>
    </div>
  `;
  return div;
}

async function scanEmail(email, container) {
    console.log(`[VaultID Frontend] Sending ${email} to backend...`);
    try {
        const response = await fetch('http://localhost:5000/api/vaultid/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senderEmail: email })
        });
        
        const data = await response.json();
        
        const isSafe = data.trustScore > 60;
        const color = isSafe ? '#22c55e' : '#ef4444'; 
        const statusText = isSafe ? '🟢 VERIFIED' : '🚨 HIGH RISK';

        // 1. SMART LOGIC: Only show the Report button if it's NOT safe!
        const actionButtonHTML = isSafe 
            ? `<p style="text-align: center; margin-top: 15px; color: #22c55e; font-size: 13px; font-weight: bold;">🛡️ Threat Level Zero. No action required.</p>`
            : `<button id="report-btn" style="width: 100%; background: #ef4444; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                    🚨 Report Scam (+50 XP)
               </button>`;

        // 2. Inject the UI
        container.innerHTML = `
            <div style="padding: 15px; background-color: #0f172a; color: #e2e8f0; border-radius: 8px; border: 1px solid ${color}; font-family: sans-serif;">
                <h3 style="margin-top: 0; color: ${color};">${statusText}</h3>
                <p style="font-size: 14px;"><strong>${email}</strong></p>
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px; margin: 10px 0;">
                    <strong>Trust Score:</strong> ${data.trustScore}/100
                </div>
                <p style="font-size: 12px; color: #94a3b8;"><strong>AI Forensics:</strong> "${data.analysis}"</p>
                ${actionButtonHTML}
            </div>
        `;

     // 3. Only attach the click listener if the button actually exists
        if (!isSafe) {
            const reportBtn = container.querySelector('#report-btn');
            
            reportBtn.addEventListener('click', async () => {
                // UI Feedback: Change button while loading
                reportBtn.innerText = '⏳ Syncing to Global Registry...';
                reportBtn.style.background = '#f59e0b'; // Yellow warning color
                reportBtn.disabled = true;
                
                try {
                    // Grab the Operative's (User's) own Gmail address using InboxSDK
                    const operativeEmail = sdk.User.getEmailAddress();

                    // Send the exact payload your backend requires
                    const xpResponse = await fetch('http://localhost:5000/api/user/update-xp', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            email: operativeEmail, 
                            xpGain: 50,
                            wasCorrect: true,     // They correctly identified it!
                            isPhishing: true,     // It was a real threat
                            isChallenge: false    // This is a live email, not a test
                        })
                    });

                    const data = await xpResponse.json();

                    if (xpResponse.ok && data.success) {
                        // Success! Show the new total XP from the database
                        reportBtn.innerText = `✅ Threat Neutralized (Total XP: ${data.stats.total_xp})`;
                        reportBtn.style.background = '#22c55e'; // Green
                        reportBtn.style.cursor = 'default';
                    } else {
                        throw new Error(data.error || "Server rejected XP sync");
                    }
                    
                } catch (error) {
                    console.error("[VaultID] XP Sync Error:", error);
                    reportBtn.innerText = '❌ Sync Failed. Try Again.';
                    reportBtn.style.background = '#ef4444'; // Back to Red
                    reportBtn.disabled = false;
                }
            });
        }

    } catch (error) {
        console.error("[VaultID Frontend] Connection Error:", error);
        container.innerHTML = `<div style="padding: 15px; background-color: #0f172a; color: #ef4444; border: 1px solid #ef4444; border-radius: 8px;">🚨 Connection to Backend Failed. Is your server running?</div>`;
    }
}