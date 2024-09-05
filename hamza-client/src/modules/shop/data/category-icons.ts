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

const categoryIcons: Record<string, any> = {
    medusa_merch: clothes,
    games: games,
    legendary_light_design: lights,
    echo_rift: games,
    gadgets: gadgets,
    home_light: lights,
    workout_gear: workout,
    board_games: boardgames,
    legos: lego,
    gaming_gear: games,
    dauntless: echo,
    drones: drones,
    echo: echo,
    all: all,
};

export default categoryIcons;
