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
    var footerImageUrl = '${footerImageUrl}';

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
                // Add footer image
                if (footerImageUrl) {
                    pdf.addImage(footerImageUrl, 'PNG', 40, pageHeight - 80, 60, 60);
                }
            }

            // Add letterhead image to first page
            if (letterheadUrl) {
                pdf.setPage(1);
                var firstPageSize = pdf.internal.pageSize;
                pdf.addImage(letterheadUrl, 'PNG', 40, 30, 60, 60);
            }

            pdf.save('${fileName}.pdf');
            button.innerText = 'Downloaded';
            button.className = 'downloaded';
        });
    }, 1000);
}, false);
