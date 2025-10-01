export const ERROR_MESSAGES: Record<string, string> = {
  room_not_found: "That room ID doesn't exist. Double‑check and try again.",
  room_full: "This room already has two players.",
  player_not_in_room: "You're not part of this room.",
  waiting_for_second_player:
    "Waiting for your opponent to join before you can play.",
  not_your_turn: "It's not your turn yet.",
  game_ended: "The game has already ended.",
  no_opponent: "You need an opponent to perform this action.",
  no_tiles_placed: "Place at least one tile on the board.",
  duplicate_tile_positions: "Two tiles are placed on the same square.",
  tile_out_of_bounds: "You placed a tile outside the board.",
  cell_already_occupied: "You placed a tile on an occupied square.",
  tiles_must_be_adjacent: "Tiles must touch to form a continuous placement.",
  first_move_must_touch_center_star:
    "Your first word must cover the center star.",
  tiles_must_connect_to_existing:
    "Your tiles must connect to existing tiles on the board.",
  must_form_at_least_one_word: "Your placement didn't form a valid word.",
  invalid_words_formed: "One or more formed words aren't valid.",
  cannot_swap_when_bag_below_7:
    "You can swap only when at least 7 tiles remain in the bag.",
  no_letters_to_swap: "Select at least one tile to swap.",
  unknown_message_type: "Something went wrong. Please try again.",
};
