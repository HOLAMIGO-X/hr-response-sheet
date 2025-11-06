# M-Swasth Nurse Feedback Dashboard

A comprehensive, interactive dashboard for analyzing nurse feedback responses with bilingual support (English and Hindi).

## Features

### 📊 Data Visualization
- **Interactive Charts**: Multiple chart types including bar charts, pie charts, doughnut charts, and radar charts
- **Real-time Analytics**: Instant data processing and visualization upon file upload
- **Comprehensive Metrics**:
  - Total responses
  - Average recommendation scores
  - Overall satisfaction rates
  - Data quality indicators

### 🌐 Bilingual Support
- **English Version**: Full support for English feedback forms
- **Hindi Version**: Complete support for Hindi feedback forms (हिंदी)
- Auto-detection of language based on uploaded file

### 📁 File Upload
- **Multiple Formats**: Supports both CSV and XLSX file formats
- **Drag & Drop**: Easy file upload with drag and drop functionality
- **No Database Required**: Works entirely in the browser without backend

### 📥 Export Capabilities
- **Export as Image**: Download the entire dashboard as a high-quality PNG image
- **Export as CSV**: Download the processed data as CSV for further analysis

### 📈 Analytics Included

1. **Tablet & Internet Issues**
   - Internet connectivity problems
   - Tablet functionality status

2. **Workplace Safety & Comfort**
   - Safety perceptions
   - Clinic conditions
   - Equipment functionality

3. **Support & Resources**
   - Medicine availability
   - Manager helpfulness
   - Resource accessibility

4. **Patient Interaction**
   - Patient behavior
   - Trust levels
   - Communication effectiveness

5. **Recommendation Score Distribution**
   - Net Promoter Score (1-10 rating)
   - Visual distribution of ratings

6. **Overall Satisfaction Metrics**
   - Radar chart showing multiple satisfaction dimensions
   - Comparative analysis across different aspects

7. **Key Insights**
   - Automated insights based on response patterns
   - Warning alerts for concerning trends
   - Success highlights for positive metrics

## How to Use

### Step 1: Open the Dashboard
Simply open the `index.html` file in any modern web browser:
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

### Step 2: Upload Your Data
1. Click on the upload area or drag and drop your file
2. Supported formats: `.csv`, `.xlsx`
3. The dashboard will automatically detect the language and process the data

### Step 3: View Analytics
- Explore various charts and visualizations
- Review key statistics in the stat cards
- Read automated insights and recommendations

### Step 4: Export Data
- **Download as Image**: Click the "Download as Image" button to save the dashboard as PNG
- **Download as CSV**: Click the "Download as CSV" button to export the data

## File Structure

```
hr project now/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Dashboard logic and chart rendering
├── README.md           # This documentation file
└── sample_data.json    # Sample data structure (for reference)
```

## Technical Details

### Technologies Used
- **HTML5**: Structure and layout
- **CSS3**: Styling with modern design patterns
- **JavaScript (ES6+)**: Data processing and interactivity
- **Chart.js**: Chart rendering and visualization
- **html2canvas**: Dashboard export as image
- **SheetJS (XLSX)**: Excel file parsing

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Dependencies
All dependencies are loaded via CDN:
- Chart.js v4.4.0
- html2canvas v1.4.1
- SheetJS (XLSX) v0.18.5

## Data Privacy
- **100% Client-Side**: All data processing happens in your browser
- **No Server Upload**: Files are never uploaded to any server
- **No Data Storage**: Data is only stored in browser memory during the session

## Supported Questions/Fields

### English Version
- Timestamp
- Email address
- Name and Employee ID
- Tablet functionality questions
- Internet connectivity issues
- Doctor interaction quality
- Clinic conditions and safety
- Medicine availability
- Manager support
- Monthly targets
- Patient relationships
- Equipment status
- Training needs
- Career growth perception
- Recommendation ratings (1-10)
- And more...

### Hindi Version (हिंदी)
- All corresponding questions in Hindi
- Same analytics and visualizations
- Full Unicode support

## Customization

### Adding New Charts
Edit `script.js` and add new chart configurations in the `initializeCharts()` function.

### Modifying Styles
Edit `style.css` to change colors, fonts, layouts, etc.

### Changing Question Mappings
Update the `questionMappings` object in `script.js` to map different column names.

## Troubleshooting

### Dashboard Not Loading
- Ensure you're opening the file in a modern web browser
- Check browser console for any errors
- Verify that all files are in the same directory

### Charts Not Displaying
- Make sure your data file has the correct column names
- Verify that responses contain valid data (Yes/No/Sometimes or हाँ/नहीं/कभी-कभी)
- Check browser console for errors

### Export Not Working
- For image export, ensure html2canvas library is loaded
- For CSV export, check that data is properly loaded
- Try refreshing the page and uploading the file again

### Language Detection Issues
- The dashboard auto-detects language based on column headers
- Ensure your file uses consistent language in column names
- Hindi files should have Hindi column headers

## Sample Data Format

### CSV Format
```csv
Timestamp,Name and Employee ID,Is the tablet working well for consultations?,...
2025-05-20 16:41:59,John Doe 1234,Yes,...
```

### XLSX Format
Excel files with headers in the first row and data in subsequent rows.

## Performance

- **Fast Loading**: Optimized for files with up to 1000 responses
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Memory Efficient**: Processes data without storing unnecessary copies

## Future Enhancements

Potential features for future versions:
- Advanced filtering and sorting
- Comparison between time periods
- Sentiment analysis for text responses
- PDF export capability
- Custom report generation
- Data aggregation by location or department

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify your data format matches the expected structure
3. Ensure all files are in the same directory
4. Try with the sample data files provided

## License

This dashboard is created for M-Swasth nurse feedback analysis.

## Credits

Developed using modern web technologies with focus on:
- User-friendly interface
- Data privacy
- Bilingual support
- Comprehensive analytics

---

**Last Updated**: November 2025
**Version**: 1.0.0
