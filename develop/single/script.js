const APP = {
    version: '4.0',
    mode: (window.location.pathname === '/delta-dual') ? 2 : 1,
    resize: 0,
    machineId: getMachineId(),
    skinAuth: 'Vanis s5fKDiOD5hSR-DVZGs5u',
    reserved: {
        value: false,
        color: '#ffffff'
    },
    blacklist: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "k", "K", "m", "M", "A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", "C1", "C2", "C3", "C4", "C5", "D1", "D2", "D3", "D4", "D5", "E1", "E2", "E3", "E4", "E5", "Unnamed", "", " ", "  ", "   ", "    ", "     ", "      ", "       ", "        ", "         ", "          ", "           ", "            ", "             ", "              ", "               ", "                "],
}

const ATTRS = {
    libraries: getAllLibrary(),
    selectors: getAllSelectors(),
    images: getAllImages(),
    colors: getAllColors(),
    errors: getAllErrors(),
    titles: getAllTitle(),
}

const DB = {
    database: undefined,
    references: {},
}

const USER = {
    credentials: {},
    statistics: {},
    configurations: getAllConfigurations(),
}

const LISTS = {
    users: {},
    colors: {},
    badges: undefined,
    configurations: undefined,
    leaderboard: undefined,
}

const SKINS = {
    all: [],
    me: [],
    fav: [],
}

/*************
 *
 *  On start
 *
 *************/
if (document.readyState === 'submitLoading') {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
} else {
    onDocumentReady();
}

/**********************
 *
 *  Component creator
 *
 **********************/
function onDocumentReady() {
    pageConfiguration();
    onAttributesReady().then();
}

async function onAttributesReady() {
    try {
        await loadScript(ATTRS.libraries.firebaseApp);
        await Promise.all([
            loadScript(ATTRS.libraries.jquery),
            loadScript(ATTRS.libraries.firebaseAuth),
            loadScript(ATTRS.libraries.firebaseDatabase),
            loadScript(ATTRS.libraries.sortable),
        ]);
        await onScriptsReady();
    } catch (error) {
        const errorPromise = parseInt(localStorage.getItem('promiseError') || 0) || 0;

        if (errorPromise < 2) {
            localStorage.setItem('promiseError', (errorPromise + 1).toString());
            window.location.reload();
        } else {
            displayError(ATTRS.errors.title + 'Promise issue, 3 attempts failed.' + ATTRS.errors.content);
        }
    }
}

async function onScriptsReady() {
    firebaseConfiguration(() => {
        firebaseAccount(() => {
            firebaseComponents(() => {
                removeAds();
                createComponents();
                listenerComponents();
                drawStyle();
            });
        });
    })
}

/***************************
 *
 *  Firebase configuration
 *
 ***************************/
function firebaseConfiguration(callback) {
    const firebaseConfig = {
        apiKey: "AIzaSyCc_St6TMlGM6fmeYre_gHjCXYriPc3wtM",
        authDomain: "delta-client.firebaseapp.com",
        projectId: "delta-client",
        storageBucket: "delta-client.appspot.com",
        messagingSenderId: "68762024822",
        appId: "1:68762024822:web:c4f0497b6b914ac9ce9857",
        measurementId: "G-G5YSMYFCXJ",
        databaseURL: "https://delta-client-default-rtdb.europe-west1.firebasedatabase.app"
    };

    if (typeof firebase !== "undefined") {
        firebase.initializeApp(firebaseConfig);
        callback();
    } else {
        displayError(ATTRS.errors.title + 'Database connection failed' + ATTRS.errors.content);
    }
}

/*********************
 *
 *  Firebase account
 *
 *********************/
function firebaseSignOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut()
            .then(() => {
                window.location.reload();
            }).catch(() => {
            displayError(ERROR.title + 'Signout failed' + ERROR.content);
        });
    }
}

function firebaseAccount(callback) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            getLocalValues(user);
            getDatabase();
            callback();
        } else {
            initRegisterForm(() => {});
        }
    });
}

/************************
 *
 *  Firebase components
 *
 ************************/
function firebaseComponents(callback) {
    if (firebase.apps.length > 0) {
        fetchUserData();
        callback();
    }
}

/**************************
 *
 *  Firebase account form
 *
 **************************/
function initRegisterForm() {
    initRegisterPage();
    initAnimationsPage();
    initAnimationsForm();
    initForm();
    setTimeout(() => {
        removeCookie();
    }, 1000);
}

function initRegisterPage() {
    document.head.innerHTML += `
        <style>
            #login-form>input::placeholder {
                color:#956dff6e;
            }
        </style>
    `;

    document.body.innerHTML += `
        <div class="signIn" style="background: linear-gradient(45deg,#010004,#130535);position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 9999;display: flex;justify-content: center;align-items: center;flex-direction: column;">
            <h2 id="delta-text" style="position: absolute;top: 90px;font-size: 45px;background: linear-gradient(45deg, #5718c2, #8036ff, #aa78ff, #cbadff, #aa78ff, #8036ff, #5718c2);background-size: 200% auto;animation: slide 2s infinite;-webkit-background-clip: text;background-clip: text;color: transparent;">Delta account</h2>
           <h4 id="delta-text" style="position: absolute;top: 180px;color: #b79cff;font-size: 25px;opacity: 0.8;text-align: center">Password login is required for security<br>Your data is safe and secured <i class="fas fa-lock"></i><br>Your password must be at least 7 characters long <i class="fas fa-key"></i></h4>
           <form id="login-form" style="position: absolute; display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center; margin-top: 270px">
              <input type="email" id="email-input" placeholder="Email" style="background: #54379f4d;border:solid 1px #956dff6e;color: #ffffff;border-radius: 13px;padding: 8px;width: 350px;height: 35px;font-size: 18px;text-align: center;">
              <input type="password" id="password-input" placeholder="Password" style="background: #54379f4d;border:solid 1px #956dff6e;color: #dadada;border-radius: 13px;padding: 8px;width: 350px;height: 35px;font-size: 18px;text-align: center;">
              <div id="submit-account" style="background: #b69cff;color: #241931;border-radius: 13px;padding: 8px;width: 350px;height: 35px;transform: scale(1);transition: all 0.3s ease 0s;">
                 <p id="submit-text" style="font-size: 18px; text-align: center; padding: 6px;">Login/create (automatic)</p>
              </div>
           </form>
        </div>
    `;
}

function initAnimationsForm() {
    const submitButton = $(ATTRS.selectors.submitButton);
    const submitButtonHoverStyle = {
        transform: 'scale(0.9)',
        transition: 'all 0.3s'
    };
    const submitButtonNormalStyle = {
        transform: 'scale(1)',
        transition: 'all 0.3s'
    };

    const handleInput = () => {
        $(ATTRS.selectors.submitText).text('Login/create (automatic)');
        submitButton.css('background-color', '#b69cff');
    };

    submitButton.hover(
        () => submitButton.css(submitButtonHoverStyle),
        () => submitButton.css(submitButtonNormalStyle)
    );

    $(ATTRS.selectors.emailInput).on('input', handleInput);
    $(ATTRS.selectors.passwordInput).on('input', handleInput);
}

function initForm() {
    const submitButton = $(ATTRS.selectors.submitButton);
    const submitText = $(ATTRS.selectors.submitText);
    const emailInput = $(ATTRS.selectors.emailInput);
    const passwordInput = $(ATTRS.selectors.passwordInput);

    const setLoadingState = () => {
        submitText.text('Loading...');
        submitButton.css('background-color', '#584879');
    };

    const setErrorState = (message) => {
        submitText.text(message);
        submitButton.css('background-color', '#ee3652');
    };

    const handleAuthSuccess = () => {
        USER.credentials = firebase.auth().currentUser;
        window.location.reload();
    };

    const handleAuthError = (error) => {
        if (error.code === 'auth/email-already-in-use') {
            firebase.auth().signInWithEmailAndPassword(emailInput.val(), passwordInput.val())
                .then(handleAuthSuccess)
                .catch(() => setErrorState('Incorrect password...'));
        } else {
            setErrorState('An error as occurred...');
        }
    };

    submitButton.on('click', function() {
        if (passwordInput.val().length > 6) {
            setLoadingState();

            firebase.auth().createUserWithEmailAndPassword(emailInput.val(), passwordInput.val())
                .then(handleAuthSuccess)
                .catch(handleAuthError);
        } else {
            setErrorState('Password too short...');
        }
    });
}

function initAnimationsPage() {
    const animationStyle = document.createElement('style');

    animationStyle.textContent = `
        @keyframes slide { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `;

    document.head.appendChild(animationStyle);
}

/*********************
 *
 *  Push to database
 *
 *********************/
function pushUserInfos() {
    let data = {
        uid: USER.credentials.uid,
        nickname: USER.configurations.nickname,
        skin: $(ATTRS.selectors.skinUrl).val(),
        color: APP.reserved.value ? APP.reserved.color : USER.configurations.nicknameColor,
        server: USER.server,
        status: new Date().getTime(),
        mode: USER.mode,
        level: 0,
        anonymous: USER.configurations.anonymous,
    }

    if ($(ATTRS.selectors.discordBtn)) data.level = $(ATTRS.selectors.level).text().trim().match(/\d+/)[0] || 0;
    pushDatabase(DB.references.meUser, data);
}

function pushUserOnline() {
    pushDatabase(DB.references.meUser, {
        uid: USER.credentials.uid,
        nickname: USER.configurations.nickname,
        skin: $(ATTRS.selectors.skinUrl).val(),
        color: APP.reserved.value ? APP.reserved.color : USER.configurations.nicknameColor,
        server: USER.server,
        status: new Date().getTime(),
    });
}

function pushUserColors() {
    if (APP.reserved.value) return;

    pushDatabase(DB.references.meColor, {
        uid: USER.credentials.uid,
        nickname: USER.configurations.nickname,
        color: USER.configurations.nicknameColor,
    });
}

function pushUserConfigurations() {
    if (USER.configurations.autoSynchronization === 'checked') {
        pushDatabase(DB.references.meConfigItem, {
            skins: USER.configurations.skins,
            hotkeys: USER.configurations.hotkeys,
            blurredHUD: USER.configurations.blurredHUD,
            resizableChatbox: USER.configurations.resizableChatbox,
            colorNicknameCell: USER.configurations.colorNicknameCell,
            colorNicknameChatbox: USER.configurations.colorNicknameChatbox,
            colorNicknameLeaderboard: USER.configurations.colorNicknameLeaderboard,
            nicknameColor: USER.configurations.nicknameColor,
            nickname: USER.configurations.nickname,
            teamtag: $(ATTRS.selectors.teamTag).val(),
            machineId: USER.configurations.machineId,
            date: USER.configurations.date,
        });
    }
}

function pushUserStatisticsDb() {
    pushDatabase(DB.references.meStat, USER.statistics);

    localStorage.setItem('sT', '0');
    localStorage.setItem('sM', '0');
    localStorage.setItem('sK', '0');
    localStorage.setItem('sG', '1');
}

function pushUserStatisticsLocally() {
    const time = parseInt(getLocalStorageItem('sT', '0')) + ($(ATTRS.selectors.statTime).length ? getConvertedTimeToSeconds($(ATTRS.selectors.statTime).text().split(": ")[1]) : 0);
    const mass = parseInt(getLocalStorageItem('sM', '0')) + ($(ATTRS.selectors.statScore).length ? getConvertedStringToNumber($(ATTRS.selectors.statScore).text().split(": ")[1]) : 0);
    const kill = parseInt(getLocalStorageItem('sK', '0')) + ($(ATTRS.selectors.statKills).length ? parseInt($(ATTRS.selectors.statKills).text().split(": ")[1], 10) : 0);
    const game = parseInt(getLocalStorageItem('sG', '1')) + 1;

    USER.statistics.timeTotal += time;
    USER.statistics.massTotal += mass;
    USER.statistics.killTotal += kill;
    USER.statistics.gameTotal += 1;
    USER.statistics.timeAvg = USER.statistics.timeTotal / game;
    USER.statistics.massAvg = USER.statistics.massTotal / game;
    USER.statistics.kda = USER.statistics.killTotal / game;

    localStorage.setItem('sT', time.toString());
    localStorage.setItem('sM', mass.toString());
    localStorage.setItem('sK', kill.toString());
    localStorage.setItem('sG', game.toString());
}

function pushUserBadge(item) {
    const badge = JSONSafeParser(unescape(item));
    if (badge !== {}) {
        delete badge.owners;

        Object.values(LISTS.badges).forEach(badgeEach => {
            $(`.badge${badgeEach.id}`).css('opacity', 0.4);
        });
        $(`.badge${badge.id}`).css('opacity', 1);

        pushDatabase(DB.references.meColorBadge, badge);
        pushDatabase(DB.references.meUserBadge, badge);
    }
}

/************************
 *
 *  Fetch from database
 *
 ************************/
function fetchUserStatisticsDb() {
    DB.references.meStat.once('value', snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            USER.statistics = {
                timeTotal: (data.timeTotal || 0) + parseInt(getLocalStorageItem('sT', '0')),
                massTotal: (data.massTotal || 0) + parseInt(getLocalStorageItem('sM', '0')),
                killTotal: (data.killTotal || 0) + parseInt(getLocalStorageItem('sK', '0')),
                gameTotal: (data.gameTotal || 0) + parseInt(getLocalStorageItem('sG', '1')),
                uid: USER.credentials.uid,
            }
        } else {
            USER.statistics = {
                timeTotal: 0,
                massTotal: 0,
                killTotal: 0,
                gameTotal: 1,
                uid: USER.credentials.uid
            };
        }

        USER.statistics.kda = USER.statistics.killTotal / USER.statistics.gameTotal;
        USER.statistics.massAvg = USER.statistics.massTotal / USER.statistics.gameTotal;
        USER.statistics.timeAvg = USER.statistics.timeTotal / USER.statistics.gameTotal;

        pushUserStatisticsDb();
    });
}

function fetchUsersOnce() {
    DB.references.user.once('value', snapshot => {
        if (snapshot.exists()) {
            LISTS.users = snapshot.val();

            fetchBanned();
            fetchUserChanged();
        }
    });
}

function fetchUserChanged() {
    DB.references.user.on('child_changed', snapshot => {
        if (snapshot.exists()) {
            const user = snapshot.val();

            if (user.uid) {
                LISTS.users[user.uid] = user;
            }
        }
    });
}

function fetchColorsOnce(callback) {
    DB.references.color.once('value', snapshot => {
        if (snapshot.exists()) {
            const colors = snapshot.val();

            Object.keys(colors).forEach(uid => {
                const color = colors[uid];

                if (color.nickname && color.color) {
                    LISTS.colors[color.nickname.trim()] = {
                        color: color.color,
                        badge: color.badge && color.badge.url ? color.badge.url : null,
                        uid: color.uid,
                    }
                }
            });

            localStorage.setItem('userColors', JSON.stringify(LISTS.colors));
            if (APP.mode === 1 && USER.configurations.colorNicknameCell === 'checked') changeCellColor();
            if (USER.configurations.colorNicknameLeaderboard === 'checked' || USER.configurations.colorNicknameChatbox === 'checked' || USER.configurations.colorNicknameCell === 'checked') fetchColorChanged();
            callback();
        }
    });
}

function fetchColorChanged() {
    DB.references.color.on('child_changed', snapshot => {
        if (snapshot.exists()) {
            const color = snapshot.val();

            if (color.nickname && color.color) {
                LISTS.colors[color.nickname.trim()] = {
                    color: color.color,
                    badge: color.badge && color.badge.url ? color.badge.url : null,
                    uid: color.uid,
                }
            }

            localStorage.setItem('userColors', JSON.stringify(LISTS.colors));
            if (APP.mode === 1 && USER.configurations.colorNicknameCell === 'checked') changeCellColor(color.nickname);
        }
    });
}

function fetchBanned() {
    const me = LISTS.users[USER.credentials.uid];
    const message = me ? me.banned : undefined;
    if (message) displayError(`You've been banned from Delta by Fohz. Reason: ${message}`);
}

function fetchItem(elements, functionExec) {
    if (!elements) return ``;
    return Object.entries(elements).map(([elementId, element]) => {
        return functionExec(element, elementId);
    }).join('');
}

/***********************
 *
 *  Page configuration
 *
 ***********************/
function pageConfiguration() {
    let link = document.querySelector(ATTRS.selectors.link) || document.createElement('link');

    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = ATTRS.images.deltaLogo;

    document.getElementsByTagName(ATTRS.selectors.head)[0].appendChild(link);
    document.title = APP.mode === 1 ? 'Delta - Single' : 'Delta - Dual';
}

/******************
 *
 *  Script loader
 *
 ******************/
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = url;
        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
    });
}

/*******************
 *
 *  Cookie remover
 *
 *******************/
function removeAds() {
    $(ATTRS.selectors.ad).css('display', 'none');
}

function removeCookie() {
    setTimeout(function() {
        if ($(ATTRS.selectors.cmp)) {
            $(ATTRS.selectors.cmpButton).click();
            $(ATTRS.selectors.cmp).remove();
        }
    }, 1000);
}

/***********************
 *
 *  Components listener
 *
 ***********************/
function onActionPressed() {
    pushUserOnline();

    if (USER.configurations.resizableChatbox === 'checked' && APP.resize === 0) {
        APP.resize = 1;
        createChatboxResizable();
    }
}

function onColorChanged(that) {
    const color = $(that).val();

    if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        changeUserColor(color);
    } else {
        sendTimedSwal('Error', 'Bad color selected, you must select a real color', 3000, 'OK');
    }
}

function listenerComponents() {
    if (APP.mode === 1) {
        $(ATTRS.selectors.skinUrl).on('change', function() {
            skinValidation($(this).val());
        });

        $(ATTRS.selectors.skinElem).on('click', function() {
            skinValidation($(this).attr('src'));
        });
    }

    if (APP.mode === 2) {
        const target = document.querySelector(ATTRS.selectors.bar);
        const config = {
            characterData: true,
            childList: true,
            subtree: true
        };

        let callback = function(mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    onActionPressed();
                    break;
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(target, config);
    }

    $(ATTRS.selectors.nickname).on('input', function() {
        if (APP.mode === 1) $(ATTRS.selectors.nicknameProfile).text($(this).val());
        USER.configurations.nickname = $(this).val();
    }).on('change', function() {
        getReservedName();
        pushUserColors();
        pushUserOnline();
    });

    $(ATTRS.selectors.serverListItem).on('click', function() {
        USER.server = $(this).find(ATTRS.selectors.serverName).text();
        APP.resize = 0;
        pushUserOnline();
    });

    $(ATTRS.selectors.playButton).on('click', () => {
        if (USER.server !== ' Lobbies') pushUserStatisticsLocally();
        onActionPressed();
    });

    $(ATTRS.selectors.spectateButton).on('click', onActionPressed);
}

/***********************
 *
 *  Components creator
 *
 ***********************/
function createComponents() {
    if (APP.mode === 1) {
        createSkinProfile();
        createHUD();
    }

    createBoxes();
    createSortable();

    if (APP.mode === 1 && USER.configurations.colorNicknameChatbox === 'checked') createColorObserver(ATTRS.selectors.messageList, ATTRS.selectors.messageName);
    if (APP.mode === 1 && USER.configurations.colorNicknameLeaderboard === 'checked') createColorObserver(ATTRS.selectors.leaderboard, ATTRS.selectors.leaderboardText);
}

/********
 *
 *  HUD
 *
 ********/
function createHUD() {
    displayTitle();
    displaySocial();

    const level = $(ATTRS.selectors.level).text().trim();
    if (level && $(ATTRS.selectors.discordBtn).length === 0 && level.match(/\d+/)[0] >= 5) displaySwitch();
}

function displayTitle() {
    const randomTitle = ATTRS.titles[Math.floor(Math.random() * ATTRS.titles.length)];

    $(ATTRS.selectors.barHud).append(`
        <titleMod>(Single mode)</titleMod>
        <titleExtension>${randomTitle}</titleExtension>
    `);
}

function displaySocial() {
    const socialContainer = $(ATTRS.selectors.socialContainer);
    if (!socialContainer) return;

    const discordLink = `
        <a data-v-0b519856 href="https://discord.gg/wthDcUb6nY" target="_blank" rel="noopener" class="discord-link">
            <i class="fas fa-heart"></i> Delta Discord
        </a>
    `;

    const bugLink = `
        <a data-v-0b519856 href="https://discord.gg/cJByExsnub" target="_blank" rel="noopener" class="bug-link">
            <i class="fas fa-bug"></i> Report a bug
        </a>
    `;

    socialContainer.append(discordLink, bugLink);
    socialContainer.mouseover(function() {
        socialContainer.fadeTo(250, 1);
    });
    socialContainer.mouseleave(function() {
        socialContainer.stop(true, true).fadeTo(250, 0.1);
    });
}

function displaySwitch() {
    $(ATTRS.selectors.mainContainer).append(`
        <div class="switchDual switchButton" tip='Delta Dual uses Rise, the original system created by Zimek.' onclick="window.location.href = '${ATTRS.libraries.deltaDual}'">
            <p>Switch to dual</p>
            <i style="margin-top: 4px" class="fas fa-exchange-alt"></i>
        </div>
    `);
}

/*****************
 *
 *  Skin profile
 *
 *****************/
function createSkinProfile() {
    const skin = $(ATTRS.selectors.skinUrl);
    const skinURL = skin ? skin.val() : undefined;
    if (!skinURL) return;

    $(ATTRS.selectors.playerData).before(`
        <div class="profile-image">
            <img class="skinProfile beautifulSkin" alt="" src="${skinURL}">
            <span class="nicknameProfile" style="color: ${USER.configurations.nicknameColor}">${USER.configurations.nickname}</span>
        </div>
    `);

    skinValidation(skinURL);
}

function skinValidation(url) {
    if (url === ATTRS.images.imageAddVanis) {
        $(ATTRS.selectors.skinProfile).attr('src', ATTRS.images.vanisSkin);
        return;
    }

    skinChecker(url);
}

function skinChecker(url) {
    const image = new Image();

    image.onload = function() {
        $(ATTRS.selectors.skinProfile).attr('src', url);
        pushUserOnline();
    }

    image.onerror = function() {
        $(ATTRS.selectors.skinProfile).attr('src', ATTRS.images.transparentSkin);
        pushUserOnline();
    }

    image.src = url;
}

/******************
 *
 *  Reserved name
 *
 ******************/
function getReservedName() {
    const colorUser = LISTS.colors[USER.configurations.nickname.trim()];

    if (colorUser && colorUser.uid !== USER.credentials.uid) {
        sendTimedSwal('Reserved nickname', 'Your actual nickname is reserved by another Delta player, if you want to play with your color, change your nickname', 10000, 'OK');
        $(ATTRS.selectors.nicknameProfile).css({
            'color': colorUser.color,
            'font-style': 'italic'
        });
        $(ATTRS.selectors.nickname).css('font-style', 'italic');
        APP.reserved = {
            value: true,
            color: colorUser.color
        };
    } else {
        $(ATTRS.selectors.nicknameProfile).css({
            'color': USER.configurations.nicknameColor,
            'font-style': 'normal'
        });
        $(ATTRS.selectors.nickname).css('font-style', 'normal');
        APP.reserved = {
            value: false,
            color: USER.configurations.nicknameColor
        };
    }
}

/*****************
 *
 *  Page creator
 *
 *****************/
function showPage(pageIndex, buttonSelectors, tabSelectors, functionExec) {
    if (typeof functionExec === 'function') functionExec();

    if (buttonSelectors) {
        buttonSelectors.forEach((selector, index) => {
            if (index === pageIndex) {
                $(selector).removeClass('buttonTabActive');
                $(selector).addClass('buttonTabDisabled');
            } else {
                $(selector).removeClass('buttonTabDisabled');
                $(selector).addClass('buttonTabActive');
            }
        });
    }

    if (tabSelectors) {
        tabSelectors.forEach((selector, index) => {
            if (index === pageIndex) {
                $(selector).removeClass('hidden');
            } else {
                $(selector).addClass('hidden');
            }
        });
    }
}

/*******************
 *
 *  Boxes creator
 *
 *******************/
function createBoxes() {
    createNewIcon(true, 'fas fa-users', 'userIcon', drawUsersModal);
    createNewIcon(true, 'fas fa-user', 'statIcon', drawStatisticsModal);
    createNewIcon(true, 'fas fa-trophy', 'leaderboardIcon', drawLeaderboardModal);
    createNewIcon(true, 'fas fa-wrench', 'toolIcon', drawToolsModal);
    createNewIcon(true, 'fas fa-images', 'skinsIcon', drawSkinsModal);
}

function createNewIcon(isChild, iconImg, iconId, functionClick) {
    let icon = $('<i>').addClass(iconImg).attr('id', iconId).on('click', functionClick ? functionClick : '');
    (isChild ? $(ATTRS.selectors.mainContainer) : $(ATTRS.selectors.menuContainer)).append(icon);
}

function createNewBox(content, title, element, tip, isBig) {
    let bigStyle = isBig ? `style="margin-left: -316px; width: 962px;"` : ``;

    $(ATTRS.selectors.playerContainer).append(`
        <div data-v-73ccaaca="" data-v-5190ae12="" class="modal" ${bigStyle}>
            <div data-v-73ccaaca="" class="overlay"></div>
            <i data-v-73ccaaca="" class="fas fa-times-circle close-button" onclick="$(ATTRS.selectors.modalHud).remove()"></i>
            <div data-v-73ccaaca="" class="wrapper"><div data-v-73ccaaca="" class="content fade-box">
                <div data-v-c41b640a="" data-v-5190ae12="" data-v-15c13b66="" class="container">
                    <div class="customBoxHeader">
                        <h2 data-v-f0eb8534="" class="player-list-title customBoxTitle" ${tip ? `tip="${tip}"` : ``}>${title}</h2>
                        ${element}
                    </div>
                    ${content}
                </div>
            </div>
        </div>
    `);
}

/***************************
 *
 *  Color observer creator
 *
 ***************************/
function createColorObserver(selectorGlobal, selectorText) {
    const selector = document.querySelector(selectorGlobal);

    function applyColorToElement(element) {
        const nickname = element.textContent.trim();

        if (!APP.blacklist.includes(nickname)) {
            const data = LISTS.colors[nickname];

            if (!data) {
                if (element.classList.contains('custom')) {
                    element.classList.remove('custom');
                    element.style.color = '';
                }
                return;
            }

            element.classList.add('custom');
            element.style.color = data.color ? data.color : 'white';
        } else {
            element.style.color = 'white';
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(selectorText)) {
                            applyColorToElement(node);
                        }
                        node.querySelectorAll(selectorText).forEach(applyColorToElement);
                    }
                });
            } else if (mutation.type === 'characterData') {
                const parent = mutation.target.parentElement;
                if (parent && parent.matches(selectorText)) {
                    applyColorToElement(parent);
                }
            }
        }
    });

    observer.observe(selector, {
        childList: true,
        subtree: true,
        characterData: true,
    });
}

/***************
 *
 *  Users page
 *
 ***************/
function drawUsersModal() {
    if ($(ATTRS.selectors.userBox).length > 0) return;
    const modal = usersModal(LISTS.users);
    const list = modal.meHeader + modal.profileHeader + modal.onlineHeader + modal.onlineList + modal.offlineHeader + modal.offlineList;

    createNewBox(list, modal.counts.total + ' Players', injectAnonymousSwitch(), injectConnectionsStats());
}

function usersModal(users) {
    const me = users[USER.credentials.uid];
    let {
        listOnline,
        listOffline,
        userCount
    } = updateUserLists(users, me);

    return {
        meHeader: `<h3 class="titleSubBox">My profile</h3>`,
        onlineHeader: `<h3 class="titleSubBox">${userCount.online} Online players</h3>`,
        offlineHeader: `<h3 class="titleSubBox">${userCount.offline} Offline players</h3>`,
        profileHeader: injectUser(me, getUsersTime(me.status)),
        onlineList: listOnline,
        offlineList: listOffline,
        counts: userCount,
    };
}

function updateUserLists(users, me) {
    let listOnline = '';
    let listOffline = '';
    let userCount = {
        online: 0,
        offline: 0,
        total: 0
    };

    Object.values(users).forEach(user => {
        if (user === me) return;
        const status = getUsersTime(user.status);
        const userHTML = injectUser(user, status);

        if (status === 'Online') {
            listOnline += userHTML;
            userCount.online++;
        } else if (status) {
            listOffline += userHTML;
            userCount.offline++;
        }
        userCount.total++;
    });

    return {
        listOnline,
        listOffline,
        userCount
    };
}

function injectUser(user, status) {
    getUsersAnonymous(user);

    if (user.nickname.trim() === '') {
        user.color = 'white';
        user.nickname = 'Unnamed';
    }

    return `
        <div class="listItem userItem ${status}" tip="${getUsersTip(user, user.server, status)}">
            <img class="userPhoto beautifulSkin" alt="" src="${user.skin === '' ? ATTRS.images.transparentSkin : user.skin}" onerror="this.src = '${ATTRS.images.defaultSkin}'">
            <div class="userOnline" style="background-color: ${status === 'Online' ? ATTRS.colors.onlineColor : ATTRS.colors.offlineColor}"></div>
            <div class="listTextItem userTextElem">
                <div class="userNickLine">
                    ${user.badge ? `<img class="userBadgeDiv" alt="" src="${user.badge.url}" tip="${user.badge.tip}">` : ``}
                    <p class="userNickname" style="color: ${user.color}">${user.nickname}
                        <span class="userLevel">${user.level === 0 ? '' : ' - Lvl ' + user.level}</span>
                    </p>
                </div>
                <p class="userOnlineText">${status} on ${user.server}
                    <img class="userModeImg" alt="" src="${getUsersMode(user.mode)}" tip="${user.mode + ' mode'}">
                </p>
            </div>
        </div>
    `;
}

function injectAnonymousSwitch() {
    return `
        <div data-v-3ddebeb3="" class="p-switch pretty switchAnonymous" p-checkbox="">
            <input type="checkbox" id="anonymousSwitch" ${USER.configurations.anonymous}="" onchange="USER.configurations.anonymous = switchManager(USER.configurations.anonymous, 'anonymous')" tip="When this mode is activated, the only information visible to other players is your online status and the server you are on. The rest is hidden."> 
            <div class="state">
                <label>Anonymous</label>
            </div>
        </div>
    `;
}

function injectConnectionsStats() {
    let values = {
        total: Object.keys(LISTS.users).length,
        online: 0,
        daily: 0,
        last2days: 0,
        last7days: 0,
        last15days: 0,
    }

    let times = {
        now: new Date().getTime(),
        online: 1800000,
        daily: 2 * 24 * 60 * 60 * 1000,
        last2days: 3 * 24 * 60 * 60 * 1000,
        last7days: 8 * 24 * 60 * 60 * 1000,
        last15days: 15 * 24 * 60 * 60 * 1000,
    }

    for (let uid in LISTS.users) {
        if (LISTS.users.hasOwnProperty(uid)) {
            let time = LISTS.users[uid].status;
            if (times.now - time <= times.online) values.online++;
            if (times.now - time <= times.daily) values.daily++;
            if (times.now - time <= times.last2days) values.last2days++;
            if (times.now - time <= times.last7days) values.last7days++;
            if (times.now - time > times.last15days) values.last15days++;
        }
    }

    return `Total install: ${values.total - 1}\nOnline users: ${values.online - 1}\nDaily active users: ${values.daily - 1}\nActive last 2 days: ${values.last2days - 1}\nActive this week: ${values.last7days - 1}`;
}

/**************************
 *
 *  Users box utilitaries
 *
 **************************/
function getUsersTime(time) {
    function getTimeAgo(days, hours, minutes) {
        if (days >= 2) return undefined;
        else if (days > 0) return `${days}d ago`;
        else if (hours > 0) return `${hours}h ago`;
        else if (minutes > 0) return `${minutes} min ago`;
        return 'Offline';
    }

    const currentTimeMillis = new Date().getTime();
    const timeDifferenceMillis = currentTimeMillis - time;
    const timeDifferenceMinutes = Math.floor(timeDifferenceMillis / 60000);
    const days = Math.floor(timeDifferenceMinutes / (24 * 60));
    const remainingMinutes = timeDifferenceMinutes - days * 24 * 60;
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    if (timeDifferenceMillis < 1800000) return 'Online';

    return getTimeAgo(days, hours % 24, minutes);
}

function getUsersAnonymous(user) {
    if (user.anonymous === 'checked') {
        user.skin = ATTRS.images.anonymousSkin;
        user.nickname = 'Anonymous #' + Math.floor(Math.random() * 1000);
        user.level = 0;
        user.color = ATTRS.colors.white;
        user.mode = 'Anonymous';
        user.badge = null;
    }
}

function getUsersTip(user, userServer, status) {
    return `Nickname : ${user.nickname}\nLevel : ${user.level}\nLast connection : ${status === 'Online' ? 'Now' : status}\nServer : ${userServer}\nColor used : ${user.color}\nMode: ${user.mode ? user.mode : 'Unknown'}`;
}

function getUsersMode(userMode) {
    if (userMode === 'Single') return ATTRS.images.singleMode
    else if (userMode === 'Dual') return ATTRS.images.dualMode
    else return ATTRS.images.undefMode;
}

/********************
 *
 *  Statistics page
 *
 ********************/
function drawStatisticsModal() {
    if ($(ATTRS.selectors.toolBox).length > 0) return;
    const modal = statisticsModal(USER.statistics);

    createNewBox(modal.list, 'Profile & stats', modal.logout);
}

function statisticsModal(statistics) {
    return {
        list: generateStatisticsList(statistics),
        logout: generateLogoutButton()
    }
}

function generateLogoutButton() {
    return `
        <div class="divLogout" onclick="firebaseSignOut()">
            <p>Logout</p>
            <i class="fas fa-sign-out-alt signOutButton"></i>
        </div>
    `;
}

function generateStatisticsList(statistics) {
    return `
        <div class="stat-container">
            ${generateProfileSection()}
            ${generateStatisticsSection(statistics)}
            <p class="resetAllStatistics" onclick="swalResetStatistics()">Reset all statistics <i class="fas fa-sync-alt resetAllStatisticsIcon"></i></p>
        </div>
    `;
}

function generateProfileSection() {
    return `
        <div data-v-2c5139e0="" class="section row">
            <div data-v-2c5139e0="" class="header">Profil
                <span data-v-22117250="" class="right silent silentUid confidential">${USER.credentials.uid}</span>
            </div>
            <div data-v-2c5139e0="" class="options">
                <p class="stat-p">
                    ${$(ATTRS.selectors.discordName).length === 0 ? 'Disconnected' : 'Connected'}
                    <span class="stat-span"> to Discord
                    <i class="fab fa-discord"></i>
                    </span>
                </p>
                <p class="stat-p confidential">
                    <span class="stat-span" style="text-shadow: none!important">Account email :</span>
                    ${USER.credentials.email}
                </p>
            </div>
        </div>
    `;
}

function generateStatisticsSection(statistics) {
    return `
        <div data-v-2c5139e0="" class="section row">
            <div data-v-2c5139e0="" class="header">Statistics   
                <i class="fas fa-chart-bar headerIcon"></i>
            </div>
            <div data-v-2c5139e0="" class="options">
                ${generateStatisticItem('Kills', statistics.killTotal)}
                ${generateStatisticItem('Deaths', statistics.gameTotal)}
                ${generateStatisticItem('K/D', statistics.kda.toFixed(2), 'The KDA represents the number of kills in relation to the number of deaths.')}
                ${generateStatisticItem('Mass eaten', getFormatedMass(statistics.massTotal))}
                ${generateStatisticItem('Mass eaten / game', getFormatedMass(statistics.massAvg))}
                ${generateStatisticItem('Time played', getElapsedTime(statistics.timeTotal))}
                ${generateStatisticItem('Time played / game', getElapsedTime(statistics.timeAvg))}
            </div>
        </div>
    `;
}

function generateStatisticItem(label, value, tooltip = '') {
    return `
        <p class="stat-p" ${tooltip ? `tip="${tooltip}"` : ''}>
            <span class="stat-span">${label}: </span>
            ${value}
        </p>
    `;
}

/*******************
 *
 *  Statistics box
 *
 *******************/
function getConvertedTimeToSeconds(str) {
    if (typeof str !== 'string') return 0;
    return str.split(' ').reduce((total, part) => {
        const value = parseFloat(part);
        if (part.endsWith('s')) return total + value;
        if (part.endsWith('min')) return total + value * 60;
        if (part.endsWith('h')) return total + value * 3600;
        return total;
    }, 0);
}

function getConvertedStringToNumber(str) {
    if (typeof str !== 'string') return 0;
    const value = parseFloat(str);
    if (Number.isNaN(value)) return 0;
    if (str.endsWith('k')) return value * 1e3;
    if (str.endsWith('M')) return value * 1e6;
    return value;
}

function getElapsedTime(seconds, showYears = true, showMonths = true, showDays = true, showHours = true, showMinutes = true, showSeconds = true) {
    let years = 0,
        months = 0,
        days = 0,
        hours = 0,
        minutes = 0;
    if (showYears) years = Math.floor(seconds / 31536000), seconds %= 31536000;
    if (showMonths) months = Math.floor(seconds / 2629800), seconds %= 2629800;
    if (showDays) days = Math.floor(seconds / 86400), seconds %= 86400;
    if (showHours) hours = Math.floor(seconds / 3600), seconds %= 3600;
    if (showMinutes) minutes = Math.floor(seconds / 60), seconds %= 60;
    if (showSeconds) seconds = Math.round(seconds);
    let result = '';
    if (showYears && years > 0) result += `${years}y `;
    if (showMonths && months > 0) result += `${months}m `;
    if (showDays && days > 0) result += `${days}d `;
    if (showHours && hours > 0) result += `${hours}h `;
    if (showMinutes && minutes > 0) result += `${minutes}min `;
    if (showSeconds && seconds > 0) result += `${seconds}s`;
    return result.trim();
}

function getFormatedMass(value) {
    if (value >= 1e15) return formatNumber(value, 1e15, "Qd");
    else if (value >= 1e12) return formatNumber(value, 1e12, "Td");
    else if (value >= 1e9) return formatNumber(value, 1e9, "Md");
    else if (value >= 1e6) return formatNumber(value, 1e6, "M");
    else if (value >= 1e3) return formatNumber(value, 1e3, "k");
    else return Math.round(value).toString();
}

function formatNumber(value, divisor, unit) {
    let primary = value / divisor;
    let rest = value % divisor;
    let secondary = Math.round(rest / (divisor / 10));
    if (secondary > 0) return `${Math.round(primary)},${secondary}${unit} `;
    return `${Math.round(primary)}${unit}`;
}

function swalResetStatistics() {
    Swal.fire({
        title: 'Confirm reset ?',
        text: 'Do you want to permanently delete your statistics ?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButton: 'No',
    }).then((result) => {
        if (result.value === true) {
            confirmResetStatistics();
        }
    });
}

function confirmResetStatistics() {
    DB.references.meStat.remove()
        .then(() => {
            sendTimedSwal("Deleted", "Your statistics have been successfully deleted, the page will reload...", 1500, false);
            setTimeout(() => window.location.reload(), 1500);
        })
        .catch((e) => {
            sendTimedSwal('Error', 'Deleting your statistics failed: ' + e.message, 10000, 'OK');
        });
}

/**********************
 *
 *  Leaderboard page
 *
 **********************/
function drawLeaderboardModal() {
    if ($(ATTRS.selectors.toolBox).length > 0) return;

    if (LISTS.leaderboard === undefined) {
        DB.references.statistics.once('value', snapshot => {
            if (snapshot.exists()) {
                LISTS.leaderboard = snapshot.val();
                addLeaderboardModal();
            }
        });
    } else {
        addLeaderboardModal();
    }
}

function addLeaderboardModal() {
    const buttons = [{
        id: 0,
        text: 'K/D',
        filter: 'kda',
        class: 'leaderbordKdaButton'
    },
        {
            id: 1,
            text: 'Kills',
            filter: 'killTotal',
            class: 'leaderbordKillsButton'
        },
        {
            id: 2,
            text: 'Deaths',
            filter: 'gameTotal',
            class: 'leaderbordGamesButton'
        },
        {
            id: 3,
            text: 'Mass total',
            filter: 'massTotal',
            class: 'leaderbordMassTotalButton'
        },
        {
            id: 4,
            text: 'Mass avg',
            filter: 'massAvg',
            class: 'leaderbordMassAvgButton'
        },
        {
            id: 5,
            text: 'Time total',
            filter: 'timeTotal',
            class: 'leaderbordTimeButton'
        }
    ];

    const buttonHTML = buttons.map(button => `
        <div class="${button.class} buttonTab ${button.id === 0 ? 'buttonTabDisabled' : 'buttonTabActive'}" onclick="handleButtonClick(${button.id}, '${button.filter}')">
            <p class="buttonTabText">${button.text}</p>
        </div>
    `).join('');

    const modal = `
        <div class="buttonTabContainer">${buttonHTML}</div>
        <div class="leaderboardList"></div>
    `;

    createNewBox(modal, 'Deltaboard top 50', '');
    injectCustomLeaderboard('kda');
}

function handleButtonClick(id, filter) {
    showPage(id, [ATTRS.selectors.leaderbordKdaButton, ATTRS.selectors.leaderbordKillsButton, ATTRS.selectors.leaderbordGamesButton, ATTRS.selectors.leaderbordMassTotalButton, ATTRS.selectors.leaderbordMassAvgButton, ATTRS.selectors.leaderbordTimeButton], null);
    injectCustomLeaderboard(filter);
}

function injectCustomLeaderboard(filter) {
    const sortingFunctions = {
        'kda': (a, b) => b.kda - a.kda,
        'killTotal': (a, b) => b.killTotal - a.killTotal,
        'gameTotal': (a, b) => b.gameTotal - a.gameTotal,
        'massTotal': (a, b) => b.massTotal - a.massTotal,
        'timeTotal': (a, b) => b.timeTotal - a.timeTotal,
        'massAvg': (a, b) => b.massAvg - a.massAvg
    };

    const sortedLeaderboard = Object.values(LISTS.leaderboard)
        .sort(sortingFunctions[filter] || sortingFunctions['kda'])
        .slice(0, 50);

    const leaderboardHTML = sortedLeaderboard.map((element, index) =>
        injectLeaderboard(element, element.uid, index + 1, filter)
    ).join('');

    $(ATTRS.selectors.leaderboardList).html(leaderboardHTML);
}

function injectLeaderboard(item, itemId, position, filter) {
    const itemUser = LISTS.users[item.uid];
    if (!itemUser) return ``;
    let statisticValue;

    switch (filter) {
        case 'killTotal':
            statisticValue = item.killTotal;
            break;
        case 'gameTotal':
            statisticValue = item.gameTotal;
            break;
        case 'kda':
            statisticValue = item.kda.toFixed(2) + ' K/D';
            break;
        case 'massTotal':
            statisticValue = getFormatedMass(item.massTotal);
            break;
        case 'massAvg':
            statisticValue = getFormatedMass(item.massAvg);
            break;
        case 'timeTotal':
            statisticValue = getElapsedTime(item.timeTotal, false, false, false, true, true, false);
            break;
        default:
            statisticValue = item.kda.toFixed(2) + ' K/D';
    }

    if (itemUser.nickname.trim() === '') {
        itemUser.color = 'white';
        itemUser.nickname = 'Unnamed';
    }

    return `
        <div class="leaderboardItem ${itemUser.uid === USER.credentials.uid ? 'leaderboardItemMe' : ''}">
            <p class="leaderboardPosition">${position}. </p>
            ${itemUser.badge ? `<img class="leaderboardBadgeDiv" alt="" src="${itemUser.badge.url}" tip="${itemUser.badge.tip}">` : ``}
            <p class="leaderboardNickname ${itemUser.uid === USER.credentials.uid ? 'leaderboardNicknameMe' : ''}" style="color: ${itemUser.color}">${itemUser.nickname}</p>
            <p class="leaderboardStatisticValue ${itemUser.uid === USER.credentials.uid ? 'leaderboardStatisticValueMe' : ''}">${statisticValue}</p>
        </div>
    `;
}

/***************
 *
 *  Tools page
 *
 ***************/
function drawToolsModal() {
    if ($(ATTRS.selectors.toolBox).length > 0) return;

    if (LISTS.badges === undefined || LISTS.configurations === undefined) {
        DB.references.badges.once('value', snapshot => {
            if (snapshot.exists()) {
                LISTS.badges = snapshot.val();
                DB.references.meConfig.once('value', snapshot => {
                    if (snapshot.exists()) {
                        LISTS.configurations = snapshot.val();
                        addToolsModal();
                    }
                });
            }
        });
    } else {
        addToolsModal();
    }
}

function addToolsModal() {
    const configurations = fetchItem(LISTS.configurations, injectConfiguration);
    const nbCofigurations = Object.keys(LISTS.configurations).length || 0;
    const badges = fetchItem(LISTS.badges, injectBadge);
    const modal = toolsModal(configurations, nbCofigurations, badges);

    createNewBox(modal, 'Delta settings', '');
}

function toolsModal(tools, total, badges) {
    const colorParam = `
        <div data-v-3ddebeb3="" class="p-switch pretty" p-checkbox="" tip="Don't activate this option if you do not have a powerful enough computer">
            <input type="checkbox" id="colorSwitchNickChatbox" ${USER.configurations.colorNicknameChatbox}="" onchange="USER.configurations.colorNicknameChatbox = switchManager(USER.configurations.colorNicknameChatbox, 'colorNicknameChatbox')"> 
            <div class="state">
                <label>Show colors in the chat</label>
            </div>
        </div>
        <div data-v-3ddebeb3="" class="p-switch pretty" p-checkbox="" tip="Don't activate this option if you do not have a powerful enough computer">
            <input type="checkbox" id="colorSwitchNickLeaderboard" ${USER.configurations.colorNicknameLeaderboard}="" onchange="USER.configurations.colorNicknameLeaderboard = switchManager(USER.configurations.colorNicknameLeaderboard, 'colorNicknameLeaderboard')"> 
            <div class="state">
                <label>Show colors in the leaderboard</label>
            </div>
        </div>
        <div data-v-3ddebeb3="" class="p-switch pretty" p-checkbox="">
            <input type="checkbox" id="colorSwitchNickCell" ${USER.configurations.colorNicknameCell}="" onchange="USER.configurations.colorNicknameCell = switchManager(USER.configurations.colorNicknameCell, 'colorNicknameCell')"> 
            <div class="state">
                <label>Show colors in the cells</label>
            </div>
        </div>
        <div data-v-22117250="" class="silent silentCustomTop silentCustomBottom">After change color settings, refresh the page.</div>
    `;

    return `
        <div class="tool-container">
            <div class="tool-section">
                <div class="buttonTabContainer">
                    <div class="buttonTab buttonTabDisabled toolsNavPerksTab" onclick="showPage(0, [ATTRS.selectors.toolsPageButtonPerks, ATTRS.selectors.toolsPageButtonSettings, ATTRS.selectors.toolsPageButtonConfigurations], [ATTRS.selectors.toolsPagePerks, ATTRS.selectors.toolsPageSettings, ATTRS.selectors.toolsPageConfigurations])">
                        <p class="buttonTabText">Perks</p>
                    </div>
                    <div class="buttonTab buttonTabActive toolsNavSettingsTab" onclick="showPage(1, [ATTRS.selectors.toolsPageButtonPerks, ATTRS.selectors.toolsPageButtonSettings, ATTRS.selectors.toolsPageButtonConfigurations], [ATTRS.selectors.toolsPagePerks, ATTRS.selectors.toolsPageSettings, ATTRS.selectors.toolsPageConfigurations])">
                        <p class="buttonTabText">Settings</p>
                    </div>
                    <div class="buttonTab buttonTabActive toolsNavConfigurationsTab" onclick="showPage(2, [ATTRS.selectors.toolsPageButtonPerks, ATTRS.selectors.toolsPageButtonSettings, ATTRS.selectors.toolsPageButtonConfigurations], [ATTRS.selectors.toolsPagePerks, ATTRS.selectors.toolsPageSettings, ATTRS.selectors.toolsPageConfigurations])">
                        <p class="buttonTabText">Backups</p>
                    </div>
                </div>
                <div class="toolsPagePerks">
                    <div data-v-2c5139e0="" class="section row">
                        <div data-v-2c5139e0="" class="header">Colored name<i class="fas fa-paint-brush headerIcon"></i></div>
                        <div data-v-2c5139e0="" class="options">
                            <div class="colorPickerContainer">
                                <input type="text" id="colorPickerInput" value="${USER.configurations.nicknameColor}" placeholder="${ATTRS.colors.defaultColor}" onchange="onColorChanged(this)">
                                <div class="colorPickerGui">
                                    <input type="color" id="colorPickerSelector" value="${USER.configurations.nicknameColor}" onchange="onColorChanged(this)">
                                </div>
                            </div>
                        <div data-v-22117250="" class="silent silentCustomTop">After change, re-join the server</div>
                        </div> 
                    </div>
                    <div data-v-2c5139e0="" class="section row">
                        <div data-v-2c5139e0="" class="header">Badges<i class="fas fa-certificate headerIcon"></i></div>
                        <div data-v-2c5139e0="" class="options">
                            <div class="badgeListPerks">
                                ${badges}
                            </div>
                        </div> 
                    </div>
                    <div data-v-2c5139e0="" class="section row">
                        <div data-v-2c5139e0="" class="header">Hats<i class="fas fa-hat-cowboy-side headerIcon"></i></div>
                        <div data-v-2c5139e0="" class="options">
                            <div class="hatListPerks">
                                Soon
                            </div>
                        </div> 
                    </div>
                </div>
                <div class="toolsPageSettings hidden">
                    <div data-v-2c5139e0="" class="section row">
                        <div data-v-2c5139e0="" class="header">Configuration<i class="fas fa-cog headerIcon"></i>
                        </div>
                        <div data-v-2c5139e0="" class="options">
                            ${APP.mode === 1 ? colorParam : ``}
                            <div data-v-3ddebeb3="" class="p-switch pretty" p-checkbox="">
                                <input type="checkbox" id="blurredHUD" ${USER.configurations.blurredHUD}="" onchange="USER.configurations.blurredHUD = switchManager(USER.configurations.blurredHUD, 'blurredHUD')" tip=""> 
                                <div class="state">
                                    <label>Blurred in-game HUD</label>
                                </div>
                            </div>
                            <div data-v-3ddebeb3="" class="p-switch pretty" p-checkbox="">
                                <input type="checkbox" id="resizableChatbox" ${USER.configurations.resizableChatbox}="" onchange="USER.configurations.resizableChatbox = switchManager(USER.configurations.resizableChatbox, 'resizableChatbox')" tip=""> 
                                <div class="state">
                                    <label>Resizable chatbox</label>
                                </div>
                            </div>
                            <div data-v-3ddebeb3="" class="p-switch pretty" p-checkbox="">
                                <input type="checkbox" id="autoSynchronization" ${USER.configurations.autoSynchronization}="" onchange="USER.configurations.autoSynchronization = switchManager(USER.configurations.autoSynchronization, 'autoSynchronization')" tip="By saving your locales configurations to the database, you will be able to access them anywhere"> 
                                <div class="state">
                                    <label>Auto save my configurations</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="toolsPageConfigurations hidden">
                    <div data-v-2c5139e0="" class="section row">
                        <div data-v-2c5139e0="" class="header">${total} backups saved<i class="fas fa-save headerIcon"></i>
                        </div>
                        <div data-v-2c5139e0="" class="options">
                            ${tools}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/***************
 *
 *  Skins page
 *
 ***************/
async function drawSkinsModal() {
    if ($(ATTRS.selectors.skinBox).length > 0) return;

    createNewBox(injectSkinPages(), 'Public skins', '', '', true);
    loadAllSkins();
}

function injectSkinPages() {
    return `
        <div class="buttonTabContainer">
            <div class="buttonTab buttonTabDisabled skinsNavAllButton" onclick="showPage(0, [ATTRS.selectors.skinsNavAllButton, ATTRS.selectors.skinsNavMeButton, ATTRS.selectors.skinsNavFavButton], [ATTRS.selectors.skinsNavAllPage, ATTRS.selectors.skinsNavMePage, ATTRS.selectors.skinsNavFavPage], loadAllSkins)">
                <p class="buttonTabText">Public skins</p>
            </div>
            <div class="buttonTab buttonTabActive skinsNavMeButton" onclick="showPage(1, [ATTRS.selectors.skinsNavAllButton, ATTRS.selectors.skinsNavMeButton, ATTRS.selectors.skinsNavFavButton], [ATTRS.selectors.skinsNavAllPage, ATTRS.selectors.skinsNavMePage, ATTRS.selectors.skinsNavFavPage], loadMySkins)">
                <p class="buttonTabText">Your skins</p>
            </div>
            <div class="buttonTab buttonTabActive skinsNavFavButton" onclick="showPage(2, [ATTRS.selectors.skinsNavAllButton, ATTRS.selectors.skinsNavMeButton, ATTRS.selectors.skinsNavFavButton], [ATTRS.selectors.skinsNavAllPage, ATTRS.selectors.skinsNavMePage, ATTRS.selectors.skinsNavFavPage], loadFavSkins)">
                <p class="buttonTabText">Favorite skins</p>
            </div>
        </div>
        <div class="skinsNavAllPage skinsLibraryList"></div>
        <div class="skinsNavMePage skinsLibraryList"></div>
        <div class="skinsNavFavPage skinsLibraryList"></div>
    `;
}

/*******************************
 *
 *  Skins page renderer system
 *
 *******************************/
function renderSkinsFromList(content, list) {
    if (!Array.isArray(content) || content.length === 0) return;
    if ($(list).find('img').length !== content.length) {
        content.forEach(skin => {
            itemSkinModal(skin, list);
        });
    }
}

function itemSkinModal(skin, list) {
    if (!skin.id) return;
    const skinUrl = `https://skins.vanis.io/s/${skin.id}`;

    $(list).append(`
        <img class="skinItemLibrary beautifulSkin" src="${skinUrl}" alt="${skin.id}" tip="${skinUrl}" onclick="openSkin('${skinUrl}', '${skin.id}')">
    `);
}

/***********************
 *
 *  Skins page loader
 *
 ***********************/
async function fetchSkins(url, errorMessage) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': APP.skinAuth,
                'Origin': 'https://skins.vanis.io/'
            }
        });

        if (!response.ok) {
            sendTimedSwal('Error', `Server responded with ${response.status}: ${response.statusText}`, 10000, 'OK');
            return null;
        }

        return await response.json();
    } catch (error) {
        sendTimedSwal(errorMessage, error.toString(), 3000, false);
        return null;
    }
}

async function loadSkins(title, storage, apiUrl, errorMessage, pageSelector) {
    $(ATTRS.selectors.boxTitle).text(title);

    if (storage.length > 0) {
        renderSkinsFromList(title, storage, pageSelector);
        return;
    }

    const data = await fetchSkins(apiUrl, errorMessage);

    if (data) {
        storage.push(...data);
        data.forEach(skin => itemSkinModal(skin, pageSelector));
    }
}

async function loadMySkins() {
    await loadSkins('My skins', SKINS.me, 'https://cors-proxy.fringe.zone/https://skins.vanis.io/api/me/skins', 'Fetching my skins error', ATTRS.selectors.skinsNavMePage);
}

async function loadFavSkins() {
    await loadSkins('Favorite skins', SKINS.fav, 'https://cors-proxy.fringe.zone/https://skins.vanis.io/api/me/favorites', 'Fetching my favorites skins error', ATTRS.selectors.skinsNavFavPage);
}

async function loadAllSkins() {
    $(ATTRS.selectors.boxTitle).text('Public skins');

    if (SKINS.all.length > 0) {
        renderSkinsFromList(SKINS.all, ATTRS.selectors.skinsNavAllPage);
        return;
    }

    for (let pageNumber = 0; pageNumber <= 50; pageNumber++) {
        const data = await fetchSkins(`https://cors-proxy.fringe.zone/https://skins.vanis.io/api/public-skins?page=${pageNumber}`, `Page ${pageNumber} error`);
        if (data) {
            SKINS.all.push(...data);
            data.forEach(skin => itemSkinModal(skin, ATTRS.selectors.skinsNavAllPage));
        }
    }
}

/*************************
 *
 *  Skins page functions
 *
 *************************/
function openSkin(skinUrl, skinId) {
    $(ATTRS.selectors.overlay).append(`
        <div class="overlaySkin">
            <i class="fas fa-times closeSkinItemModal" onclick="$(ATTRS.selectors.overlaySkin).remove()"></i>
            <div class="absoluteCenter">
                <img class="skinItemModal beautifulSkin" src="${skinUrl}" alt="${skinId}">
                <div class="skinItemActions">
                    <div class="skinItemNav skinItemNavId">
                        <p class="skinItemURL">Skin ID: ${skinId}</p>
                    </div>
                    <div class="skinItemNav skinItemNavBtn" onclick="yoinkSkin('${skinUrl}')">
                        <div class="skinItemYoink">
                            <i class="fas fa-link"></i>
                            <p class="skinItemTextButton">Yoink</p>
                        </div>
                    </div>
                    <div class="skinItemNav skinItemNavBtn" onclick="copySkin('${skinUrl}')">
                        <div class="skinItemCopy">
                            <i class="fas fa-copy"></i>
                            <p class="skinItemTextButton">Copy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function copySkin(skinUrl) {
    navigator.clipboard.writeText(skinUrl).then(() => {
        sendTimedSwal('Skin copied', 'The skin has been copied to the clipboard', 1500, false)
    }).catch((e) => {
        sendTimedSwal('Error', 'An error occurred while copying the skin: ' + e.message, 10000, 'OK')
    })
}

function yoinkSkin(skinUrl) {
    const allSkins = getLocalStorageItem('skins', '["https://skins.vanis.io/s/Qkfih2","https://skins.vanis.io/s/Qkfih2"]');
    let arraySkins = JSONSafeParser(allSkins);
    if (arraySkins != {}) {
        arraySkins.push(skinUrl);
        localStorage.setItem('skins', JSON.stringify(arraySkins));
        sendTimedSwal('Skin yoinked', 'The skin has been yoinked, need to refresh the page to save', 1500, false);
    }
}

/********************
 *
 *  Injector system
 *
 ********************/
function injectConfiguration(item, itemId) {
    const skins = injectSkin(item.skins);
    const tag = injectTag(item.teamtag);

    function getHotkeysCount(hotkeys) {
        if (!hotkeys) return 0
        const hotkeysJSON = JSONSafeParser(hotkeys);
        if (hotkeysJSON === {}) return 0;
        return Object.keys(hotkeysJSON).filter(key => hotkeysJSON[key] !== '').length;
    }

    return `
        <div class="listItem configItem" id="${itemId}">
            <div class="configContent">
                <div class="configInformations">
                    <p class="configName">${item.machineId}</p>
                    <p class="configDate">${item.date}</p>
                </div>
                <div class="configContentList">
                    ${APP.machineId === item.machineId ? `<p class="configActual configCard">Actual backup</p>`: ``}
                    ${item.nickname && item.nickname !== '' ? `<p class="configNickname configCard" style="color: ${item.nicknameColor ? item.nicknameColor : `#ffffff`}">Name: ${item.nickname}</p>` : ``}
                    ${item.teamtag ? `<p class="configTeamTag configCard">Tag: ${item.teamtag}</p>` : ``}
                    <p class="configHotkeys configCard">${getHotkeysCount(item.hotkeys)} hotkeys</p>
                    <p class="configSkins configCard">${skins.count} skins</p>
                </div>
                ${skins.list}
            </div>
            <div class="configAction">
                <div class="configGet configActionButton" onclick="updateConfiguration('${itemId}')">
                    <p class="configActionButtonText">Apply</p>
                </div>
                <div class="configDelete configActionButton" onclick="deleteConfiguration('${itemId}')">
                    <p class="configActionButtonText">Delete</p>
                </div>
            </div>
        </div>
    `;
}

function injectSkin(skins) {
    if (!skins) return {
        list: '',
        count: 0,
    };

    const skinUrls = JSON.parse(skins);

    if (skinUrls !== {}) {
        const skinElements = skinUrls.slice(0, 50).map(url => `<img src="${url}" alt="" class="configSkinItem beautifulSkin" tip="${url}" onerror="this.src = '${ATTRS.images.defaultSkin}'">`);

        return {
            list: `<div class="listSkins">${skinElements.join('')}</div>`,
            count: Object.keys(skinUrls).length,
        };
    }
}

function injectTag(tag) {
    if (tag && tag !== '') return `<p class="configTag">Tag: ${tag}</p>`;
    return ``;
}

function injectBadge(item, itemId) {
    const isOwner = item.owners[USER.credentials.uid];
    const userBadge = LISTS.users[USER.credentials.uid].badge;
    const isSelected = userBadge && userBadge.id === item.id;
    const onClickAttribute = isOwner ?
        `onclick="pushUserBadge('${escape(JSON.stringify(item))}')" ` :
        `onclick="sendTimedSwal('Badge not found', 'You don\\'t have this badge in your collection', 1500, 'OK')"`;

    return `
        <img class="badgeItem badge${item.id}" src="${item.url}" tip="${item.tip}" ${onClickAttribute} style="opacity: ${isSelected ? 1 : 0.4};"/>
    `;
}

/**************************
 *
 *  Delete configurations
 *
 **************************/
function deleteSuccess(configId) {
    const node = $('#' + configId);

    DB.references.meConfig.child(configId).remove()
        .then(() => {
            if (node.length) {
                node.remove();
                sendTimedSwal('Deleted', 'The configuration have been successfully deleted', 1500, false);
            }
        })
        .catch((e) => {
            sendTimedSwal('Error', 'Deleting your configuration failed: ' + e.message, 10000, 'OK');
        });
}

function deleteConfiguration(configId) {
    Swal.fire({
        title: 'Confirm deletion ?',
        text: 'Do you want to remove this configuration definitely ?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButton: 'No',
    }).then((result) => {
        if (result.value === true) {
            deleteSuccess(configId);
        }
    });
}

/**************************
 *
 *  Update configurations
 *
 **************************/
function updateSuccess(configId) {
    const config = LISTS.configurations[configId];

    ['skins', 'hotkeys', 'blurredHUD', 'resizableChatbox', 'colorNicknameCell', 'colorNicknameChatbox', 'colorNicknameLeaderboard', 'nicknameColor', 'nickname', 'teamtag'].forEach(key => {
        if (config[key] && config[key] !== '' && config[key] !== '{}') {
            localStorage.setItem(key, config[key]);
        }
    });

    localStorage.removeItem('MachineId');
    localStorage.setItem('MachineId', getMachineId());

    sendTimedSwal('Success', "The configuration has been changed, the page will reload...", 1500, false);
    setTimeout(() => window.location.reload(), 1500);
}

function callSwal(configId) {
    Swal.fire({
        title: 'Confirm update ?',
        text: 'Do you want to load this configuration into the game ?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButton: 'No',
    }).then((result) => {
        if (result.value === true) {
            updateSuccess(configId);
        }
    });
}

function updateConfiguration(configId) {
    callSwal(configId);
}

/*****************
 *
 *  Sortable lib
 *
 *****************/
function updateSkinsLocally() {
    let urlList = '[';

    $(ATTRS.selectors.skinElem).each(function() {
        const url = $(this).attr('src');

        if (url && url !== '/img/skin-add.png') {
            if (urlList !== '[') urlList += ',';
            urlList += '"' + url + '"';
        }
    });

    urlList += ']';
    localStorage.setItem('skins', urlList);
}

function createSortable() {
    const container = document.getElementById('skins');

    new Sortable(container, {
        handle: '.skin-container',
        onEnd: function(e) {
            updateSkinsLocally();
        },
    });
}

function createChatboxResizable() {
    const chatContainer = $(ATTRS.selectors.chatboxContainer);

    chatContainer.on('mousedown', function(e) {
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(chatContainer.css('width'), 10);
        const startHeight = parseInt(chatContainer.css('height'), 10);

        $(document).on('mousemove', resize);
        $(document).on('mouseup', stopResize);

        function resize(e) {
            const newWidth = startWidth + e.clientX - startX;
            const newHeight = startHeight + startY - e.clientY;

            chatContainer.css('width', `${newWidth}px`);
            chatContainer.css('height', `${newHeight}px`);
        }

        function stopResize() {
            $(document).off('mousemove', resize);
            $(document).off('mouseup', stopResize);
        }
    });
}

/***********************
 *
 *  User color manager
 *
 ***********************/
function changeUserColor(color) {
    USER.configurations.nicknameColor = color;
    localStorage.setItem('nicknameColor', color);

    $(ATTRS.selectors.nicknameProfile).css('color', APP.reserved.value ? APP.reserved.color : color);
    $(ATTRS.selectors.colorPickerInput).val(color);
    $(ATTRS.selectors.colorPickerSelector).val(color);

    pushUserColors();
    pushUserOnline();
}

/***********************
 *
 *  Cell color manager
 *
 ***********************/
function changeCellColor(nicknameToUpdate) {
    const originalFillText = CanvasRenderingContext2D.prototype.fillText;

    CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
        if (!APP.blacklist.includes(text)) {
            if (text === USER.configurations.nickname) this.fillStyle = USER.configurations.nicknameColor;
            else if (text === nicknameToUpdate && LISTS.colors[nicknameToUpdate] && LISTS.colors[nicknameToUpdate].color) this.fillStyle = LISTS.colors[nicknameToUpdate].color;
            else if (LISTS.colors[text] && LISTS.colors[text].color) this.fillStyle = LISTS.colors[text].color;
        }

        originalFillText.apply(this, arguments);
    };
}

/**********************
 *
 *  User data manager
 *
 **********************/
function pushUserData() {
    pushUserInfos();
    pushUserColors();
    pushUserConfigurations();
}

function fetchUserData() {
    fetchUsersOnce();
    fetchUserStatisticsDb();
    fetchColorsOnce(() => {
        getReservedName();
        pushUserData();
    });
}

/*****************
 *
 *  Data manager
 *
 *****************/
function JSONSafeParser(elem) {
    try {
        const obj = JSON.parse(elem);
        return obj;
    } catch (e) {
        sendTimedSwal('Error', 'JSON parsing error: ' + e.message, 10000, 'OK');
        return {};
    }
}

function getLocalStorageItem(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
}

function getLocalValues(user) {
    USER.credentials = user;
    USER.server = 'Lobby';
    USER.mode = APP.mode === 1 ? 'Single' : 'Dual';

    switchManagerSpecificChange(USER.configurations.blurredHUD, 'blurredHUD');
}

/*********************
 *
 *  Database manager
 *
 *********************/
function getDatabase() {
    DB.database = firebase.database();
    DB.references = getAllReferences();
}

function pushDatabase(ref, data) {
    if (window.firebase) {
        ref.update(data);
    }
}

/******************
 *
 *  Switch manager
 *
 ******************/
function switchManager(userSettings, userSettingsLabel) {
    if (userSettings === 'checked') {
        userSettings = 'unchecked';
    } else {
        userSettings = 'checked';
    }

    switchManagerSpecificChange(userSettings, userSettingsLabel);
    localStorage.setItem(userSettingsLabel, userSettings);

    return userSettings;
}

function switchManagerSpecificChange(userSettings, userSettingsLabel) {
    if (userSettingsLabel === 'anonymous') {
        pushDatabase(DB.references.meUser, {
            anonymous: userSettings,
        });
    } else if (userSettingsLabel === 'blurredHUD') {
        let style = (userSettings === 'checked') ? 'blur(7px)' : '';

        $(ATTRS.selectors.leaderboard).css('backdrop-filter', style);
        $(ATTRS.selectors.chatboxContainer).css('backdrop-filter', style);
        $(ATTRS.selectors.minimapContainer).css('backdrop-filter', style);
        $(ATTRS.selectors.messageToast).css('backdrop-filter', style);
        if (APP.mode === 2) $(ATTRS.selectors.playerStalkContainer).css('backdrop-filter', style);
    }
}

/******************
 *
 *  Swal2 manager
 *
 ******************/
function sendTimedSwal(title, text, timer, confirm) {
    Swal.fire({
        title: title,
        text: text,
        timer: timer,
        showConfirmButton: confirm,
    });
}

/******************
 *
 *  Error manager
 *
 ******************/
function displayError(message) {
    const bodyElement = $(ATTRS.selectors.bodyHud);

    bodyElement.empty();
    bodyElement.css('background-color', 'black');

    const element = $('<error>').text(message).css({
        'font-size': '28px',
        'color': 'white',
        'text-align': 'left',
        'margin': '50px',
        'position': 'absolute',
    });

    bodyElement.append(element);
    throw new Error(message);
}

/***************************
 *
 *  Navigator data manager
 *
 ***************************/
function getMachineId() {
    let machineId = localStorage.getItem('MachineId');

    if (!machineId) {
        machineId = crypto.randomUUID();
        localStorage.setItem('MachineId', machineId);
    }

    return machineId;
}

/***********************
 *
 *  Local data manager
 *
 ***********************/
function getAllConfigurations() {
    return {
        machineId: APP.machineId,
        date: new Date().toLocaleDateString('fr-FR'),
        skins: getLocalStorageItem('skins', '{}'),
        hotkeys: getLocalStorageItem('hotkeys', '{}'),
        nicknameColor: getLocalStorageItem('nicknameColor', ATTRS.colors.defaultColor),
        nickname: getLocalStorageItem('nickname', ''),
        anonymous: getLocalStorageItem('anonymous', 'unchecked'),
        colorNicknameLeaderboard: getLocalStorageItem('colorNicknameLeaderboard', 'unchecked'),
        colorNicknameChatbox: getLocalStorageItem('colorNicknameChatbox', 'unchecked'),
        colorNicknameCell: getLocalStorageItem('colorNicknameCell', 'checked'),
        autoSynchronization: getLocalStorageItem('autoSynchronization', 'checked'),
        blurredHUD: getLocalStorageItem('blurredHUD', 'checked'),
        resizableChatbox: getLocalStorageItem('resizableChatbox', 'unchecked'),
    }
}

function getAllReferences() {
    const uid = USER.credentials.uid;
    const db = DB.database;

    return {
        color: db.ref("Colors"),
        user: db.ref(`Users`),
        statistics: db.ref(`Statistics`),
        badges: db.ref(`Badges`),
        meUser: db.ref(`Users/${uid}`),
        meUserBadge: db.ref(`Users/${uid}/badge`),
        meColorBadge: db.ref(`Colors/${uid}/badge`),
        meColor: db.ref(`Colors/${uid}`),
        meStat: db.ref(`Statistics/${uid}`),
        meConfig: db.ref(`Configurations/${uid}`),
        meConfigItem: db.ref(`Configurations/${uid}/${APP.machineId}`),
    }
}

function getAllLibrary() {
    return {
        firebaseApp: 'https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js',
        firebaseDatabase: 'https://www.gstatic.com/firebasejs/8.6.1/firebase-database.js',
        firebaseAuth: "https://www.gstatic.com/firebasejs/8.6.1/firebase-auth.js",
        jquery: 'https://code.jquery.com/jquery-3.7.1.min.js',
        css: 'https://raw.githubusercontent.com/Fohz67/Delta-Client-Content/main/styles.css',
        deltaDual: 'https://vanis.io/delta-dual',
        sortable: 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js',
    }
}

function getAllSelectors() {
    return {
        // Global Elements
        head: 'head',
        link: 'link[rel*=\'icon\']',
        overlay: '#overlay',

        // Account Information
        level: '.xp-data>div:first-child',
        teamTag: '#teamtag',
        xp: '.xp-data>div:last-child',

        // Chatbox Elements
        chatboxContainer: APP.mode === 1 ? '.chatbox' : '#chatbox',
        messageList: APP.mode === 1 ? '.message-list' : '#message-list',
        messageName: APP.mode === 1 ? '.message-from-name' : '.message-from',
        messageToast: '.message-row.toast',

        // Colors and Images
        colorBox: '.perks',
        colorPickerGui: '.colorPickerGui',
        colorPickerInput: '#colorPickerInput',
        colorPickerSelector: '#colorPickerSelector',
        colorSwitchCell: '#colorSwitchNickCell',
        colorSwitchChatbox: '#colorSwitchNickChatbox',
        colorSwitchLeaderboard: '#colorSwitchNickLeaderboard',
        colorSwitchNickCell: '#colorSwitchNickCell',

        // Discord Integration
        discordBtn: '.discord',
        discordName: APP.mode === 1 ? '.account-name' : '#account-name',
        discordPhoto: '.avatar',

        // HUD and Ads
        ad: 'div[data-v-5190ae12][style*="height: 286px;"]',
        bar: '.bar>.statBar',
        barHud: '.bar',
        bodyHud: 'body',
        cmp: '#cmpbox',
        cmpButton: '.cmpboxbtn',
        mainContainer: '#main-container',
        menuContainer: '#menu-container',
        modalHud: '.modal',
        socialContainer: '.social-container',

        // Leaderboard Elements
        leaderboard: '#leaderboard',
        leaderboardText: APP.mode === 1 ? '.leaderboard-text' : '.leaderboard-label[data-v-8a0c31c6]>:last-child ',

        // Nickname Elements
        nickname: '#nickname',
        nicknameProfile: '.nicknameProfile',

        // Player Data and Control
        playButton: '#play-button',
        playerContainer: '#player-container',
        playerData: '#player-container #player-data',
        playerListTitle: '.player-list-title',
        playerStalkContainer: '.playerStalkContainer',
        spectateButton: '#spec-button',

        // Server Information
        serverList: '.server-list',
        serverListItem: '.server-list-item',
        serverName: '.server-name',

        // Skin Elements
        skinContainer: '.skin-container',
        skinElem: '.skin',
        skinProfile: '.skinProfile',
        skinUrl: '#skinurl',
        skinsId: '#skins',
        overlaySkin: '.overlaySkin',
        skinAdd: '.add-skin',
        skinsNavAllButton: '.skinsNavAllButton',
        skinsNavMeButton: '.skinsNavMeButton',
        skinsNavFavButton: '.skinsNavFavButton',
        skinsNavAllPage: '.skinsNavAllPage',
        skinsNavMePage: '.skinsNavMePage',
        skinsNavFavPage: '.skinsNavFavPage',

        // Stat Bar Elements
        statKills: '#overlay>.container>.fade-box.scroll>div>div:nth-child(3)',
        statScore: '#overlay>.container>.fade-box.scroll>div>div:nth-child(2)',
        statTime: '#overlay>.container>.fade-box.scroll>div>div:nth-child(1)',

        // User Interface Boxes
        anonymousStatus: '.anonymousStatus',
        anonymousSwitch: '.anonymousSwitch',
        minimapContainer: APP.mode === 1 ? '.minimap-wrapper>.container' : '.container[data-v-4c95bd45]',
        statBox: '.statBox',
        toolBox: '.toolBox',
        userBox: '.userBox',
        skinBox: '.skinBox',
        leaderboardBox: '.leaderboardBox',
        userNickLine: '.userNickLine',
        boxTitle: '.customBoxTitle',

        // User Authentication
        emailInput: '#email-input',
        loadingDelta: '.loadingDelta',
        passwordInput: '#password-input',
        submitButton: '#submit-account',
        submitText: '#submit-text',

        // Tools page
        toolsPagePerks: '.toolsPagePerks',
        toolsPageButtonPerks: '.toolsNavPerksTab',
        toolsPageSettings: '.toolsPageSettings',
        toolsPageButtonSettings: '.toolsNavSettingsTab',
        toolsPageConfigurations: '.toolsPageConfigurations',
        toolsPageButtonConfigurations: '.toolsNavConfigurationsTab',

        // Leaderboard page
        leaderboardList: '.leaderboardList',
        leaderbordKdaButton: '.leaderbordKdaButton',
        leaderbordKillsButton: '.leaderbordKillsButton',
        leaderbordGamesButton: '.leaderbordGamesButton',
        leaderbordMassTotalButton: '.leaderbordMassTotalButton',
        leaderbordMassAvgButton: '.leaderbordMassAvgButton',
        leaderbordTimeButton: '.leaderbordTimeButton',
    };
}


function getAllImages() {
    return {
        // Skins
        anonymousSkin: 'https://i.ibb.co/NtMpMBJ/anonymous.png',
        defaultSkin: 'https://skins.vanis.io/s/Qkfih2',
        transparentSkin: 'https://i.ibb.co/g9Sj8gK/transparent-skin.png',
        vanisSkin: 'https://skins.vanis.io/s/vanis1',

        // Modes
        dualMode: 'https://i.ibb.co/gSkk94N/dual.png',
        singleMode: 'https://i.ibb.co/Lr248FQ/single.png',
        undefMode: 'https://i.ibb.co/g9Sj8gK/undef.png',

        // Utils
        deltaLogo: 'https://i.ibb.co/kh36nB5/delta.png',
        imageAddVanis: '/img/skin-add.png'
    };
}

function getAllColors() {
    return {
        whiteRGB: 'rgb(255, 255, 255)',
        defaultColor: '#c084ff',
        onlineColor: '#32e34a',
        offlineColor: '#e33247',
    }
}

function getAllErrors() {
    return {
        title: 'Delta error:',
        content: '. Please send a message in #support on the official Delta Discord server : https://discord.gg/wthDcUb6nY/',
    };
}

function getAllTitle() {
    return [
        "+330 users on Delta",
        "Alis.io",
        "Vanis.io",
        "Vanish.io",
        "Raf x Duru x Fohz",
        "Delta.io",
        "Delta above all",
        "Delta on top",
        "Delta will carry you",
        "Delta best ext ?",
        "Alis.io legends",
        "Want a badge? DM Fohz",
        "Luka will recruit Fohz?",
        "Join discord now",
        "Fohz the tricker",
        "BBN the SK",
        "Exe the legend",
        "Duru is cuter than all",
        "Deadly World the solo",
        "Yuu the hat coder",
        "Splat the YouTuber",
        "Zimek the precursor",
        "Angel the mad",
        "Grouk the legend",
        "Useful the splitrunner",
        "Frenchies on top",
        "Eva, don't hate Fohz",
        "DM Luka to recruit Fohz!",
        "Luka need Fohz ?",
        "Pi the legend",
        "Who's Miracle..?",
    ];
}

/***************
 *
 *  Draw style
 *
 ***************/
async function drawStyle() {
    try {
        const cache = `${ATTRS.libraries.css}?=${new Date().getTime()}`;
        const response = await fetch(cache);
        if (!response.ok) displayError(ATTRS.errors.title + 'Css fetcher failed' + ATTRS.errors.content);
        const css = await response.text();

        $('<style>').text(css).appendTo('head');
        $(ATTRS.selectors.loadingDelta).remove();
        localStorage.setItem('promiseError', 0);

        checkAnnouncement();
    } catch (error) {
        displayError(ATTRS.errors.title + 'Css injector system failed' + ATTRS.errors.content);
    }
}

/***************
 *
 *  Broadcast
 *
 ***************/
function checkAnnouncement() {
    const announcement = parseInt(localStorage.getItem('announcement') || 0);

    if (announcement < 41) {
        setTimeout(() => {
            sendTimedSwal('Big update for dual mode', 'active cell border resizable in settings, new in game font', 10000, 'OK')
            localStorage.setItem('announcement', '41');
        }, 1500);
    }
}