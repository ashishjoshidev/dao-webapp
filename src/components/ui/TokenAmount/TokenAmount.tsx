import { TransferType } from '@aragon/sdk-client';
import React from 'react';

interface TokenAmountProps extends HTMLSpanElement {
  amount?: BigInt | null;
  tokenDecimals?: number | null;
  symbol?: string | null;
  sign?: string;
  onError?: string;
  displayDecimals?: number;
}

export const bigIntToFloat = (
  value: BigInt | null,
  decimals: number | null,
  onError: string = '-'
): number => parseFloat(value && decimals ? `${value}E-${decimals}` : onError);

// Taken from Aragon App
export function abbreviateTokenAmount(amount: string): string {
  if (!amount) return 'N/A';

  const TOKEN_AMOUNT_REGEX =
    /(?<integers>[\d*]*)[.]*(?<decimals>[\d]*)\s*(?<symbol>[A-Za-z]*)/;
  const regexp_res = amount.match(TOKEN_AMOUNT_REGEX);

  // discard failed matches
  if (regexp_res?.length !== 4 || regexp_res[0].length !== amount.length)
    return 'N/A';

  // retrieve capturing groups
  const integers = regexp_res[1];
  const decimals = regexp_res[2];
  const symbol = regexp_res[3];

  if (integers?.length > 4) {
    const integerNumber = Number.parseInt(integers);
    const magnitude = Math.floor((integers.length - 1) / 3);
    const lead = Math.floor(integerNumber / Math.pow(10, magnitude * 3));
    const magnitude_letter = ['k', 'M', 'G'];

    return `${lead}${
      magnitude < 4
        ? magnitude_letter[magnitude - 1]
        : '*10^' + Math.floor(magnitude) * 3
    }${symbol && ' ' + symbol}`;
  }

  if (decimals) {
    const fraction = '0.' + decimals;
    const fractionNumber = Number.parseFloat(fraction);
    const intNumber = Number.parseInt(integers);
    const totalNumber = intNumber + fractionNumber;

    if (totalNumber < 0.01) {
      return ` < 0.01${symbol && ' ' + symbol}`;
    }

    return `${totalNumber.toFixed(2)}${symbol && ' ' + symbol}`;
  }

  return `${Number.parseInt(integers)}${symbol && ' ' + symbol}`;
}

/**
 * @param className - ClassName to pass
 * @param amount - The amount of the given token, default value is 1
 * @param decimals - The amount of decimals the token uses to represent its value. Default is zero
 *                   Tokens are a BigInt, where decimals represents where the decimal symbol is placed
 * @param symbol - The symbol of the token, e.g. LINK, ETH, JSCL. Default is empty string.
 * @param sign - optional sign. Default value '' (empty string). Recommended values: '' (empty string), + (plus) or - (minus).
 * @param onError - Value to display if something went wrong. Default value '-'.
 */
const TokenAmount = ({
  className = '',
  amount,
  tokenDecimals,
  symbol,
  sign = '',
  onError = '-',
}: TokenAmountProps) => {
  return (
    <span className={className}>
      {sign}
      {abbreviateTokenAmount(
        bigIntToFloat(amount ?? 1n, tokenDecimals ?? 0, onError).toFixed(2)
      )}
      &nbsp;
      {symbol ?? ''}
    </span>
  );
};

export const transfertypeToSign = (tt: TransferType) =>
  tt === TransferType.WITHDRAW ? '-' : '+';

export default TokenAmount;
