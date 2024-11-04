import { ProductOption } from '@medusajs/medusa';
import { Tooltip } from '@medusajs/ui';
import React from 'react';
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
  const filteredOptions = option.values
    .map((v) => v.value)
    .filter(onlyUnique);

  return (
    <div className="flex flex-col gap-y-3">
      <span className="mt-2 text-sm !text-white">Selected {title}: {current && current.length > 0 ? ` ${current}` : ''}</span>
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {filteredOptions.map((v) => {
          const buttonContent = (
            <Button
              key={v}
              onClick={() => updateOption({ [option.id]: v })}
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
              borderColor={v === current ? 'blue.500' : 'gray.200'}
              borderWidth={v === current ? '4px' : '1px'}
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
                {v}
              </div>
            </Button>
          );

          return v.length > MINIMUM_CHARACTERS_FOR_TOOLTIP ? (
            <Tooltip content={v} className="min-w-fit" key={v}>
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
