window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions, letterheadUrl) {
    // FIDELITY MAPPING
    const fidelityMap = {
        low: 1,
        standard: 1.5,
        high: 2,
    };

    // DYNAMIC VALUES
    html = html.value ?? "No HTML set.";
    fileName = fileName.value ?? "file";
    format = format.value ?? "a4";
    zoom = zoom.value ?? "1";
    orientation = orientation.value ?? "portrait";
    margin = margin.value ?? "0";
    breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
    breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
    breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
    quality = fidelityMap[fidelity.value] ?? 1.5;
    letterheadUrl = letterheadUrl.value ?? "";
    customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

    // DOCUMENT DIMENSIONS
    const formatDimensions = {
        a0: [4967, 7022],
        a1: [3508, 4967],
        a2: [2480, 3508],
        a3: [1754, 2480],
        a4: [1240, 1754],
        a5: [874, 1240],
        a6: [620, 874],
        a7: [437, 620],
        a8: [307, 437],
        a9: [219, 307],
        a10: [154, 219],
        b0: [5906, 8350],
        b1: [4175, 5906],
        b2: [2953, 4175],
        b3: [2085, 2953],
        b4: [1476, 2085],
        b5: [1039, 1476],
        b6: [738, 1039],
        b7: [520, 738],
        b8: [366, 520],
        b9: [260, 366],
        b10: [183, 260],
        c0: [5415, 7659],
        c1: [3827, 5415],
        c2: [2705, 3827],
        c3: [1913, 2705],
        c4: [1352, 1913],
        c5: [957, 1352],
        c6: [673, 957],
        c7: [478, 673],
        c8: [337, 478],
        c9: [236, 337],
        c10: [165, 236],
        dl: [650, 1299],
        letter: [1276, 1648],
        government_letter: [1199, 1577],
        legal: [1276, 2102],
        junior_legal: [1199, 750],
        ledger: [2551, 1648],
        tabloid: [1648, 2551],
        credit_card: [319, 508],
    };

    // GET FINAL DIMESIONS FROM SELECTED FORMAT
    const dimensions = customDimensions || formatDimensions[format];
    const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));
    const paperWidth = formatDimensions[format][0];
    const maxLetterheadWidth = Math.min(paperWidth, 1120);


    // LOG SETTINGS TO CONSOLE
    console.log(
        `Filename: ${fileName}\n` +
        `Format: ${format}\n` +
        `Dimensions: ${dimensions}\n` +
        `Zoom: ${zoom}\n` +
        `Final Dimensions: ${finalDimensions}\n` +
        `Orientation: ${orientation}\n` +
        `Margin: ${margin}\n` +
        `Break before: ${breakBefore}\n` +
        `Break after: ${breakAfter}\n` +
        `Break avoid: ${breakAvoid}\n` +
        `Quality: ${quality}` +
        `Letterhead URL: ${letterheadUrl}`
    );

    const customCSS = `
    body {
      margin: 0!important
    }
     .header {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100%;
      text-align: center;
    }
    
    .letterhead {
      width: 100%;
      max-width:  ${maxLetterheadWidth}px;
      height: auto;
    }
        
    button {
      position: fixed;
      top: 8px;
      right: 8px;
      font-size: 1.08em;
      font-weight: 700;
      padding: 0.5em 1.2em;
      background-color: #BF0426;
      text-decoration: none;
      border: none;
      border-radius: 0.5em;
      color: #DEDEDE;
      box-shadow: 0.5em 0.5em 0.5em rgba(0, 0, 0, 0.3);
      cursor: pointer;
      z-index: 999;
    }
    
    button::before {
      position: absolute;
      content: '';
      height: 0;
      width: 0;
      top: 0;
      left: 0;
      background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(150,4,31,1) 50%, rgba(191,4,38,1) 60%);
      border-radius: 0 0 0.5em 0;
      box-shadow: 0.2em 0.2em 0.2em rgba(0, 0, 0, 0.3);
      transition: 0.3s;
    }
    
    button:hover::before {
      width: 1.6em;
      height: 1.6em;
    }
    
    button:active {
      box-shadow: 0.2em 0.2em 0.3em rgba(0, 0, 0, 0.3);
      transform: translate(0.1em, 0.1em);
    }
    </style>
    `;

    // HTML THAT IS RETURNED AS A RENDERABLE URL
    const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
    <style>${customCSS}</style>
    <div class="main">
        <div class="header">
            ${letterheadUrl ? `<img src="${letterheadUrl}" class="letterhead"/>` : `<img src="empty-image.png" class="letterhead empty"/>`}
            <button class="button" id="download">Download PDF</button>
        </div>
        <div id="content">${html}</div>
    </div>
    <script>
    document.getElementById('download').addEventListener('click', function() {
        var button = this;
        var opt = {
            pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
            margin: ${margin},
            filename: '${fileName}',
            html2canvas: {
                useCORS: true,
                scale: ${quality}
            },
            jsPDF: {
                unit: 'px',
                orientation: '${orientation}',
                format: [${finalDimensions}],
                hotfixes: ['px_scaling']
            },
        };
        button.innerText = 'Downloading..';
        button.className = 'downloading';

        var content = document.getElementById('content');
        var letterheadUrl = '${letterheadUrl}';
        var letterheadAdded = false;

        if (letterheadUrl && !content.querySelector('.letterhead')) {
            var letterhead = document.createElement('img');
            letterhead.src = letterheadUrl;
            letterhead.classList.add('letterhead');
            content.insertBefore(letterhead, content.firstChild);
            letterheadAdded = true;
        }

        setTimeout(function() {
            html2pdf().set(opt).from(content).toPdf().get('pdf').then(function(pdf) {
                var pageCount = pdf.internal.getNumberOfPages();
                // Loop through each page
                for (var i = 1; i <= pageCount; i++) {
                    pdf.setPage(i);
                    pdf.setFontStyle("medium");
                    pdf.setFontSize(12);
                    var pageSize = pdf.internal.pageSize;
                    var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    pdf.text(pageWidth - (${margin} + 70), pageHeight - 30, 'Page ' + i + ' of ' + pageCount);
                }

                pdf.save('${fileName}.pdf');
                button.innerText = 'Downloaded';
                button.className = 'downloaded';
                setTimeout(function() {
                    button.innerText = 'Download PDF';
                    button.className = '';
                    if (letterheadAdded) {
                        content.removeChild(content.querySelector('.letterhead'));
                    }
                }, 2000);
            });
        }, 1000);
    }, false);
    </script>
    `;
    var encodedHtml = encodeURIComponent(originalHTML);
    return "data:text/html;charset=utf-8," + encodedHtml;
};
