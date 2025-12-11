export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  studentName: string;
  loanDate: string;
  returnDate: string | null;
  status: 'Active' | 'Returned';
  createdAt: string;
  isOverdue: boolean;
  dueDate?: string;
}

export interface CreateLoanDto {
  bookId: number;
  studentName: string;
  returnDate?: string | null;
}