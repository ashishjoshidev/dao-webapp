/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ProposalActions from '@/src/components/proposal/ProposalActions';
import {
  dummyChangeParamsAction,
  dummyMergeAction,
  dummyMintAction,
  dummyWithdrawAction,
} from '@/src/hooks/useProposal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: ProposalActions,
  tags: ['autodocs'],
  argTypes: {
    actions: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ProposalActions>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required for BigInts to be serialized correctly
// Taken from: https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const dummyUnknownAction = {
  method: 'unknown()',
  interface: 'IUnknown',
  params: {},
};

export const Primary: Story = {
  args: {
    actions: [
      dummyMintAction,
      dummyWithdrawAction,
      dummyMergeAction,
      dummyChangeParamsAction,
      dummyUnknownAction,
    ],
  },
};

export const NoActions: Story = {
  args: {
    actions: [],
  },
};

export const Loading: Story = {
  args: {
    actions: [
      dummyMintAction,
      dummyWithdrawAction,
      dummyMergeAction,
      dummyChangeParamsAction,
      dummyUnknownAction,
    ],
    loading: true,
  },
};
