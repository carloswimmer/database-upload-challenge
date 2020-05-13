import { getRepository } from 'typeorm';

import Category from '../models/Category';

class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const existentCategory = await categoryRepository.findOne({
      where: { title },
    });

    const category = existentCategory || categoryRepository.create({ title });

    await categoryRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
