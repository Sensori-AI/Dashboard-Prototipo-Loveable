export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = async (data: any[], filename: string) => {
  // For Excel export, we'll create a more structured format
  // This is a simple implementation - for more complex needs, use a library like xlsx
  
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  
  // Create HTML table for Excel
  let html = '<table>';
  html += '<thead><tr>';
  headers.forEach(header => {
    html += `<th style="background-color: #10b981; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd;">${header}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      html += `<td style="padding: 8px; border: 1px solid #ddd;">${row[header] || ''}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  
  // Create blob and download
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const prepareReportData = (report: any) => {
  return [{
    'Data de Geração': new Date(report.generated_at).toLocaleString('pt-BR'),
    'Período': report.period,
    'Setores': report.sectors.join(', '),
    'Índice de Vigor (%)': report.data.vigor,
    'Falhas Detectadas (%)': report.data.falhas,
    'Daninhas Identificadas (%)': report.data.daninhas,
    'Área Total (ha)': report.data.area,
    'Status': report.summary.status,
  }];
};
