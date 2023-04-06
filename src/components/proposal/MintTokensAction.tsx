import { ActionMintTokenFormData, MintAddressAmount } from '@/src/lib/Actions';
import { AddressPattern, NumberPattern } from '@/src/lib/Patterns';
import { Input } from '../ui/Input';
import { HiCircleStack, HiPlus, HiXMark } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { Control, FieldErrors, useFieldArray } from 'react-hook-form';
import { StepThreeData } from '@/src/pages/NewProposal';
import { ErrorWrapper } from '../ui/ErrorWrapper';
import { MainCard } from '../ui/MainCard';

export const MintTokensAction = ({
  register,
  control,
  prefix,
  errors,
  onRemove,
}: {
  register: any;
  control: Control<StepThreeData>;
  prefix: `actions.${number}`;
  errors: FieldErrors<ActionMintTokenFormData> | undefined;
  onRemove: () => void;
}) => {
  const { fields, append, remove } = useFieldArray({
    name: `${prefix}.wallets`,
    control: control,
  });

  return (
    <MainCard
      className="flex flex-col gap-4"
      header="Mint tokens"
      icon={HiCircleStack}
      aside={
        <Button
          type="button"
          icon={HiXMark}
          onClick={onRemove}
          variant="ghost"
        />
      }
    >
      <div className="grid grid-cols-3 gap-2">
        <span className="col-span-1 pl-2 pb-2">Address</span>
        <span className="col-span-1 pl-2 pb-2">Tokens</span>
        <span className="col-span-1" />
        {fields.map((field, index) => (
          <AddressTokensMint
            key={field.id}
            prefix={`${prefix}.wallets.${index}`}
            register={register}
            errors={errors?.wallets?.[index] ?? undefined}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
      <Button
        variant="subtle"
        type="button"
        label="Add wallet"
        icon={HiPlus}
        onClick={() => append({ address: '', amount: 0 })}
      />
    </MainCard>
  );
};

const AddressTokensMint = ({
  register,
  onRemove,
  errors,
  prefix,
}: {
  register: any;
  onRemove: () => void;
  errors: FieldErrors<MintAddressAmount> | undefined;
  prefix: `actions.${number}.wallets.${number}`;
}) => (
  <div className="col-span-3 grid grid-cols-3 gap-4">
    <div className="flex flex-col gap-2">
      <ErrorWrapper name="Address" error={errors?.address ?? undefined}>
        <Input
          {...register(`${prefix}.address`)}
          type="text"
          id="address"
          error={errors?.address ?? undefined}
          pattern={AddressPattern}
        />
      </ErrorWrapper>
    </div>
    <div className="flex flex-col gap-2">
      <ErrorWrapper name="Amount" error={errors?.amount ?? undefined}>
        <Input
          {...register(`${prefix}.amount`)}
          type="number"
          id="tokens"
          error={errors?.amount ?? undefined}
          pattern={NumberPattern}
        />
      </ErrorWrapper>
    </div>
    <HiXMark
      className="h-5 w-5 cursor-pointer self-center"
      onClick={onRemove}
    />
  </div>
);
