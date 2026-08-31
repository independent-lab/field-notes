export {};

const root = document.querySelector<HTMLElement>('[data-ber-calculator]');

if (root) {
  // Philippine payroll planning assumptions. Keep grouped for straightforward updates.
  const PAYROLL = {
    sss: { employeeRate: 0.05, minimumMsc: 5_000, maximumMsc: 35_000, mscStep: 500 },
    gsis: { employeeRate: 0.09 },
    philHealth: { totalRate: 0.05, employeeShare: 0.5, salaryFloor: 10_000, salaryCeiling: 100_000 },
    pagIbig: { lowSalaryThreshold: 1_500, lowRate: 0.01, standardRate: 0.02, salaryBaseCeiling: 10_000 },
    thirteenthMonthExemption: 90_000,
  } as const;

  const salaryInput = root.querySelector<HTMLInputElement>('[data-salary]')!;
  const saveInput = root.querySelector<HTMLInputElement>('[data-save-percent]')!;
  const christmasInput = root.querySelector<HTMLInputElement>('[data-christmas-percent]')!;
  const monthsInput = root.querySelector<HTMLSelectElement>('[data-months]')!;
  const employmentButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-employment] [data-value]'));
  const resetButton = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
  let employment: 'sss' | 'gsis' = 'sss';

  const annualTax = (income: number) => {
    const taxable = Math.max(0, income);
    if (taxable <= 250_000) return 0;
    if (taxable <= 400_000) return (taxable - 250_000) * 0.15;
    if (taxable <= 800_000) return 22_500 + (taxable - 400_000) * 0.20;
    if (taxable <= 2_000_000) return 102_500 + (taxable - 800_000) * 0.25;
    if (taxable <= 8_000_000) return 402_500 + (taxable - 2_000_000) * 0.30;
    return 2_202_500 + (taxable - 8_000_000) * 0.35;
  };

  const sssEmployee = (salary: number) => {
    if (salary <= 0) return 0;
    const roundedMsc = Math.round(salary / PAYROLL.sss.mscStep) * PAYROLL.sss.mscStep;
    const msc = Math.min(PAYROLL.sss.maximumMsc, Math.max(PAYROLL.sss.minimumMsc, roundedMsc));
    return msc * PAYROLL.sss.employeeRate;
  };

  const philHealthEmployee = (salary: number) => {
    if (salary <= 0) return 0;
    const base = Math.min(PAYROLL.philHealth.salaryCeiling, Math.max(PAYROLL.philHealth.salaryFloor, salary));
    return base * PAYROLL.philHealth.totalRate * PAYROLL.philHealth.employeeShare;
  };

  const pagIbigEmployee = (salary: number) => {
    if (salary <= 0) return 0;
    const base = Math.min(PAYROLL.pagIbig.salaryBaseCeiling, salary);
    const rate = salary <= PAYROLL.pagIbig.lowSalaryThreshold ? PAYROLL.pagIbig.lowRate : PAYROLL.pagIbig.standardRate;
    return base * rate;
  };

  const setText = (selector: string, value: string) => {
    const element = root.querySelector<HTMLElement>(selector);
    if (element) element.textContent = value;
  };

  const render = () => {
    const salary = Math.max(0, Math.min(10_000_000, Number(salaryInput.value) || 0));
    const saveRate = Number(saveInput.value) / 100;
    const christmasRate = Number(christmasInput.value) / 100;
    const monthsWorked = Math.max(1, Math.min(12, Number(monthsInput.value) || 12));
    const social = employment === 'sss' ? sssEmployee(salary) : salary * PAYROLL.gsis.employeeRate;
    const philHealth = philHealthEmployee(salary);
    const pagIbig = pagIbigEmployee(salary);
    const monthlyMandatory = social + philHealth + pagIbig;
    const annualRegularTaxable = Math.max(0, salary * 12 - monthlyMandatory * 12);
    const annualRegularTax = annualTax(annualRegularTaxable);
    const monthlyTax = annualRegularTax / 12;
    const totalDeductions = monthlyMandatory + monthlyTax;
    const netSalary = Math.max(0, salary - totalDeductions);
    const monthlySave = netSalary * saveRate;
    const spendable = Math.max(0, netSalary - monthlySave);

    const thirteenthGross = salary * monthsWorked / 12;
    const taxableThirteenth = Math.max(0, thirteenthGross - PAYROLL.thirteenthMonthExemption);
    const thirteenthExtraTax = Math.max(0, annualTax(annualRegularTaxable + taxableThirteenth) - annualRegularTax);
    const thirteenthNet = Math.max(0, thirteenthGross - thirteenthExtraTax);
    const decemberPot = monthlySave * 4 + thirteenthNet;
    const enjoy = decemberPot * christmasRate;
    const keep = decemberPot - enjoy;

    setText('[data-save-output]', `${Math.round(saveRate * 100)}%`);
    setText('[data-christmas-output]', `${Math.round(christmasRate * 100)}%`);
    setText('[data-gross]', peso.format(salary));
    setText('[data-social-label]', employment === 'sss' ? 'SSS' : 'GSIS');
    setText('[data-social]', peso.format(social));
    setText('[data-philhealth]', peso.format(philHealth));
    setText('[data-pagibig]', peso.format(pagIbig));
    setText('[data-tax]', peso.format(monthlyTax));
    setText('[data-total-deductions]', peso.format(totalDeductions));
    setText('[data-net]', peso.format(netSalary));
    setText('[data-monthly-save]', peso.format(monthlySave));
    setText('[data-spendable]', peso.format(spendable));
    setText('[data-thirteenth-gross]', peso.format(thirteenthGross));
    setText('[data-thirteenth-tax]', peso.format(thirteenthExtraTax));
    setText('[data-thirteenth-net]', peso.format(thirteenthNet));
    setText('[data-december-pot]', peso.format(decemberPot));
    setText('[data-keep]', peso.format(keep));
    setText('[data-enjoy]', peso.format(enjoy));
    setText('[data-tax-note]', taxableThirteenth > 0
      ? `${peso.format(taxableThirteenth)} is above the ₱90,000 combined exemption ceiling in this estimate, adding about ${peso.format(thirteenthExtraTax)} in tax.`
      : 'The estimated 13th month stays within the ₱90,000 combined exemption ceiling, assuming no other qualifying benefits use part of it.');

    const timeline = root.querySelector<HTMLElement>('[data-timeline]')!;
    const months = ['September', 'October', 'November', 'December 15'];
    timeline.innerHTML = months.map((month, index) => {
      const amount = monthlySave * (index + 1) + (index === 3 ? thirteenthNet : 0);
      const note = index === 3 ? 'with estimated 13th month' : 'salary savings so far';
      return `<div class="timeline-item"><span>${month}</span><strong>${peso.format(amount)}</strong><small>${note}</small></div>`;
    }).join('');

    const allocation = [
      ['🎁 Presents', 0.45], ['🥂 Parties / gatherings', 0.20], ['🍝 Noche Buena / food', 0.15], ['🚕 Transport / extras', 0.10], ['✨ Buffer', 0.10],
    ] as const;
    root.querySelector<HTMLElement>('[data-allocation]')!.innerHTML = allocation.map(([label, share]) =>
      `<div class="allocation-item"><span class="label">${label}<small>${Math.round(share * 100)}%</small></span><span class="bar"><i style="width:${share * 100}%"></i></span><strong>${peso.format(enjoy * share)}</strong></div>`
    ).join('');
  };

  employmentButtons.forEach((button) => button.addEventListener('click', () => {
    employment = button.dataset.value === 'gsis' ? 'gsis' : 'sss';
    employmentButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  }));

  [salaryInput, saveInput, christmasInput, monthsInput].forEach((input) => input.addEventListener('input', render));
  resetButton.addEventListener('click', () => {
    salaryInput.value = '50000';
    saveInput.value = '10';
    christmasInput.value = '60';
    monthsInput.value = '12';
    employment = 'sss';
    employmentButtons.forEach((button) => {
      const active = button.dataset.value === 'sss';
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();
  });

  render();
}
