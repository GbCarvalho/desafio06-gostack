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

    const balance = transactions.reduce(
      (accumulator, transaction) => {
        const key = transaction.type;

        accumulator[key] += Number(transaction.value);

        if (transaction.type === 'income') {
          accumulator.total += Number(transaction.value);
        } else if (transaction.type === 'outcome') {
          accumulator.total -= Number(transaction.value);
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;
