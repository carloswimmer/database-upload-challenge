import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const totalIncome = transactions.reduce(
      (total: number, transaction) =>
        transaction.type === 'income' ? total + transaction.value : total,
      0,
    );

    const totalOutcome = transactions.reduce(
      (total: number, transaction) =>
        transaction.type === 'outcome' ? total + transaction.value : total,
      0,
    );

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
