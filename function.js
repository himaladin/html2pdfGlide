document.getElementById('download').addEventListener('click', function() {
    var button = this;
    var margin = 80; // Atur nilai margin sesuai kebutuhan Anda
    var fileName = 'Nama_File'; // Atur nama file sesuai kebutuhan Anda
    var quality = 1.5; // Atur kualitas sesuai kebutuhan Anda
    var orientation = 'portrait'; // Atur orientasi sesuai kebutuhan Anda
    var finalDimensions = [1240, 1754]; // Atur dimensi akhir sesuai kebutuhan Anda

    var opt = {
        margin: margin,
        filename: fileName,
        html2canvas: {
            useCORS: true,
            scale: quality
        },
        jsPDF: {
            unit: 'px',
            orientation: orientation,
            format: finalDimensions,
            hotfixes: ['px_scaling']
        },
    };
    button.innerText = 'Downloading...';
    button.className = 'downloading';

    // Get header (letterhead) and footer image URLs from inputs
    var letterheadUrl = document.getElementById('letterheadUrl').value;
    var footerImageUrl = document.getElementById('footerImageUrl').value;

    setTimeout(function() {
        html2pdf().set(opt).from(document.getElementById('content')).toPdf().get('pdf').then(function(pdf) {
            var pageCount = pdf.internal.getNumberOfPages();
            for (var i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontStyle("medium");
                pdf.setFontSize(12);
                var pageSize = pdf.internal.pageSize;
                var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                pdf.text(pageWidth - (margin + 70), pageHeight - 30, 'Page ' + i + ' of ' + pageCount);
                
                // Add letterhead image to the first page only
                if (i === 1) {
                    pdf.addImage(letterheadUrl, 'PNG', 40, 30, 60, 60);
                }
                // Add footer image to every page
                pdf.addImage(footerImageUrl, 'PNG', 40, pageHeight - 90, 60, 60);
            }
            pdf.save(fileName + '.pdf');
            button.innerText = 'Downloaded';
            button.className = 'downloaded';
        }).catch(function(error) {
            console.error('Error generating PDF:', error);
            button.innerText = 'Error';
            button.className = 'error';
        });
    }, 1000);
}, false);
