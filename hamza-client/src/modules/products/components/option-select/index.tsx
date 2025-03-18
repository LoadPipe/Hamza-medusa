import { ProductOption } from '@medusajs/medusa';
import { Tooltip } from '@medusajs/ui';
import React, { useMemo } from 'react';
import { Button } from '@chakra-ui/react';
import { onlyUnique } from '@lib/util/only-unique';

const MINIMUM_CHARACTERS_FOR_TOOLTIP = 20;

type OptionSelectProps = {
  option: ProductOption;
  current: string;
  updateOption: (option: Record<string, string>) => void;
  title: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
}) => {
  const sortedValues = [...option.values].sort((a: any, b: any) => {
    return (a.variant_rank) - (b.variant_rank);
  });

  const filteredOptions = sortedValues
    .map((v) => v.originalValue)
    .filter(onlyUnique);

  const selectedDisplayValue = useMemo(() => {
    if (!current) return '';
    const foundItem = sortedValues.find((x) => x.originalValue === current);
    return foundItem ? foundItem.displayValue : current;
  }, [current, sortedValues]);

  return (
    <div className="flex flex-col gap-y-3">
      <span className="mt-2 text-sm !text-white">Selected {title}: {selectedDisplayValue}</span>
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {filteredOptions.map((origVal) => {
          const item = sortedValues.find(x => x.originalValue === origVal);
          if (!item) return null;
          const buttonContent = (
            <Button
              key={origVal}
              onClick={() => updateOption({ [option.id]: origVal })}
              size="md"
              height="auto"
              py="3"
              px="6"
              bg="black"
              color="white"
              fontSize="16px"
              maxH="14"
              width="auto"
              maxW="200px"
              overflow="hidden"
              whiteSpace="normal"
              textOverflow="ellipsis"
              borderColor={origVal === current ? 'blue.500' : 'gray.200'}
              borderWidth={origVal === current ? '4px' : '1px'}
              _hover={{
                boxShadow: 'md',
              }}
              borderRadius="50px"
            >
              <div
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxHeight: '3.6em',
                }}
              >
                {item.displayValue}
              </div>
            </Button>
          );

          return item.displayValue.length > MINIMUM_CHARACTERS_FOR_TOOLTIP ? (
            <Tooltip content={item.displayValue} className="min-w-fit" key={origVal}>
              {buttonContent}
            </Tooltip>
          ) : (
            buttonContent
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelect;
