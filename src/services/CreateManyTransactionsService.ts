import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import CreateManyCategoriesService from './CreateManyCategoriesService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateManyTransactionsService {
  public async execute(
    categories: string[],
    transactions: CSVTransaction[],
  ): Promise<Transaction[]> {
    const createManyCategories = new CreateManyCategoriesService();
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const finalCategories = await createManyCategories.execute(categories);

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    return createdTransactions;
  }
}

export default CreateManyTransactionsService;
