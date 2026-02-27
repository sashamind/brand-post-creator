// =====================================================
// TULA MARAFON POSTS — Логика
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
    dimOpacity: 0.2,
    imageZoom: 100,
    imagePosX: 0,
    imagePosY: 0,

    showFrame: false,
    showLogo: true,
    showAccentLine: true,
    frameColor: 'rgba(255,255,255,0.25)',

    logoCount: 2,
    logoSize: 80,
    logoPosition: 'bottom-right',
    logoVerticalPos: 'top',

        logoImages: {
        1: 'assets/logo1.svg',
        2: 'assets/logo2.svg',
        3: 'assets/logo3.svg'
    },

    // Индивидуальный множитель размера каждого логотипа (в процентах)
        logoIndividualSize: {
        1: 100,
        2: 100,
        3: 70
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
// ПОЗИЦИЯ ЛОГОТИПА (1 логотип — 6 позиций)
// =====================================================
function setLogoPosition(btn) {
    document.querySelectorAll('#logoPositionGrid1 .logo-pos-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.logoPosition = btn.dataset.pos;
    updateCanvas();
}


// =====================================================
// ПОЗИЦИЯ ЛОГОТИПОВ (2-3 — верх/низ)
// =====================================================
function setLogoVerticalPosition(btn) {
    document.querySelectorAll('#logoPositionGrid23 .logo-pos-simple-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.logoVerticalPos = btn.dataset.pos;
    updateCanvas();
}


// =====================================================
// КОЛИЧЕСТВО ЛОГОТИПОВ
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
// ЗАГРУЗКА ЛОГОТИПА СПОНСОРА
// =====================================================
function handleLogoUpload(index, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        state.logoImages[index] = e.target.result;
        updateLogoPreview(index);
        updateCanvas();
    };
    reader.readAsDataURL(file);
}


// =====================================================
// СМЕНА МЕСТАМИ ЛОГОТИПОВ
// =====================================================
function swapLogos(indexA, indexB) {
    const temp = state.logoImages[indexA];
    state.logoImages[indexA] = state.logoImages[indexB];
    state.logoImages[indexB] = temp;

    updateLogoPreview(indexA);
    updateLogoPreview(indexB);
    updateCanvas();
}


// =====================================================
// Обновляет превью одного логотипа в боковой панели
// =====================================================
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
    document.getElementById('logoFile' + index).value = '';
    updateLogoPreview(index);
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

function textToHtml(text) {
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return escaped.replace(/\n/g, '<br>');
}


// =====================================================
// ПОЗИЦИОНИРОВАНИЕ КОНТЕЙНЕРА ЛОГОТИПОВ
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
// ГЛАВНАЯ ФУНКЦИЯ — ОБНОВЛЕНИЕ ХОЛСТА
// =====================================================
function updateCanvas() {
    var canvas = document.getElementById('postCanvas');
    var textBlock = document.getElementById('textBlock');
    var heading = document.getElementById('canvasHeading');
    var subtextEl = document.getElementById('canvasSubtext');
    var bgDiv = document.getElementById('canvasBg');
    var dim = document.getElementById('canvasDim');
    var pattern = document.getElementById('placeholderPattern');
    var accentLine = document.getElementById('accentLine');
    var subtextInput = document.getElementById('subtextInput');
    var sponsorContainer = document.getElementById('sponsorLogosContainer');

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
    state.showLogo = document.getElementById('toggleLogo').checked;
    state.showAccentLine = document.getElementById('toggleAccentLine').checked;
    state.logoSize = parseInt(document.getElementById('logoSizeSlider').value);
        // Считываем индивидуальные множители размера
    for (var s = 1; s <= 3; s++) {
        state.logoIndividualSize[s] = parseInt(document.getElementById('logoIndSize' + s).value);
        document.getElementById('logoIndSizeValue' + s).textContent = state.logoIndividualSize[s] + '%';
    }

    // --- Подписи ползунков ---
    document.getElementById('fontSizeValue').textContent = state.fontSize + 'px';
    document.getElementById('dimValue').textContent = Math.round(state.dimOpacity * 100) + '%';
    document.getElementById('zoomValue').textContent = '×' + (state.imageZoom / 100).toFixed(1);
    document.getElementById('posXValue').textContent = (state.imagePosX > 0 ? '+' : '') + state.imagePosX + '%';
    document.getElementById('posYValue').textContent = (state.imagePosY > 0 ? '+' : '') + state.imagePosY + '%';
    document.getElementById('textPosXValue').textContent = state.textPosX + '%';
    document.getElementById('textPosYValue').textContent = state.textPosY + '%';
    document.getElementById('logoSizeValue').textContent = state.logoSize + 'px';

    // --- Textarea подзаголовка ---
    subtextInput.classList.toggle('disabled', !state.showSubtext);

    // --- Размер холста ---
    var scale = calculateScale(state.width, state.height, MAX_PREVIEW_SIZE);

    canvas.style.width = state.width + 'px';
    canvas.style.height = state.height + 'px';
    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.transformOrigin = 'top left';

    var wrapper = document.querySelector('.canvas-wrapper');
    wrapper.style.width = Math.round(state.width * scale) + 'px';
    wrapper.style.height = Math.round(state.height * scale) + 'px';

    // --- Фото фона ---
    if (state.imageDataUrl) {
        bgDiv.style.backgroundImage = 'url(' + state.imageDataUrl + ')';
        bgDiv.style.display = 'block';

        if (state.imageZoom <= 100) {
            bgDiv.style.backgroundSize = 'cover';
        } else {
            bgDiv.style.backgroundSize = state.imageZoom + '%';
        }

        var posX = (50 - state.imagePosX) + '%';
        var posY = (50 - state.imagePosY) + '%';
        bgDiv.style.backgroundPosition = posX + ' ' + posY;
        pattern.style.display = 'none';
    } else {
        bgDiv.style.backgroundImage = '';
        bgDiv.style.display = 'none';
        pattern.style.display = 'block';
    }

    // --- Затемнение ---
    dim.style.background = 'rgba(0, 0, 0, ' + state.dimOpacity + ')';

    // --- Italic ---
    state.headingItalic = document.getElementById('toggleItalic').checked;
    heading.style.fontStyle = state.headingItalic ? 'italic' : 'normal';

    // --- Заголовок ---
    heading.innerHTML = textToHtml(state.heading);
    heading.style.fontSize = state.fontSize + 'px';
    heading.style.color = state.textColor;

    // --- Подзаголовок ---
    if (state.showSubtext) {
        subtextEl.innerHTML = textToHtml(state.subtext);
        subtextEl.style.fontSize = Math.round(state.fontSize * 0.76) + 'px';
        subtextEl.style.color = state.textColor;
        subtextEl.style.display = '';
    } else {
        subtextEl.style.display = 'none';
    }

    // --- Позиция текста (30px от краёв) ---
    var minPctX = (30 / state.width) * 100;
    var maxPctX = 100 - minPctX;
    var minPctY = (30 / state.height) * 100;
    var maxPctY = 100 - minPctY;

    var clampedX = Math.max(minPctX, Math.min(maxPctX, state.textPosX));
    var clampedY = Math.max(minPctY, Math.min(maxPctY, state.textPosY));

    textBlock.style.left = clampedX + '%';
    textBlock.style.top = clampedY + '%';
    textBlock.style.transform = 'translate(' + (-clampedX) + '%, ' + (-clampedY) + '%)';
    textBlock.style.textAlign = state.textAlign;

    // --- Акцентная линия ---
    if (state.showAccentLine) {
        accentLine.style.display = 'block';
        var lineOffsetY = state.fontSize + 10;

        accentLine.style.left = clampedX + '%';
        accentLine.style.top = 'calc(' + clampedY + '% - ' + lineOffsetY + 'px)';
        accentLine.style.bottom = '';

        if (state.textAlign === 'center') {
            accentLine.style.transform = 'translate(-50%, -' + clampedY + '%)';
        } else {
            accentLine.style.transform = 'translate(-' + clampedX + '%, -' + clampedY + '%)';
        }
    } else {
        accentLine.style.display = 'none';
    }

    // --- Рамка ---
    var frameEl = document.getElementById('idFrame');
    if (state.showFrame) {
        frameEl.style.display = '';
        frameEl.style.borderColor = state.frameColor;
    } else {
        frameEl.style.display = 'none';
    }

        // --- ЛОГОТИПЫ СПОНСОРОВ ---
    if (state.showLogo) {
        sponsorContainer.style.display = 'flex';

        var textFontSize = Math.round(state.logoSize * 0.35);

        // Определяем выравнивание для 1 логотипа по его позиции
        // Это нужно чтобы лого рос "от угла" а не от центра
        var singleAlignItems = 'center';     // вертикальное выравнивание внутри контейнера
        var singleJustify = 'center';        // горизонтальное выравнивание

        if (state.logoCount === 1) {
            // Вертикаль: top = прижат к верху, bottom = прижат к низу
            if (state.logoPosition.indexOf('top') !== -1) {
                singleAlignItems = 'flex-start';
            } else if (state.logoPosition.indexOf('bottom') !== -1) {
                singleAlignItems = 'flex-end';
            }
            // Горизонталь: left = прижат влево, right = прижат вправо
            if (state.logoPosition.indexOf('left') !== -1) {
                singleJustify = 'flex-start';
            } else if (state.logoPosition.indexOf('right') !== -1) {
                singleJustify = 'flex-end';
            } else {
                singleJustify = 'center';
            }
        }

        for (var i = 1; i <= 3; i++) {
            var logoEl = document.getElementById('sponsorLogo' + i);
            var imgEl = document.getElementById('sponsorLogoImg' + i);
            var dotEl = logoEl.querySelector('.logo-dot');
            var textEl = logoEl.querySelector('.sponsor-logo-text');

            // Сбрасываем классы выравнивания
            logoEl.classList.remove('logo-first', 'logo-last', 'logo-center');

            if (i <= state.logoCount) {
                logoEl.style.display = 'flex';

                // Для 1 логотипа — выравнивание по углу
                if (state.logoCount === 1) {
                    logoEl.style.justifyContent = singleJustify;
                    logoEl.style.alignItems = singleAlignItems;
                } else {
                    // Для 2-3 логотипов — классы лево/центр/право
                    logoEl.style.justifyContent = '';
                    logoEl.style.alignItems = '';
                    if (i === 1) {
                        logoEl.classList.add('logo-first');
                    } else if (i === state.logoCount) {
                        logoEl.classList.add('logo-last');
                    } else {
                        logoEl.classList.add('logo-center');
                    }
                }

                                if (state.logoImages[i]) {
                    // Есть картинка — размер = базовый × индивидуальный множитель
                    var individualHeight = Math.round(state.logoSize * state.logoIndividualSize[i] / 100);
                    imgEl.src = state.logoImages[i];
                    imgEl.style.display = 'block';
                    imgEl.style.height = individualHeight + 'px';
                    imgEl.style.width = 'auto';
                    imgEl.style.maxWidth = 'none';
                    dotEl.style.display = 'none';
                    textEl.style.display = 'none';
                } else {
                    // Нет картинки — текст "BRAND"
                    imgEl.style.display = 'none';
                    dotEl.style.display = '';
                    textEl.style.display = '';
                    logoEl.style.fontSize = textFontSize + 'px';

                    var dotSize = Math.max(4, Math.round(state.logoSize * 0.16));
                    dotEl.style.width = dotSize + 'px';
                    dotEl.style.height = dotSize + 'px';
                }
            } else {
                logoEl.style.display = 'none';
            }
        } // <-- закрываем for

        var padding = 30;
        applySponsorLogosPosition(sponsorContainer, state.logoCount, padding);

    } else {
        sponsorContainer.style.display = 'none';
    } // <-- закрываем if (state.showLogo)

} // <-- закрываем updateCanvas()


// =====================================================
// СКАЧИВАНИЕ ПОСТА
// =====================================================
async function downloadPost(overlayOnly) {
    var canvas = document.getElementById('postCanvas');
    var bgDiv = document.getElementById('canvasBg');
    var dim = document.getElementById('canvasDim');
    var pattern = document.getElementById('placeholderPattern');
    var wrapper = document.querySelector('.canvas-wrapper');

    var savedTransform = canvas.style.transform;
    var savedWrapperW = wrapper.style.width;
    var savedWrapperH = wrapper.style.height;

    canvas.style.transform = 'none';
    wrapper.style.width = state.width + 'px';
    wrapper.style.height = state.height + 'px';

    var saved = {};
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

    await new Promise(function(resolve) { setTimeout(resolve, 150); });

    try {
        var result = await html2canvas(canvas, {
            scale: 1,
            backgroundColor: overlayOnly ? null : '#1a1a24',
            useCORS: true,
            logging: false,
            width: state.width,
            height: state.height,
        });

        var now = new Date();
        var date = now.getFullYear()
            + '-' + String(now.getMonth() + 1).padStart(2, '0')
            + '-' + String(now.getDate()).padStart(2, '0')
            + '_' + String(now.getHours()).padStart(2, '0')
            + '-' + String(now.getMinutes()).padStart(2, '0')
            + '-' + String(now.getSeconds()).padStart(2, '0');

        var link = document.createElement('a');
        link.download = overlayOnly
            ? 'overlay_' + state.width + 'x' + state.height + '_' + date + '.png'
            : 'post_' + state.width + 'x' + state.height + '_' + date + '.png';
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
// ИНИЦИАЛИЗАЦИЯ ПРИ СТАРТЕ
// =====================================================

// Показываем 2 строки загрузки логотипов (по умолчанию 2 лого)
document.getElementById('logoUploadRow2').style.display = 'flex';
document.getElementById('logoUploadRow3').style.display = 'none';

// Активная кнопка "2"
document.querySelectorAll('.logo-count-btn').forEach(function(b) {
    b.classList.remove('active');
    if (b.dataset.count === '2') b.classList.add('active');
});

// Для 3 логотипов: простые кнопки верх/низ
document.getElementById('logoPositionGrid1').style.display = 'none';
document.getElementById('logoPositionGrid23').style.display = '';
document.getElementById('logoPositionLabel').textContent = 'Позиция логотипов';

// Загрузка фото по умолчанию
function loadDefaultImage() {
    var img = new Image();
    img.onload = function () {
        var cvs = document.createElement('canvas');
        cvs.width = img.naturalWidth;
        cvs.height = img.naturalHeight;
        var ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataUrl = cvs.toDataURL('image/jpeg', 0.92);
        state.imageDataUrl = dataUrl;

        var preview = document.getElementById('uploadPreview');
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