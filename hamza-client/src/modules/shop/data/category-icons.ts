// src/path-to-your-icons/categoryIcons.ts
import clothes from '../../../../public/images/categories/category-clothes.svg';
import games from '../../../../public/images/categories/category-games.svg';
import gadgets from '../../../../public/images/categories/category-gadgets.svg';
import lights from '../../../../public/images/categories/lights.svg';
import workout from '../../../../public/images/categories/weightlift.svg';
import boardgames from '../../../../public/images/categories/board-games.svg';
import lego from '../../../../public/images/categories/lego.svg';
import drones from '../../../../public/images/categories/drones.svg';
import echo from '../../../../public/images/categories/echo.svg';
import all from '../../../../public/images/categories/all.svg';
import fire from '../../../../public/images/categories/fire.svg';

const categoryIcons: Record<string, any> = {
    merch: clothes,
    pants: clothes,
    shirts: clothes,
    gaming: games,
    legendary_light_design: lights,
    echo_rift: games,
    gadgets: gadgets,
    'home lighting': lights,
    workout: workout,
    'board games': boardgames,
    lego: lego,
    gaming_gear: games,
    dauntless: echo,
    drones: drones,
    headphones: echo,
    'vr headphones': echo,
    'hidden homepage featured': fire,
    all: all,
};

export default categoryIcons;
