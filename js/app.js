// =====================================================
// BRAND POST CREATOR — Логика
// Версия 9: Мульти-логотипы спонсоров (1-3 штуки)
// =====================================================

const state = {
    width: 1080,
    height: 1080,
    formatName: 'Квадрат',

    heading: 'важная\nинформация',
subtext: 'забег переносится',
    showSubtext: false,
    fontSize: 50,
    textColor: '#ffffff',
    textAlign: 'left',
    headingItalic: false,
    textPosX: 50,
    textPosY: 50,

    imageDataUrl: null,
    dimOpacity: 0.3,
    imageZoom: 100,
    imagePosX: 0,
    imagePosY: 0,

    showFrame: true,
    showLogo: true,
    showAccentLine: true,
    frameColor: 'rgba(255,255,255,0.25)',

    // --- Логотипы спонсоров ---
    logoCount: 3,
    logoSize: 80,
    logoPosition: 'bottom-right',
    logoVerticalPos: 'bottom',

        logoImages: {
        1: 'assets/logo1.svg',
        2: 'assets/logo2.svg',
        3: 'assets/logo3.svg'
    }
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
    document.querySelectorAll('.color-swatch:not(.frame-color)').forEach(s => s.classList.remove('active'));
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
// ЦВЕТ РАМКИ
// =====================================================
function setFrameColor(swatch) {
    document.querySelectorAll('.frame-color').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    state.frameColor = swatch.dataset.color;
    updateCanvas();
}


// =====================================================
// ПОЗИЦИЯ ЛОГОТИПА (для 1 логотипа — полная сетка 6 позиций)
// =====================================================
function setLogoPosition(btn) {
    document.querySelectorAll('#logoPositionGrid1 .logo-pos-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.logoPosition = btn.dataset.pos;
    updateCanvas();
}


// =====================================================
// ПОЗИЦИЯ ЛОГОТИПОВ (для 2-3 — только верх/низ)
// =====================================================
function setLogoVerticalPosition(btn) {
    document.querySelectorAll('#logoPositionGrid23 .logo-pos-simple-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.logoVerticalPos = btn.dataset.pos;
    updateCanvas();
}


// =====================================================
// КОЛИЧЕСТВО ЛОГОТИПОВ (1, 2 или 3)
// =====================================================
function setLogoCount(btn) {
    document.querySelectorAll('.logo-count-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    state.logoCount = parseInt(btn.dataset.count);

    document.getElementById('logoUploadRow2').style.display = state.logoCount >= 2 ? 'flex' : 'none';
    document.getElementById('logoUploadRow3').style.display = state.logoCount >= 3 ? 'flex' : 'none';

    if (state.logoCount === 1) {
        document.getElementById('logoPositionGrid1').style.display = '';
        document.getElementById('logoPositionGrid23').style.display = 'none';
        document.getElementById('logoPositionLabel').textContent = 'Позиция логотипа';
    } else {
        document.getElementById('logoPositionGrid1').style.display = 'none';
        document.getElementById('logoPositionGrid23').style.display = '';
        document.getElementById('logoPositionLabel').textContent = 'Позиция логотипов';
    }

    updateCanvas();
}


// =====================================================
// ЗАГРУЗКА ЛОГОТИПА СПОНСОРА (картинка)
// =====================================================
function handleLogoUpload(index, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        state.logoImages[index] = e.target.result;

        const preview = document.getElementById('logoPreview' + index);
        preview.src = e.target.result;
        preview.style.display = 'block';
        document.getElementById('logoPlaceholder' + index).style.display = 'none';
        document.getElementById('logoBox' + index).classList.add('has-logo');
        document.getElementById('logoRemove' + index).style.display = 'flex';

        updateCanvas();
    };
    reader.readAsDataURL(file);
}

// =====================================================
// СМЕНА МЕСТАМИ ЛОГОТИПОВ
// =====================================================
function swapLogos(indexA, indexB) {
    // Меняем данные в state
    const temp = state.logoImages[indexA];
    state.logoImages[indexA] = state.logoImages[indexB];
    state.logoImages[indexB] = temp;

    // Обновляем превью в панели для обоих логотипов
    updateLogoPreview(indexA);
    updateLogoPreview(indexB);

    updateCanvas();
}

// Обновляет превью одного логотипа в боковой панели
function updateLogoPreview(index) {
    const preview = document.getElementById('logoPreview' + index);
    const placeholder = document.getElementById('logoPlaceholder' + index);
    const box = document.getElementById('logoBox' + index);
    const removeBtn = document.getElementById('logoRemove' + index);

    if (state.logoImages[index]) {
        preview.src = state.logoImages[index];
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        box.classList.add('has-logo');
        removeBtn.style.display = 'flex';
    } else {
        preview.src = '';
        preview.style.display = 'none';
        placeholder.style.display = '';
        box.classList.remove('has-logo');
        removeBtn.style.display = 'none';
    }
}
// =====================================================
// УДАЛЕНИЕ ЛОГОТИПА СПОНСОРА
// =====================================================
function removeLogo(index) {
    state.logoImages[index] = null;

    const preview = document.getElementById('logoPreview' + index);
    preview.src = '';
    preview.style.display = 'none';
    document.getElementById('logoPlaceholder' + index).style.display = '';
    document.getElementById('logoBox' + index).classList.remove('has-logo');
    document.getElementById('logoRemove' + index).style.display = 'none';
    document.getElementById('logoFile' + index).value = '';

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
// ЗАГРУЗКА ФОТО (основной фон)
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

// Drag & drop для основного фото
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

// Превращает \n из textarea в <br> для HTML
function textToHtml(text) {
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return escaped.replace(/\n/g, '<br>');
}


// =====================================================
// ПОЗИЦИОНИРОВАНИЕ КОНТЕЙНЕРА ЛОГОТИПОВ НА ХОЛСТЕ
// =====================================================
function applySponsorLogosPosition(container, count, padding) {
    container.style.top = '';
    container.style.bottom = '';
    container.style.left = '';
    container.style.right = '';
    container.style.transform = '';
    container.style.justifyContent = '';
    container.style.width = '';

    if (count === 1) {
        switch (state.logoPosition) {
            case 'top-left':
                container.style.top = padding + 'px';
                container.style.left = padding + 'px';
                break;
            case 'top-center':
                container.style.top = padding + 'px';
                container.style.left = '50%';
                container.style.transform = 'translateX(-50%)';
                break;
            case 'top-right':
                container.style.top = padding + 'px';
                container.style.right = padding + 'px';
                break;
            case 'bottom-left':
                container.style.bottom = padding + 'px';
                container.style.left = padding + 'px';
                break;
            case 'bottom-center':
                container.style.bottom = padding + 'px';
                container.style.left = '50%';
                container.style.transform = 'translateX(-50%)';
                break;
            case 'bottom-right':
            default:
                container.style.bottom = padding + 'px';
                container.style.right = padding + 'px';
                break;
        }
    } else {
        container.style.left = padding + 'px';
        container.style.right = padding + 'px';
        container.style.width = 'auto';
        container.style.justifyContent = 'space-between';

        if (state.logoVerticalPos === 'top') {
            container.style.top = padding + 'px';
        } else {
            container.style.bottom = padding + 'px';
        }
    }
}


// =====================================================
// ОБНОВЛЕНИЕ ОДНОГО ЛОГОТИПА НА ХОЛСТЕ
// =====================================================
function updateSponsorLogoElement(index) {
    const logoEl = document.getElementById('sponsorLogo' + index);
    const imgEl = document.getElementById('sponsorLogoImg' + index);
    const dotEl = logoEl.querySelector('.logo-dot');
    const textEl = logoEl.querySelector('.sponsor-logo-text');

    if (state.logoImages[index]) {
        imgEl.src = state.logoImages[index];
        imgEl.style.display = 'block';
        imgEl.style.height = state.logoSize + 'px';
        dotEl.style.display = 'none';
        textEl.style.display = 'none';
    } else {
        imgEl.style.display = 'none';
        dotEl.style.display = '';
        textEl.style.display = '';

        const dotSize = Math.max(4, Math.round(state.logoSize * 0.16));
        dotEl.style.width = dotSize + 'px';
        dotEl.style.height = dotSize + 'px';
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
    const sponsorContainer = document.getElementById('sponsorLogosContainer');

    // --- Считываем значения из полей ---
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

    // --- Фото фона ---
    if (state.imageDataUrl) {
        bgDiv.style.backgroundImage = `url(${state.imageDataUrl})`;
        bgDiv.style.display = 'block';

        if (state.imageZoom <= 100) {
            bgDiv.style.backgroundSize = 'cover';
        } else {
            bgDiv.style.backgroundSize = state.imageZoom + '%';
        }

        const posX = (50 - state.imagePosX) + '%';
        const posY = (50 - state.imagePosY) + '%';
        bgDiv.style.backgroundPosition = `${posX} ${posY}`;
        pattern.style.display = 'none';
    } else {
        bgDiv.style.backgroundImage = '';
        bgDiv.style.display = 'none';
        pattern.style.display = 'block';
    }

    // --- Затемнение ---
    dim.style.background = `rgba(0, 0, 0, ${state.dimOpacity})`;

    // --- Italic (только заголовок) ---
    state.headingItalic = document.getElementById('toggleItalic').checked;
    heading.style.fontStyle = state.headingItalic ? 'italic' : 'normal';

    // --- Заголовок ---
    heading.innerHTML = textToHtml(state.heading);
    heading.style.fontSize = state.fontSize + 'px';
    heading.style.color = state.textColor;

    // --- Подзаголовок (размер = 76% от заголовка) ---
    if (state.showSubtext) {
        subtextEl.innerHTML = textToHtml(state.subtext);
        subtextEl.style.fontSize = Math.round(state.fontSize * 0.76) + 'px';
        subtextEl.style.color = state.textColor;
        subtextEl.style.display = '';
    } else {
        subtextEl.style.display = 'none';
    }

        // --- Позиция текста (с ограничением 30px от краёв) ---
    // Вычисляем минимальный и максимальный % чтобы текст не подходил
    // ближе 30px к любому краю холста
    const minPctX = (30 / state.width) * 100;
    const maxPctX = 100 - minPctX;
    const minPctY = (30 / state.height) * 100;
    const maxPctY = 100 - minPctY;

    // Зажимаем значения в допустимый диапазон
    const clampedX = Math.max(minPctX, Math.min(maxPctX, state.textPosX));
    const clampedY = Math.max(minPctY, Math.min(maxPctY, state.textPosY));

    const translateX = -clampedX;
    const translateY = -clampedY;
    textBlock.style.left = clampedX + '%';
    textBlock.style.top = clampedY + '%';
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

    // --- Рамка ---
    const frameEl = document.getElementById('idFrame');
    if (state.showFrame) {
        frameEl.style.display = '';
        frameEl.style.borderColor = state.frameColor;
    } else {
        frameEl.style.display = 'none';
    }

    // --- Логотипы спонсоров ---
    if (state.showLogo) {
        sponsorContainer.style.display = 'flex';

        const textFontSize = Math.round(state.logoSize * 0.35);

        for (let i = 1; i <= 3; i++) {
            const logoEl = document.getElementById('sponsorLogo' + i);

            if (i <= state.logoCount) {
                logoEl.style.display = 'flex';
                logoEl.style.fontSize = textFontSize + 'px';
                updateSponsorLogoElement(i);
            } else {
                logoEl.style.display = 'none';
            }
        }

        const padding = 30;
        applySponsorLogosPosition(sponsorContainer, state.logoCount, padding);

    } else {
        sponsorContainer.style.display = 'none';
    }

} // <-- ВОТ ТУТ закрывается updateCanvas()


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

                // Формируем дату и время: 2025-01-15_18-30-45
        const now = new Date();
        const date = now.getFullYear()
            + '-' + String(now.getMonth() + 1).padStart(2, '0')
            + '-' + String(now.getDate()).padStart(2, '0')
            + '_' + String(now.getHours()).padStart(2, '0')
            + '-' + String(now.getMinutes()).padStart(2, '0')
            + '-' + String(now.getSeconds()).padStart(2, '0');

        const link = document.createElement('a');
        link.download = overlayOnly
            ? `overlay_${state.width}x${state.height}_${date}.png`
            : `post_${state.width}x${state.height}_${date}.png`;
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

// При старте: показываем все строки загрузки для 3 логотипов
// и выставляем правильную кнопку количества
document.getElementById('logoUploadRow2').style.display = 'flex';
document.getElementById('logoUploadRow3').style.display = 'flex';
document.querySelectorAll('.logo-count-btn').forEach(b => {
    b.classList.remove('active');
    if (b.dataset.count === '3') b.classList.add('active');
});
// Для 3 логотипов: простые кнопки верх/низ
document.getElementById('logoPositionGrid1').style.display = 'none';
document.getElementById('logoPositionGrid23').style.display = '';
document.getElementById('logoPositionLabel').textContent = 'Позиция логотипов';
// =====================================================
// ЗАПУСК — загрузка фото по умолчанию
// =====================================================
function loadDefaultImage() {
    const img = new Image();
    img.onload = function () {
        const cvs = document.createElement('canvas');
        cvs.width = img.naturalWidth;
        cvs.height = img.naturalHeight;
        const ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataUrl = cvs.toDataURL('image/jpeg', 0.92);
        state.imageDataUrl = dataUrl;

        const preview = document.getElementById('uploadPreview');
        preview.src = dataUrl;
        preview.style.display = 'block';
        document.getElementById('uploadPlaceholder').style.display = 'none';
        document.getElementById('uploadArea').classList.add('has-image');

        updateCanvas();
    };

    img.onerror = function () {
        console.warn('Фото по умолчанию не найдено (assets/default-bg.jpg)');
        updateCanvas();
    };

    img.src = 'assets/default-bg.jpg';
}

loadDefaultImage();