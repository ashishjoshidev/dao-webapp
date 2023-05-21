/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { siteConfig } from '@/src/lib/constants/config';
import {
  TokenInfo,
  getTokenInfo,
  toAbbreviatedTokenAmount,
} from '@/src/lib/utils/token';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { HiArrowRight, HiBanknotes } from 'react-icons/hi2';
import { useProvider } from 'wagmi';

export interface ProposalWithdrawAction extends Action {
  params: {
    _amount: BigNumber;
    _tokenAddress: string;
    _to: string;
  };
}

interface WithdrawActionProps extends AccordionItemProps {
  action: ProposalWithdrawAction;
}

/**
 * Shows the details of a withdraw assets action
 * @param props.action Action of type ProposalWithdrawAction to be shown
 * @returns Details of a withdraw assets action wrapped in a GeneralAction component
 */
const WithdrawAction = ({ action, ...props }: WithdrawActionProps) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();

  const provider = useProvider({
    chainId: +siteConfig.PREFERRED_NETWORK_ID,
  });

  useEffect(() => {
    async function fetchTokenInfo() {
      const fetchedTokenInfo = await getTokenInfo(
        action.params._tokenAddress,
        provider,
        PREFERRED_NETWORK_METADATA.nativeCurrency
      );
      setTokenInfo(fetchedTokenInfo);
    }

    if (provider) {
      fetchTokenInfo();
    }
  }, [action]);

  return (
    <ActionWrapper
      icon={HiBanknotes}
      title="Withdraw assets"
      description="Withdraw assets from the DAO treasury"
      {...props}
    >
      <div className="space-y-2">
        <Card
          variant="outline"
          size="sm"
          className="flex flex-row items-center justify-between"
        >
          <p className="text-xl font-medium leading-9">
            {tokenInfo?.name ?? 'Unknown token'}
          </p>
          <p className="text-base text-popover-foreground/80">
            {tokenInfo?.decimals
              ? toAbbreviatedTokenAmount({
                  value: action.params._amount,
                  tokenDecimals: tokenInfo.decimals,
                })
              : '?'}{' '}
            {tokenInfo?.symbol}
          </p>
        </Card>
        <div className="flex flex-row items-center justify-between gap-x-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">From</p>
            <p className="font-medium">DAO Treasury</p>
          </Card>
          <HiArrowRight className="h-4 w-4 shrink-0 text-popover-foreground/80" />
          <Card variant="outline" size="sm" className="font-medium">
            <p className="text-xs font-normal text-popover-foreground/80">To</p>
            <Address
              address={action.params._to}
              maxLength={AddressLength.Medium}
              hasLink={false}
              showCopy={false}
              replaceYou={false}
            />
          </Card>
        </div>
      </div>
    </ActionWrapper>
  );
};

export default WithdrawAction;
