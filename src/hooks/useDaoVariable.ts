/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { isNullOrUndefined } from '@/src/lib/utils';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';
import { BigNumber } from 'ethers';

export type UseDaoVariableData = {
  loading: boolean;
  error: string | null;
  value: FetchVariableResult | null;
};

export type UseDaoVariableProps = {
  interfaceName?: string;
  variableName?: string;
  useDummyData?: boolean;
};

export type FetchVariableResult =
  | string
  | BigNumber
  | number
  | null
  | undefined;

export const fetchVariableValue = async (
  interfaceName: string,
  variableName: string,
  client: DiamondGovernanceClient
): Promise<FetchVariableResult> => {
  const facet: any = await (client.pure as any)[interfaceName]();
  const value: any = await facet[`get${variableName}`]();
  return value as FetchVariableResult;
};

export const useDaoVariable = ({
  interfaceName,
  variableName,
  useDummyData = false,
}: UseDaoVariableProps): UseDaoVariableData => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<FetchVariableResult | null>(null);
  const { anonClient } = useDiamondSDKContext();

  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setValue(1);
  };

  const setVariableValue = async (client: DiamondGovernanceClient) => {
    if (isNullOrUndefined(interfaceName) || isNullOrUndefined(variableName)) {
      return;
    }
    try {
      const _value = await fetchVariableValue(
        interfaceName,
        variableName,
        client
      );
      setValue(_value);
    } catch (e) {
      console.error(e);
      setError('Variable value could not be retrieved');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (useDummyData) return setDummyData();
    if (!anonClient) return;
    setVariableValue(anonClient);
  }, [anonClient, interfaceName, variableName]);

  return {
    loading,
    error,
    value,
  };
};