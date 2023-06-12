/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useEffect, useState } from 'react';
import DAI from '@/src/components/icons/DAI';
import Secoin from '@/src/components/icons/Secoin';
import { Button } from '@/src/components/ui/Button';
import {
  ConditionalButton,
  ConnectWalletWarning,
  InsufficientGasWarning,
  Warning,
} from '@/src/components/ui/ConditionalButton';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/Popover';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useSecoinBalance } from '@/src/hooks/useSecoinBalance';
import { TOKENS } from '@/src/lib/constants/tokens';
import { abc } from '@plopmenz/diamond-governance-sdk/dist/typechain-types/contracts/facets/token/ERC20/monetary-token';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetFocus,
  UseFormSetValue,
  useForm,
  useFormState,
  useWatch,
} from 'react-hook-form';
import {
  HiArrowsRightLeft,
  HiCog6Tooth,
  HiOutlineArrowsUpDown,
} from 'react-icons/hi2';
import { useAccount, useBalance } from 'wagmi';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/Accordion';
import CategoryList from '../components/ui/CategoryList';
import { ErrorText, ErrorWrapper } from '../components/ui/ErrorWrapper';
import TokenAmount from '../components/ui/TokenAmount';
import { PREFERRED_NETWORK_METADATA } from '../lib/constants/chains';
import { NumberPattern } from '../lib/constants/patterns';
import { cn } from '../lib/utils';
import { parseTokenAmount } from '../lib/utils/token';

const abcTokens = [
  {
    name: 'DAI',
    contractAddress: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', //on polygon mumbai
  },
  {
    name: TOKENS.secoin.symbol,
  },
];

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case 'DAI':
      return <DAI className="h-5 w-5" />;
    case TOKENS.secoin.symbol:
      return <Secoin className="h-5 w-5 text-white stroke-primary" />;
    default:
      return null;
  }
};

const decimals = 18;

interface IFormInputs {
  fromToken: string;
  slippage: string;
}
const Swap = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    defaultValues: {
      slippage: '1', // 1% as default
    },
    shouldUnregister: false,
    mode: 'onChange',
  });

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
  };

  const { secoinAddress } = useDiamondSDKContext();
  const { address, isConnected } = useAccount();

  const { secoinBalance } = useSecoinBalance({ address });
  const { data: daiBalance } = useBalance({
    address,
    token: abcTokens[0].contractAddress as any,
  });

  const [swap, setSwap] = useState<'Mint' | 'Burn'>('Mint');
  const from = swap === 'Mint' ? abcTokens[0] : abcTokens[1];
  const to = swap === 'Mint' ? abcTokens[1] : abcTokens[0];

  const max = swap === 'Mint' ? daiBalance?.value : secoinBalance;

  const setMaxValue = () => {
    if (max !== undefined) {
      setValue('fromToken', formatUnits(max, decimals));
    }
  };
  const amount = 0;
  const enoughGas = true;
  const slippageWatch = useWatch({ control, name: 'slippage' });

  return (
    <div className="w-full min-h-full flex items-center justify-center">
      <MainCard
        header="Swap"
        icon={HiArrowsRightLeft}
        className="max-w-[40rem] relative gap-y-2" // Add relative here
        aside={
          <SwapSettings
            setValue={setValue}
            errors={errors}
            register={register}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* From token */}
          <Label>From:</Label>
          <div className="flex p-4 h-24 bg-popover text-popover-foreground rounded-md border border-input">
            <Input
              {...register('fromToken', {
                pattern: {
                  value: NumberPattern,
                  message: 'Invalid token amount',
                },
                validate: {
                  max: (v) =>
                    max === undefined ||
                    (parseTokenAmount(v, decimals) ?? 0) <= max ||
                    'Token amount too high',
                },
              })}
              className="border-none text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] focus:ring-0 focus:ring-offset-0"
              autoFocus
              error={errors.fromToken}
              placeholder={'0.0'}
            />
            <div className="flex flex-col gap-1 items-end">
              <div className="rounded-full bg-primary w-fit h-fit px-2 py-0.5 flex gap-x-2 items-center justify-center text-primary-foreground">
                <Icon name={from.name} />
                {from.name}
              </div>
              {max === undefined || (
                <MaxButton max={max} setMaxValue={setMaxValue} />
              )}
            </div>
          </div>
          {/* Swap button */}
          <div className="absolute left-1/2 -translate-y-5 -translate-x-1/2">
            <Button
              onClick={() => {
                setSwap(swap === 'Burn' ? 'Mint' : 'Burn');
              }}
              className="h-8 px-0 w-8"
              type="button"
            >
              <span className="sr-only">Swap order</span>
              <HiOutlineArrowsUpDown className="h-5 w-5" />
            </Button>
          </div>
          {/* To token */}
          <div className="flex p-4 h-24 bg-popover text-popover-foreground rounded-md border border-input">
            <span className="text-2xl text-popover-foreground/70 w-full px-3">
              {amount}
            </span>
            <div className="flex flex-col gap-1 items-end">
              <div className="rounded-full bg-primary w-fit h-fit px-2 py-0.5 flex gap-x-2 items-center justify-center text-primary-foreground">
                <Icon name={to.name} />
                {to.name}
              </div>
            </div>
          </div>
          <ErrorText name="Token amount" error={errors.fromToken} />
          {/* Submit button */}
          <ConditionalButton
            className="leading-4 w-full mb-1"
            flex="flex-col"
            conditions={[
              {
                when: !isConnected,
                content: <ConnectWalletWarning action="to swap" />,
              },
              {
                when: !enoughGas,
                content: <InsufficientGasWarning />,
              },
              {
                when: !isValid,
                content: <Warning>Form input is invalid</Warning>,
              },
            ]}
            type="submit"
          >
            Swap
          </ConditionalButton>
        </form>
        <hr className="border-2 border-accent" />
        <Accordion
          type="single"
          collapsible
          className="space-y-2"
          defaultValue="0"
        >
          <AccordionItem value="0">
            <AccordionTrigger className="flex w-full flex-col">
              <p className="lowercase first-letter:capitalize">Summary</p>
            </AccordionTrigger>
            <AccordionContent>
              <CategoryList
                categories={[
                  {
                    title: 'GAS',
                    items: [
                      {
                        label: 'GAS fee',
                        value: (
                          <TokenAmount
                            amountFloat={0.01}
                            tokenDecimals={
                              PREFERRED_NETWORK_METADATA.nativeCurrency.decimals
                            }
                            symbol={
                              PREFERRED_NETWORK_METADATA.nativeCurrency.symbol
                            }
                          />
                        ),
                      },
                    ],
                  },
                  {
                    title: 'Value to be received',
                    items: [
                      {
                        label: `minimum (slippage ${slippageWatch}%)`,
                        value: (
                          <TokenAmount
                            amountFloat={0.01}
                            tokenDecimals={decimals}
                            symbol={to.name}
                          />
                        ),
                      },
                      {
                        label: 'expected',
                        value: (
                          <TokenAmount
                            amountFloat={0.02}
                            tokenDecimals={decimals}
                            symbol={to.name}
                          />
                        ),
                      },
                    ],
                  },
                ]}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </MainCard>
    </div>
  );
};
export default Swap;

const MaxButton = ({
  max,
  setMaxValue,
}: {
  max: BigNumber;
  setMaxValue: () => void;
}) => {
  return (
    <div className="inline-flex items-center justify-center gap-x-1">
      <TokenAmount amount={max} tokenDecimals={decimals} />
      <button
        type="button"
        onClick={setMaxValue}
        className="w-full p-1 h-fit text-blue-500 underline underline-offset-2 active:scale-95 hover:text-blue-300"
      >
        Max
      </button>
    </div>
  );
};

export const SwapSettings = ({
  register,
  setValue,
  errors,
}: {
  register: UseFormRegister<IFormInputs>;
  setValue: UseFormSetValue<IFormInputs>;
  errors: FieldErrors<IFormInputs>;
}) => {
  const slippageOptions = ['0.5', '1', '2'];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-10 p-0',
            errors.slippage && 'bg-destructive-background'
          )}
          type="button"
        >
          <span className="sr-only">Swap settings</span>
          <HiCog6Tooth className="h-5 w-5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Slippage Tolerance</h4>
            <p className="text-sm text-muted-foreground">
              Set the slippage tolerance for the swap.
            </p>
          </div>
          <div className="flex gap-x-1 items-center justify-center">
            {slippageOptions.map((option) => (
              <Button
                key={option}
                onClick={() => setValue('slippage', option)}
                type="button"
                size="xs"
              >
                {option}%
              </Button>
            ))}
            <Input
              {...register('slippage', {
                required: true,
                min: { value: 0, message: 'Slippage is too low' },
                max: { value: 100, message: 'Slippage is too high' },
                valueAsNumber: true,
              })}
              className="h-8"
              type="number"
              min={0}
              max={100}
              step={0.1}
              error={errors.slippage}
              autoFocus
            />
            <Label>%</Label>
          </div>
          <ErrorText name="Slippage" error={errors.slippage} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
