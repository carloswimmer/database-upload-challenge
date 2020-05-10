// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
    const categoryRepository = getRepository(Category);
    const createCategory = new CreateCategoryService();

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    const { id } =
      checkCategoryExists || (await createCategory.execute(category));

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
