// =====================================================
// BRAND POST CREATOR — Логика
// Версия 8: Raleway ExtraBold + многострочный заголовок
// =====================================================

const state = {
    width: 1080,
    height: 1080,
    formatName: 'Instagram',

    heading: 'важная информация',
    subtext: 'описание вашего поста',
    showSubtext: true,
    fontSize: 42,
    textColor: '#ffffff',
    textAlign: 'center',
    textPosX: 50,
    textPosY: 50,

    imageDataUrl: null,
    dimOpacity: 0.3,
    imageZoom: 100,
    imagePosX: 0,
    imagePosY: 0,

    showFrame: true,
    showCorners: true,
    showLogo: true,
    showAccentLine: true,

    logoSize: 14,
    logoPosition: 'bottom-right',
};

const MAX_PREVIEW_SIZE = 500;
const BRAND_COLOR = '#6c5ce7';


// =====================================================
// ВЫБОР ФОРМАТА
// =====================================================
function setFormat(btn) {
    document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    state.width = parseInt(btn.dataset.width);
    state.height = parseInt(btn.dataset.height);
    state.formatName = btn.querySelector('.format-label').textContent;

    document.getElementById('formatLabel').textContent =
        `${state.formatName} — ${state.width}×${state.height}`;

    updateCanvas();
}


// =====================================================
// ЦВЕТ ТЕКСТА
// =====================================================
function setTextColor(swatch) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    state.textColor = swatch.dataset.color;
    updateCanvas();
}


// =====================================================
// ВЫРАВНИВАНИЕ ТЕКСТА
// =====================================================
function setTextAlign(btn) {
    document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.textAlign = btn.dataset.align;
    updateCanvas();
}


// =====================================================
// ПОЗИЦИЯ ЛОГОТИПА
// =====================================================
function setLogoPosition(btn) {
    document.querySelectorAll('.logo-pos-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.logoPosition = btn.dataset.pos;
    updateCanvas();
}


// =====================================================
// СБРОСЫ
// =====================================================
function resetTextPosition() {
    document.getElementById('textPosXSlider').value = 50;
    document.getElementById('textPosYSlider').value = 50;
    state.textPosX = 50;
    state.textPosY = 50;
    updateCanvas();
}

function resetImagePosition() {
    document.getElementById('zoomSlider').value = 100;
    document.getElementById('posXSlider').value = 0;
    document.getElementById('posYSlider').value = 0;
    state.imageZoom = 100;
    state.imagePosX = 0;
    state.imagePosY = 0;
    updateCanvas();
}


// =====================================================
// ЗАГРУЗКА ФОТО
// =====================================================
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        state.imageDataUrl = e.target.result;

        const preview = document.getElementById('uploadPreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
        document.getElementById('uploadPlaceholder').style.display = 'none';
        document.getElementById('uploadArea').classList.add('has-image');

        resetImagePosition();
    };
    reader.readAsDataURL(file);
}

// Drag & drop
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = BRAND_COLOR;
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const dt = new DataTransfer();
        dt.items.add(file);
        document.getElementById('fileInput').files = dt.files;
        handleImageUpload({ target: { files: [file] } });
    }
});


// =====================================================
// УТИЛИТЫ
// =====================================================
function calculateScale(w, h, maxSize) {
    return Math.min(maxSize / w, maxSize / h);
}

function calculateBgPosition(posValue, zoom) {
    if (zoom <= 100) return '50%';
    return (50 - posValue) + '%';
}


// =====================================================
// ★ ТЕКСТ С ПЕРЕНОСАМИ СТРОК ★
// Превращает \n из textarea в <br> для HTML
// При этом экранирует HTML-спецсимволы для безопасности
// =====================================================
function textToHtml(text) {
    // Сначала экранируем & < > чтобы не было XSS
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Затем заменяем переносы строк на <br>
    return escaped.replace(/\n/g, '<br>');
}


// =====================================================
// ПОЗИЦИОНИРОВАНИЕ ЛОГОТИПА
// =====================================================
function applyLogoPosition(logoEl, position, padding) {
    logoEl.style.top = '';
    logoEl.style.bottom = '';
    logoEl.style.left = '';
    logoEl.style.right = '';
    logoEl.style.transform = '';

    switch (position) {
        case 'top-left':
            logoEl.style.top = padding + 'px';
            logoEl.style.left = padding + 'px';
            break;
        case 'top-center':
            logoEl.style.top = padding + 'px';
            logoEl.style.left = '50%';
            logoEl.style.transform = 'translateX(-50%)';
            break;
        case 'top-right':
            logoEl.style.top = padding + 'px';
            logoEl.style.right = padding + 'px';
            break;
        case 'bottom-left':
            logoEl.style.bottom = padding + 'px';
            logoEl.style.left = padding + 'px';
            break;
        case 'bottom-center':
            logoEl.style.bottom = padding + 'px';
            logoEl.style.left = '50%';
            logoEl.style.transform = 'translateX(-50%)';
            break;
        case 'bottom-right':
        default:
            logoEl.style.bottom = padding + 'px';
            logoEl.style.right = padding + 'px';
            break;
    }
}


// =====================================================
// ГЛАВНАЯ ФУНКЦИЯ — ОБНОВЛЕНИЕ ХОЛСТА
// =====================================================
function updateCanvas() {
    const canvas = document.getElementById('postCanvas');
    const textBlock = document.getElementById('textBlock');
    const heading = document.getElementById('canvasHeading');
    const subtextEl = document.getElementById('canvasSubtext');
    const bgDiv = document.getElementById('canvasBg');
    const dim = document.getElementById('canvasDim');
    const pattern = document.getElementById('placeholderPattern');
    const accentLine = document.getElementById('accentLine');
    const subtextInput = document.getElementById('subtextInput');
    const logoEl = document.getElementById('idLogo');

    // --- Считываем значения ---
    state.heading = document.getElementById('headingInput').value;
    state.subtext = document.getElementById('subtextInput').value;
    state.showSubtext = document.getElementById('toggleSubtext').checked;
    state.fontSize = parseInt(document.getElementById('fontSizeSlider').value);
    state.dimOpacity = parseInt(document.getElementById('dimSlider').value) / 100;
    state.imageZoom = parseInt(document.getElementById('zoomSlider').value);
    state.imagePosX = parseInt(document.getElementById('posXSlider').value);
    state.imagePosY = parseInt(document.getElementById('posYSlider').value);
    state.textPosX = parseInt(document.getElementById('textPosXSlider').value);
    state.textPosY = parseInt(document.getElementById('textPosYSlider').value);
    state.showFrame = document.getElementById('toggleFrame').checked;
    state.showCorners = document.getElementById('toggleCorners').checked;
    state.showLogo = document.getElementById('toggleLogo').checked;
    state.showAccentLine = document.getElementById('toggleAccentLine').checked;
    state.logoSize = parseInt(document.getElementById('logoSizeSlider').value);

    // --- Подписи ползунков ---
    document.getElementById('fontSizeValue').textContent = state.fontSize + 'px';
    document.getElementById('dimValue').textContent = Math.round(state.dimOpacity * 100) + '%';
    document.getElementById('zoomValue').textContent = '×' + (state.imageZoom / 100).toFixed(1);
    document.getElementById('posXValue').textContent = (state.imagePosX > 0 ? '+' : '') + state.imagePosX + '%';
    document.getElementById('posYValue').textContent = (state.imagePosY > 0 ? '+' : '') + state.imagePosY + '%';
    document.getElementById('textPosXValue').textContent = state.textPosX + '%';
    document.getElementById('textPosYValue').textContent = state.textPosY + '%';
    document.getElementById('logoSizeValue').textContent = state.logoSize + 'px';

    // --- Textarea подзаголовка вкл/выкл ---
    subtextInput.classList.toggle('disabled', !state.showSubtext);

    // --- Размер холста ---
    const scale = calculateScale(state.width, state.height, MAX_PREVIEW_SIZE);

    canvas.style.width = state.width + 'px';
    canvas.style.height = state.height + 'px';
    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = 'top left';

    const wrapper = document.querySelector('.canvas-wrapper');
    wrapper.style.width = Math.round(state.width * scale) + 'px';
    wrapper.style.height = Math.round(state.height * scale) + 'px';

    // --- Фото ---
    if (state.imageDataUrl) {
        bgDiv.style.backgroundImage = `url(${state.imageDataUrl})`;
        bgDiv.style.display = 'block';
        bgDiv.style.backgroundSize = state.imageZoom + '%';
        const posX = calculateBgPosition(state.imagePosX, state.imageZoom);
        const posY = calculateBgPosition(state.imagePosY, state.imageZoom);
        bgDiv.style.backgroundPosition = `${posX} ${posY}`;
        pattern.style.display = 'none';
    } else {
        bgDiv.style.backgroundImage = '';
        bgDiv.style.display = 'none';
        pattern.style.display = 'block';
    }

    // --- Затемнение ---
    dim.style.background = `rgba(0, 0, 0, ${state.dimOpacity})`;

    // --- ★ ЗАГОЛОВОК: innerHTML для поддержки переносов строк ★ ---
    heading.innerHTML = textToHtml(state.heading);
    heading.style.fontSize = state.fontSize + 'px';
    heading.style.color = state.textColor;

    // --- Подзаголовок ---
    if (state.showSubtext) {
        subtextEl.innerHTML = textToHtml(state.subtext);
        subtextEl.style.fontSize = Math.round(state.fontSize * 0.38) + 'px';
        subtextEl.style.color = state.textColor;
        subtextEl.style.display = '';
    } else {
        subtextEl.style.display = 'none';
    }

    // --- Позиция текста ---
    const translateX = -state.textPosX;
    const translateY = -state.textPosY;
    textBlock.style.left = state.textPosX + '%';
    textBlock.style.top = state.textPosY + '%';
    textBlock.style.transform = `translate(${translateX}%, ${translateY}%)`;
    textBlock.style.textAlign = state.textAlign;

    // --- Акцентная линия ---
    if (state.showAccentLine) {
        accentLine.style.display = 'block';
        const lineOffsetY = state.fontSize + 10;

        accentLine.style.left = state.textPosX + '%';
        accentLine.style.top = `calc(${state.textPosY}% - ${lineOffsetY}px)`;
        accentLine.style.bottom = '';

        if (state.textAlign === 'center') {
            accentLine.style.transform = `translate(-50%, -${state.textPosY}%)`;
        } else if (state.textAlign === 'left') {
            accentLine.style.transform = `translate(-${state.textPosX}%, -${state.textPosY}%)`;
        } else {
            accentLine.style.transform = `translate(-${state.textPosX}%, -${state.textPosY}%)`;
        }
    } else {
        accentLine.style.display = 'none';
    }

    // --- Элементы айдентики ---
    document.getElementById('idFrame').style.display = state.showFrame ? '' : 'none';

    ['idCornerTL', 'idCornerTR', 'idCornerBL', 'idCornerBR'].forEach(id => {
        document.getElementById(id).style.display = state.showCorners ? '' : 'none';
    });

    // --- Логотип ---
    if (state.showLogo) {
        logoEl.style.display = 'flex';
        logoEl.style.fontSize = state.logoSize + 'px';

        const dotEl = logoEl.querySelector('.logo-dot');
        const dotSize = Math.max(4, Math.round(state.logoSize * 0.55));
        dotEl.style.width = dotSize + 'px';
        dotEl.style.height = dotSize + 'px';

        const padding = Math.max(16, Math.round(state.logoSize * 1.7));
        applyLogoPosition(logoEl, state.logoPosition, padding);
    } else {
        logoEl.style.display = 'none';
    }
}


// =====================================================
// СКАЧИВАНИЕ ПОСТА
// =====================================================
async function downloadPost(overlayOnly) {
    const canvas = document.getElementById('postCanvas');
    const bgDiv = document.getElementById('canvasBg');
    const dim = document.getElementById('canvasDim');
    const pattern = document.getElementById('placeholderPattern');
    const wrapper = document.querySelector('.canvas-wrapper');

    const savedTransform = canvas.style.transform;
    const savedWrapperW = wrapper.style.width;
    const savedWrapperH = wrapper.style.height;

    canvas.style.transform = 'none';
    wrapper.style.width = state.width + 'px';
    wrapper.style.height = state.height + 'px';

    let saved = {};
    if (overlayOnly) {
        saved.bgDisplay = bgDiv.style.display;
        saved.dimDisplay = dim.style.display;
        saved.patternDisplay = pattern.style.display;
        saved.canvasBg = canvas.style.background;

        bgDiv.style.display = 'none';
        dim.style.display = 'none';
        pattern.style.display = 'none';
        canvas.style.background = 'transparent';
    }

    await new Promise(resolve => setTimeout(resolve, 150));

    try {
        const result = await html2canvas(canvas, {
            scale: 1,
            backgroundColor: overlayOnly ? null : '#1a1a24',
            useCORS: true,
            logging: false,
            width: state.width,
            height: state.height,
        });

        const link = document.createElement('a');
        link.download = overlayOnly
            ? `overlay_${state.width}x${state.height}.png`
            : `post_${state.width}x${state.height}.png`;
        link.href = result.toDataURL('image/png');
        link.click();

    } catch (err) {
        alert('Ошибка при скачивании: ' + err.message);
        console.error(err);
    }

    canvas.style.transform = savedTransform;
    wrapper.style.width = savedWrapperW;
    wrapper.style.height = savedWrapperH;

    if (overlayOnly) {
        bgDiv.style.display = saved.bgDisplay;
        dim.style.display = saved.dimDisplay;
        pattern.style.display = saved.patternDisplay;
        canvas.style.background = saved.canvasBg;
    }
}


// =====================================================
// ЗАПУСК
// =====================================================
updateCanvas();