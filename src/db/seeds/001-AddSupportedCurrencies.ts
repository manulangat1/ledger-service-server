import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Currency } from '../entities/currency.entity';
import fetchRecordCount from '../../common/utils/fetchRecordCount';

export class AddSupportedCurrencies1763754554656 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const currencies: Partial<Currency>[] = [
      {
        id: 1,
        currency: 'KES',
        minimumTopUpAmount: 1000,
        maximumWithdrawableAmount: 10000,
        name: 'KENYAN',
        alias: 'KENYAN',
      },
    ];
    const recordsCount = await fetchRecordCount(Currency, dataSource);

    if (recordsCount < 1) {
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(Currency)
        .values(currencies)
        .execute();
    }
  }
}
