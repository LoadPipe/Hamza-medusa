// src/path-to-your-icons/categoryIcons.ts
import clothes from '../../../../../../../../public/images/categories/category-clothes.svg';
import games from '../../../../../../../../public/images/categories/category-games.svg';
import gadgets from '../../../../../../../../public/images/categories/category-gadgets.svg';
import lights from '../../../../../../../../public/images/categories/lights.svg';
import workoutGear from '../../../../../../../../public/images/categories/weightlift.svg';
import boardGames from '../../../../../../../../public/images/categories/board-games.svg';

const categoryIcons: Record<string, any> = {
    clothes: clothes,
    games: games,
    gadgets: gadgets,
    home_light: lights,
    workout_gear: workoutGear,
    board_games: boardGames,
};

export default categoryIcons;
