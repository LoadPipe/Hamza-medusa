import { ProductOption } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { onlyUnique } from '@lib/util/only-unique';

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
            <span className="mt-2 text-sm !text-white">Select {title}</span>
            <div className="flex flex-wrap gap-2">
                {filteredOptions.map((v) => {
                    return (
                        <Button
                            key={v}
                            onClick={() => updateOption({ [option.id]: v })}
                            size="md" // small button size
                            height="auto"
                            py="3"
                            px="6"
                            mt="6"
                            bg="black"
                            color="white"
                            fontSize="16px" // 16px font size
                            maxH="14" // max-height in Chakra's scale
                            width="auto"
                            maxW="200px" // max-width of 200px
                            overflow="hidden"
                            whiteSpace="normal"
                            textOverflow="ellipsis"
                            borderColor={
                                v === current ? 'blue.500' : 'gray.200'
                            }
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
                                    maxHeight: '3.6em', // Limiting the text to two lines maximum
                                }}
                            >
                                {v}
                            </div>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default OptionSelect;
