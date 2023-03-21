import { HiPlus } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HeaderCard } from '../components/ui/HeaderCard';
import Loader from '../components/ui/Loader';
import { DaoBalance, useDaoBalance } from '../hooks/useDaoBalance';

const Finance = () => {
  const { daoBalances, loading, error } = useDaoBalance({});

  console.log(daoBalances);

  const bigIntToFloat = (
    value: BigInt | null,
    decimals: number | null,
    onError = '-'
  ): number =>
    parseFloat(value && decimals ? `${value}E-${decimals}` : onError);

  const DaoTokens = (): JSX.Element => {
    if (loading) return <Loader></Loader>;

    return (
      <div className="space-y-2">
        {daoBalances.map((balance: DaoBalance) => (
          <Card
            padding="sm"
            variant="light"
            className="p-4 dark:bg-slate-700/50"
          >
            <div>{balance.name}</div>
            <div>
              {bigIntToFloat(balance.balance, balance.decimals).toFixed(2)}
              &nbsp;{balance.symbol ?? ''}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        <HeaderCard
          title="Finance"
          aside={<Button label="New transfer" icon={HiPlus}></Button>}
        ></HeaderCard>
      </div>
      <Card className="my-6">
        <h2 className="text-xl font-bold">Tokens</h2>
        <DaoTokens />
      </Card>
    </div>
  );
};

export default Finance;
