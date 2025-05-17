// Document handling functionality

// Function to download report as Word document
async function downloadReportAsWord(reportText) {
    try {
      // This is a simplified approach to create a Word document in the browser
      // For a production app, you would use a server-side approach or a more robust library
      
      // Create a Blob containing the report text in a simple HTML format
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Harassment Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 2cm;
            }
            h1 {
              color: #1E3A8A;
              font-size: 20pt;
              text-align: center;
              margin-bottom: 20pt;
            }
            p {
              font-size: 12pt;
              margin-bottom: 12pt;
            }
          </style>
        </head>
        <body>
          <h1>Harassment Report</h1>
          ${reportText.split('\n').map(line => `<p>${line}</p>`).join('')}
        </body>
        </html>
      `;
      
      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      
      // Create a download link for the Blob
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'harassment_report.doc';
      
      // Click the download link to trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      return true;
    } catch (error) {
      console.error("Error downloading report:", error);
      alert(translateText("An error occurred while downloading the report. Please try again."));
      return false;
    }
  }
  
  // Export the function for use in other files
  window.downloadReportAsWord = downloadReportAsWord;