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

.button {
    padding: 0.6rem 4rem;
    border: none;
    outline: none;
    font-size: 1.3rem;
    border-radius: 0.3rem;
    font-weight: 600;
    background-color: rgba(255, 255, 255, 0.953);
    box-shadow: 2px 4px 10px -3px rgba(0,0,0,0.27);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: 0.4s ease-in-out;
}

.button .download-text {
    position: absolute;
    left: 1.8rem;
    top: 1.3rem;
    transition: 0.4s ease-in-out;
    color: rgb(50, 50, 50);
}

.button .svg {
    transform: translateY(-20px) rotate(30deg);
    opacity: 0;
    width: 2rem;
    transition: 0.4s ease-in-out;
}

.button:hover {
    background-color: rgb(50, 50, 50);
}

.button:hover .svg {
    display: inline-block;
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
}

.button:hover .download-text {
    opacity: 0;
}

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
	       <button id="download" class="button">
		  <span class="download-text">Download</span>
		  <div class="svg">
		    <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-download" viewBox="0 0 16 16">
		      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
		      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
		    </svg>
		  </div>
		</button>
	    </div>
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
	button.disabled = true; // Menonaktifkan tombol selama proses download
	    button.innerText = 'Downloading...';
	
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
                button.disabled = false;
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
