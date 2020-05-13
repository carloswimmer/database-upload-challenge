import { getRepository, In } from 'typeorm';

import Category from '../models/Category';

class CreateManyCategoriesService {
  public async execute(categories: string[]): Promise<Category[]> {
    const categoriesRepository = getRepository(Category);

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoryTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentCategoryTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    return finalCategories;
  }
}

export default CreateManyCategoriesService;
