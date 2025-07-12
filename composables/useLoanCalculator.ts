import type { LoanInput } from "~/types/loan";

export function useLoanCalculator(input: LoanInput) {
  const { amount, interestRate, years, months, startDate } = input;

  const totalMonths = years * 12 + months;
  const monthlyRate = interestRate / 100 / 12;

  const schedule = [];
  let remaining = amount;
  let totalInterest = 0;
  let monthlyPayment = 0;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = remaining * monthlyRate;
    const principal = amount / totalMonths;
    const total = interest + principal;
    remaining -= principal;
    totalInterest += interest;

    if (i === 1) {
      monthlyPayment = total;
    }

    schedule.push({
      installment: i,
      date: formatDateAddMonths(startDate, i - 1),
      interest: Math.round(interest),
      principal: Math.round(principal),
      total: Math.round(total),
      remaining: Math.max(0, Math.round(remaining)),
    });
  }

  return {
    summary: {
      amount,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(amount + totalInterest),
    },
    schedule,
  };
}

function formatDateAddMonths(startDate: string, offset: number) {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + offset);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
  });
}
