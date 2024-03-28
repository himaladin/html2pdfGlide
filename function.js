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
	    margin: 0!important;
	    padding-top: 100px; /* Adjust top padding to accommodate the letterhead */
	}
	
	.header {
	    position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    height: 100px; /* Adjust height of header as needed */
	    z-index: 1000; /* Ensure header is above other content */
	    background-color: #ffffff; /* Set background color of header */
	}
	
	.letterhead {
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100px; /* Adjust height of letterhead as needed */
	    z-index: -1;
	}
	
	.content {
	    padding-top: 100px; /* Adjust top padding to avoid overlap with header */
	}
	button#download {
	  position: fixed;
	  border-radius: 0.5rem;
	  font-size: 14px;
	  font-weight: 600;
	  line-height: 1.5rem;
	  color: #212121;
	  border: none;
	  font-family: Arial;
	  padding: 0px 16px;
	  height: 32px;
	  background: #e8e8e8;
	  top: 8px;
	  right: 8px;
	  box-shadow: 2px 4px 10px -3px rgba(0,0,0,0.27);
	  transition: all 250ms;
	  overflow: hidden;
	  cursor: pointer;
	}
 
	button#download::before {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    height: 100%;
	    width: 0;
	    border-radius: 0.5rem;
	    background-color: #4B5D67;
	    z-index: -1;
	    box-shadow: 2px 4px 10px -3px rgba(0,0,0,0.27);
	    transition: all 250ms;
	}
	
	button#download:hover {
	    color: #e8e8e8;
	}
	
	button#download:hover::before {
	    width: 100%;
	}
  
	button#download.downloading {
	  color: #404040;
   	  pointer-events: none;
	}
  
	button#download.done {
	  color: #16a34a;
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
		        <img src="${letterheadUrl}" class="letterhead" />
		        <button class="button" id="download">Download</button>
		    </div>
		    <div id="content">${html}</div>
		</div>
	  <script>
	  document.getElementById('download').addEventListener('click', function() {
		var element = document.getElementById('content');
		var button = this;
		button.innerText = 'Downloading...';
		button.className = 'downloading';
  
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
		html2pdf(element, opt).from(element).set({
		margin: [0, 0, 0, 0],
		filename: fileName
		}).toPdf().get('pdf').then(function (pdf) {
		pdf.autoTable({ html: element });
		pdf.internal.events.addEventType('onBeforePaging');
		pdf.internal.events.subscribe('onBeforePaging', function (eventData) {
		    var pageCount = pdf.internal.getNumberOfPages();
		    pdf.setFontSize(10);
		    pdf.text('Page ' + eventData.pageNumber + ' of ' + pageCount, 10, pdf.internal.pageSize.height - 10);
		});
		pdf.save();
		});
		html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
		button.innerText = 'Done';
		button.className = 'done';
		setTimeout(function() { 
		  button.innerText = 'Download';
		  button.className = ''; 
		}, 2000);
		}).save();
	  });
	  </script>
	  `;
	var encodedHtml = encodeURIComponent(originalHTML);
	return "data:text/html;charset=utf-8," + encodedHtml;
};
