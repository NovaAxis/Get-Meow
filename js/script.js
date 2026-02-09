(() => {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const DOWNLOAD_URL = '/redirection/download.html';
    // const CONTACT_EMAIL = 'info@bunni.fun';

    const firstText = $('#firstText');
    const secondText = $('#secondText');
    const thirdText = $('#thirdText');
    const main = $('#mainContent');

    const downloadBtn = $('#download-button');
    // const contactBtn = $('#contact-button');
    const privacyLink = $('#privacy-link');
    const tosLink = $('#tos-link');

    const downloadModal = $('#downloadModal');
    const privacyModal = $('#privacyModal');
    const tosModal = $('#tosModal');
    const passwordModal = $('#passwordModal');
    // const contactModal = $('#contactModal');

    const tosOk = $('#acceptTos');
    const privOk = $('#acceptPrivacy');
    const downloadOk = $('#downloadAccept');

    const open = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const close = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    const setDownloadEnabled = () => {
        const enabled = !!(tosOk?.checked && privOk?.checked);
        downloadOk?.classList.toggle('disabled', !enabled);
    };

    // Intro animation sequence - smooth and professional
    const INTRO_TIMING = {
        firstShow: 100,
        firstHide: 900,
        secondShow: 1100,
        secondHide: 1900,
        thirdShow: 2100,
        thirdHide: 2900,
        mainShow: 3200
    };

    window.setTimeout(() => firstText?.classList.add('visible'), INTRO_TIMING.firstShow);
    window.setTimeout(() => firstText?.classList.add('slide-up'), INTRO_TIMING.firstHide);

    window.setTimeout(() => secondText?.classList.add('visible'), INTRO_TIMING.secondShow);
    window.setTimeout(() => secondText?.classList.add('slide-up'), INTRO_TIMING.secondHide);

    window.setTimeout(() => thirdText?.classList.add('visible'), INTRO_TIMING.thirdShow);
    window.setTimeout(() => thirdText?.classList.add('slide-down'), INTRO_TIMING.thirdHide);

    window.setTimeout(() => {
        main?.classList.add('visible');
        firstText?.remove();
        secondText?.remove();
        thirdText?.remove();
    }, INTRO_TIMING.mainShow);

    downloadBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (tosOk) tosOk.checked = false;
        if (privOk) privOk.checked = false;
        setDownloadEnabled();
        open(downloadModal);
    });

    privacyLink?.addEventListener('click', (e) => {
        e.preventDefault();
        open(privacyModal);
    });

    tosLink?.addEventListener('click', (e) => {
        e.preventDefault();
        open(tosModal);
    });

    // contactBtn?.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     open(contactModal);
    // });

    tosOk?.addEventListener('change', setDownloadEnabled);
    privOk?.addEventListener('change', setDownloadEnabled);

    downloadOk?.addEventListener('click', () => {
        if (!tosOk?.checked || !privOk?.checked) return;
        close(downloadModal);
        open(passwordModal);
    });

    // Password modal handlers
    const copyPasswordBtn = $('#copyPassword');
    const passwordDownloadBtn = $('#passwordDownload');
    const zipPassword = $('#zipPassword');

    copyPasswordBtn?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(zipPassword?.textContent || '');
            const oldText = copyPasswordBtn.textContent;
            copyPasswordBtn.textContent = 'Copied!';
            window.setTimeout(() => (copyPasswordBtn.textContent = oldText), 1500);
        } catch {
            // Fallback for older browsers
            const tmp = document.createElement('textarea');
            tmp.value = zipPassword?.textContent || '';
            tmp.setAttribute('readonly', '');
            tmp.style.position = 'fixed';
            tmp.style.left = '-9999px';
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand('copy');
            tmp.remove();
        }
    });

    passwordDownloadBtn?.addEventListener('click', () => {
        close(passwordModal);
        window.open(DOWNLOAD_URL, '_blank', 'noopener');
    });

    // Copy email button handler
    // const copyEmailBtn = $('#copyEmail');
    // const contactEmail = $('#contactEmail');

    // copyEmailBtn?.addEventListener('click', async () => {
    //     try {
    //         await navigator.clipboard.writeText(contactEmail?.textContent || '');
    //         const oldText = copyEmailBtn.textContent;
    //         copyEmailBtn.textContent = 'Copied!';
    //         window.setTimeout(() => (copyEmailBtn.textContent = oldText), 1500);
    //     } catch {
    //         const tmp = document.createElement('textarea');
    //         tmp.value = contactEmail?.textContent || '';
    //         tmp.setAttribute('readonly', '');
    //         tmp.style.position = 'fixed';
    //         tmp.style.left = '-9999px';
    //         document.body.appendChild(tmp);
    //         tmp.select();
    //         document.execCommand('copy');
    //         tmp.remove();
    //     }
    // });

    // close buttons + clicking the overlay
    const closeMap = {
        downloadModalClose: downloadModal,
        downloadCancel: downloadModal,
        privacyModalClose: privacyModal,
        privacyClose: privacyModal,
        tosModalClose: tosModal,
        tosClose: tosModal,
        passwordModalClose: passwordModal,
        passwordCancel: passwordModal,
        // contactModalClose: contactModal,
        // contactClose: contactModal
    };

    Object.keys(closeMap).forEach((id) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => close(closeMap[id]));
    });

    [downloadModal, privacyModal, tosModal, passwordModal/*, contactModal*/].forEach((modal) => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) close(modal);
        });
    });

    // "read terms" links inside the download modal
    $$('.modal-link').forEach((a) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const which = a.getAttribute('data-modal');
            if (which === 'tos') open(tosModal);
            if (which === 'privacy') open(privacyModal);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        [downloadModal, privacyModal, tosModal, passwordModal/*, contactModal*/].forEach((m) => m?.classList.contains('active') && close(m));
    });
})();
