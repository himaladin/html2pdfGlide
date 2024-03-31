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
	  max-width: 1120px;
	  height: auto;
	}
button#download {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
  width: 12rem;
  height: auto;
}

button#download .circle {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: relative;
  display: block;
  margin: 0;
  width: 3rem;
  height: 3rem;
  background: #282936;
  border-radius: 1.625rem;
}

button#download .circle .icon {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
}

button#download .circle .icon.arrow {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  left: 0.625rem;
  width: 1.125rem;
  height: 0.125rem;
  background: none;
}

button#download .circle .icon.arrow::before {
  position: absolute;
  content: "";
  top: -0.29rem;
  right: 0.0625rem;
  width: 0.625rem;
  height: 0.625rem;
  border-top: 0.125rem solid #fff;
  border-right: 0.125rem solid #fff;
  transform: rotate(45deg);
}

button#download .button-text {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.75rem 0;
  margin: 0 0 0 1.85rem;
  color: #282936;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
}

button#download:hover .circle {
  width: 100%;
}

button#download:hover .circle .icon.arrow {
  background: #fff;
  transform: translate(1rem, 0);
}

button#download:hover .button-text {
  color: #fff;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 5px;
  background-color: rgb(0 0 0 / 8%);
}

::-webkit-scrollbar-thumb {
  background-color: rgb(0 0 0 / 32%);
  border-radius: 4px;
}
	`;

	// HTML THAT IS RETURNED AS A RENDERABLE URL
	const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
    <style>${customCSS}</style>
<div class="main">
    <div class="header">
        ${letterheadUrl ? `<img src="${letterheadUrl}" class="letterhead"/>` : `<img src="empty-image.png" class="letterhead empty"/>`}
<button class="learn-more" id="download">
  <span class="circle" aria-hidden="true">
    <span class="icon arrow"></span>
  </span>
  <span class="button-text">Download PDF</span>
</button>
    </div>
    <div id="content">${html}</div>
</div>
    <script>
document.querySelectorAll('.download').forEach(function(button) {
    button.addEventListener('click', function() {
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
        button.innerText = 'Downloading...';
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
});
	  </script>
	  `;
	var encodedHtml = encodeURIComponent(originalHTML);
	return "data:text/html;charset=utf-8," + encodedHtml;
};
