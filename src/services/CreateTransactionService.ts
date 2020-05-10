// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const createCategory = new CreateCategoryService();

    const { id } = await createCategory.execute(category);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
