import { useAragonSDKContext } from '@/src/context/AragonSDK';

import {
  Client,
  ITransferQueryParams,
  SortDirection,
  TokenType,
  Transfer,
  TransferSortBy,
  TransferType,
} from '@aragon/sdk-client';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../lib/utils';

export type UseDaoTransfersData = {
  daoTransfers: Transfer[] | null;
  loading: boolean;
  error: string | null;
};

export type UseDaoTransfersProps = {
  useDummyData?: boolean;
  limit?: number;
};

export const useDaoTransfers = ({
  useDummyData = false,
  limit = 10,
}: UseDaoTransfersProps): UseDaoTransfersData => {
  const [daoTransfers, setDaoTransfers] = useState<Transfer[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useAragonSDKContext();

  const fetchDaoTransfers = async (client: Client) => {
    if (!import.meta.env.VITE_DAO_ADDRESS) {
      setLoading(false);
      setError("DAO address env variable isn't set");
      return;
    }

    const address: string = import.meta.env.VITE_DAO_ADDRESS;

    const params: ITransferQueryParams = {
      daoAddressOrEns: address,
      sortBy: TransferSortBy.CREATED_AT, // optional
      limit: limit, // optional
      skip: 0, // optional
      direction: SortDirection.DESC, // optional, options: DESC or ASC
    };

    try {
      const daoTransfers: Transfer[] | null =
        await client.methods.getDaoTransfers(params);
      setDaoTransfers(daoTransfers);
      if (loading) setLoading(false);
      if (error) setError(null);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(getErrorMessage(e));
    }
  };

  const setDummyData = () => {
    if (loading) setLoading(false);
    if (error) setError(null);

    const data: Transfer[] = [
      {
        type: TransferType.WITHDRAW,
        tokenType: TokenType.ERC20,
        token: {
          address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          decimals: 18,
        },
        amount: 1000000000000000n,
        creationDate: new Date(2023, 2, 22),
        from: '0xdaoaddres',
        transactionId:
          '0xdb0f9422b5c3199021481c98a655741ca16119ff8a59571854a94a6f31dad7ba',
        to: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        proposalId: '0x1234567890123456789012345678901234567890_0x0',
      },
      {
        type: TransferType.DEPOSIT,
        tokenType: TokenType.NATIVE,
        amount: 1000000000000000n,
        creationDate: new Date(2023, 2, 21),
        transactionId:
          '0xc18b310b2f8cf427d95fa905dc842df2cf999075f18579afbcbdce19f8db0a30',
        from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        to: '0xdaoAddres',
      },
      {
        type: TransferType.DEPOSIT,
        tokenType: TokenType.ERC20,
        token: {
          address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          decimals: 18,
        },
        amount: 1000000000000000n,
        creationDate: new Date(2023, 2, 20),
        transactionId:
          '0xdd8fff77c1f3e819d4224f8d02a00583c7e5d55475b8a9d70867aee0d6d16f07',
        from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        to: '0xdaoAddress',
      },
    ];

    setDaoTransfers(data);
  };

  useEffect(() => {
    if (!client) return;
    if (useDummyData) return setDummyData();
    fetchDaoTransfers(client);
  }, [client]);

  return {
    loading,
    error,
    daoTransfers,
  };
};