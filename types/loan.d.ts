export interface LoanInput {
  amount: number;
  interestRate: number;
  years: number;
  months: number;
  startDate: string;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amount: number;
}

export interface InstallmentRow {
  installment: number;
  date: string;
  principal: number;
  interest: number;
  total: number;
  remaining: number;
}
