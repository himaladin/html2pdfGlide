window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions, letterheadUrl, footerImageUrl) {
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
    footerImageUrl = footerImageUrl.value ?? "";
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
        // Add other format dimensions here
    };

    // GET FINAL DIMENSIONS FROM SELECTED FORMAT
    const dimensions = customDimensions || formatDimensions[format];
    const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));
    const paperWidth = formatDimensions[format][0];
    const maxLetterheadWidth = Math.min(paperWidth, 1120);
    const paperHeight = (formatDimensions[format][1] / formatDimensions[format][0]) * paperWidth;

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
        `Letterhead URL: ${letterheadUrl}` +
        `Footer Image URL: ${footerImageUrl}`
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
    
    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100%;
      text-align: center;
      max-width: ${maxLetterheadWidth}px;
      height: auto;
      margin: 0 auto;
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
        <div class="footer">
            ${footerImageUrl ? `<img src="${footerImageUrl}" class="footer"/>` : ''}
        </div>
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

    var content = document.getElementById('content');
    var letterheadUrl = '${letterheadUrl}';
    var footerImageUrl = '${footerImageUrl}';
    var letterheadAdded = false;
    var footerAdded = false;

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
                
                // Add letterhead to each page
                if (letterheadUrl && !letterheadAdded) {
                    var letterheadImg = new Image();
                    letterheadImg.src = letterheadUrl;
                    pdf.addImage(letterheadImg, 'PNG', 0, 0, maxLetterheadWidth, 0);
                    letterheadAdded = true;
                }
                
                // Add footer to each page
                if (footerImageUrl && !footerAdded) {
                    var footerImg = new Image();
                    footerImg.src = footerImageUrl;
                    pdf.addImage(footerImg, 'PNG', 0, pageHeight - 50, maxLetterheadWidth, 0);
                    footerAdded = true;
                }
            }

            pdf.save('${fileName}.pdf');
            button.innerText = 'Downloaded';
            button.className = 'downloaded';
            setTimeout(function() {
                button.innerText = 'Download PDF';
                button.className = '';
            }, 2000);
        });
    }, 1000);
}, false);
    </script>
    `;
    var encodedHtml = encodeURIComponent(originalHTML);
    return "data:text/html;charset=utf-8," + encodedHtml;
};
