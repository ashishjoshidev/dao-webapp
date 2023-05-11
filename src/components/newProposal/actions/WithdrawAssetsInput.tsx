/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { HiBanknotes, HiXMark } from 'react-icons/hi2';
import { Button } from '@/src/components/ui/Button';
import { AddressPattern, NumberPattern } from '@/src/lib/patterns';
import {
  Control,
  Controller,
  FieldError,
  UseFormRegister,
  useController,
  useWatch,
} from 'react-hook-form';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { MainCard } from '@/src/components/ui/MainCard';
import {
  ActionFormError,
  ProposalFormActions,
} from '@/src/components/newProposal/steps/Actions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select';
import { DaoBalance, useDaoBalance } from '@/src/hooks/useDaoBalance';
import { anyNullOrUndefined, cn } from '@/src/lib/utils';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { useState } from 'react';

export type ProposalFormWithdrawData = {
  name: 'withdraw_assets';
  recipient: string;
  tokenAddress: string | 'custom';
  tokenAddressCustom?: string;
  amount: string;
};

export const emptyWithdrawData: ProposalFormWithdrawData = {
  name: 'withdraw_assets',
  recipient: '',
  tokenAddress: '',
  amount: '',
};

/**
 * @returns Component to be used within a form to describe the action of withdrawing assets.
 */
export const WithdrawAssetsInput = ({
  register,
  prefix,
  errors,
  onRemove,
  control,
}: {
  register: UseFormRegister<ProposalFormActions>;
  prefix: `actions.${number}`;
  errors: ActionFormError<ProposalFormWithdrawData>;
  onRemove: any;
  control: Control<ProposalFormActions, any>;
}) => {
  const { daoBalances, error, loading } = useDaoBalance({});
  const filteredDaoBalances =
    error || loading
      ? []
      : daoBalances.filter(
          (token) =>
            !anyNullOrUndefined(
              token.name,
              token.symbol,
              token.address,
              token.balance
            )
        );

  const address = useWatch({ control, name: `${prefix}.tokenAddress` });

  return (
    <MainCard
      className="flex flex-col gap-4"
      header="Withdraw Assets"
      icon={HiBanknotes}
      variant="light"
      aside={
        <Button
          type="button"
          icon={HiXMark}
          onClick={onRemove}
          variant="ghost"
        />
      }
    >
      <div className="flex flex-col gap-y-1">
        <Label
          htmlFor="recipient"
          tooltip="Address of the wallet to receive the assets"
        >
          Recipient
        </Label>
        <ErrorWrapper name="Recipient" error={errors?.recipient}>
          <Input
            {...register(`${prefix}.recipient`, {
              required: true,
              pattern: {
                value: AddressPattern,
                message:
                  'Please enter an address starting with 0x, followed by 40 address characters',
              },
            })}
            type="text"
            id="recipient"
            error={errors?.recipient}
            placeholder="0x..."
          />
        </ErrorWrapper>
      </div>
      <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1 ">
          <Label tooltip="Token to withdraw" htmlFor="tokenAddress">
            Token
          </Label>
          <Controller
            control={control}
            name={`${prefix}.tokenAddress`}
            render={({ field: { onChange, name, value } }) => (
              <Select
                onValueChange={onChange}
                defaultValue={value}
                name={name}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>DAO treasury</SelectLabel>
                    {filteredDaoBalances.map((token, i) => (
                      <SelectItem key={i} value={token.address ?? ''}>
                        <div className="flex flex-row items-center gap-x-1">
                          <p>
                            {!token.name || token.name === ''
                              ? 'Unknown'
                              : token.name}{' '}
                            -{' '}
                          </p>
                          <TokenAmount
                            amount={token.balance}
                            tokenDecimals={token.decimals}
                            symbol={token.symbol}
                          />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Custom</SelectLabel>
                    <SelectItem key={-1} value={'custom'}>
                      Custom Token Address
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <ErrorWrapper name="Token" error={errors?.tokenAddressCustom}>
            <Input
              error={errors?.tokenAddressCustom}
              className={cn(!(address === 'custom') && 'hidden')}
              placeholder="0x..."
              {...register(`${prefix}.tokenAddressCustom`, {
                validate: (v) => {
                  if (address == 'custom') {
                    const valid =
                      v === undefined ? false : AddressPattern.test(v);
                    return (
                      valid ||
                      'Please enter an address starting with 0x, followed by 40 address characters'
                    );
                  }
                },
              })}
            />
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Amount of tokens to withdraw" htmlFor="amount">
            Amount
          </Label>
          <ErrorWrapper name="Amount" error={errors?.amount}>
            <Input
              {...register(`${prefix}.amount`, {
                required: true,
                pattern: {
                  value: NumberPattern,
                  message: 'Please enter a number, e.g. 3.141',
                },
              })}
              type="text"
              id="amount"
              placeholder="0"
              error={errors?.amount}
            />
          </ErrorWrapper>
        </div>
      </div>
    </MainCard>
  );
};
