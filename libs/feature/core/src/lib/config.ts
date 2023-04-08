import { MovementDirection, Player } from './types';

export const startingPlayer = Player.White as Player;

export const movementsDirectionByPlayer = {
  [Player.White]: startingPlayer === Player.White ? MovementDirection.Up : MovementDirection.Down,
  [Player.Black]: startingPlayer === Player.Black ? MovementDirection.Down : MovementDirection.Up,
}
