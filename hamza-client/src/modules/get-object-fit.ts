const coverProds = [
    'headset_sleek',
    'lld_tripod',
    'headphones',
    'headset_echo',
    'lld_indout',
    'lld_wall',
    'lld_led',
    'lld_infinity',
    'lld_recessed',
    'headset_vision',
    'headset_future',
    'headset_audio',
    'drone',
    'headset_aural',
    'sweatpants',
    'sweatshirt',
    'coffee-mug',
    'shorts',
    'hoodie',
    'longsleeve',
    't-shirt',
    'hyper-x-mouse'
];

export function getObjectFit(prodHandle: string | undefined) {
    if (coverProds.find(p => p === prodHandle))
        return 'cover';
    return 'contain';
}