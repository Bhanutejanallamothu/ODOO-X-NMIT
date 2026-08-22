/**
 * Utility to generate a formatted text/HTML salary slip report
 */
const generateSalarySlipText = (payroll, profile) => {
  const border = '='.repeat(50);
  const separator = '-'.repeat(50);
  
  return `
${border}
               DAYFLOW HRMS - SALARY SLIP
${border}
Employee Name : ${profile.name}
Employee ID   : ${profile.employee_id}
Department    : ${profile.department || 'N/A'}
Designation   : ${profile.job_title || 'N/A'}
Month/Year    : ${getMonthName(payroll.month)} ${payroll.year}
${separator}
EARNINGS & DEDUCTIONS
${separator}
Base Salary   : $${parseFloat(payroll.base_salary).toFixed(2)}
Allowances    : $${parseFloat(payroll.allowances).toFixed(2)}
Deductions    : $${parseFloat(payroll.deductions).toFixed(2)}
${separator}
NET PAYABLE   : $${parseFloat(payroll.net_salary).toFixed(2)}
${border}
This is a computer-generated document and does not require signature.
`;
};

const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || 'Unknown';
};

module.exports = {
  generateSalarySlipText
};
