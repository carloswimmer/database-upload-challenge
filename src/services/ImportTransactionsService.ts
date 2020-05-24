import csvParse from 'csv-parse';
import fs from 'fs';

import CreateManyTransactionsService from './CreateManyTransactionsService';
import Transaction from '../models/Transaction';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const createManyTransactions = new CreateManyTransactionsService();

    const readStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
      relax: true,
      relax_column_count: true,
    });

    const parseCSV = readStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const cleanLine = line.map((cell: string) => cell.trim());

      const [title, type, value, category] = cleanLine;

      if (!title || !type || !category) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const savedTransactions = await createManyTransactions.execute(
      categories,
      transactions,
    );

    await fs.promises.unlink(filePath);

    return savedTransactions;
  }
}

export default ImportTransactionsService;
