export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function isOppositeDirection(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

export function placeFood(snake, cols, rows, rand = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const freeCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  const index = Math.floor(rand() * freeCells.length);
  return freeCells[index];
}

export function createInitialState({ cols = 20, rows = 20, rand = Math.random } = {}) {
  const head = {
    x: Math.floor(cols / 2),
    y: Math.floor(rows / 2),
  };

  const snake = [head];

  return {
    cols,
    rows,
    snake,
    direction: DIRECTIONS.right,
    nextDirection: DIRECTIONS.right,
    food: placeFood(snake, cols, rows, rand),
    score: 0,
    gameOver: false,
    paused: false,
  };
}

export function setDirection(state, direction) {
  if (!direction || state.gameOver) {
    return state;
  }

  const current = state.direction;
  if (state.snake.length > 1 && isOppositeDirection(current, direction)) {
    return state;
  }

  return {
    ...state,
    nextDirection: direction,
  };
}

function isOutsideGrid(head, cols, rows) {
  return head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
}

function collidesWithBody(head, snake, grows) {
  const bodyToCheck = grows ? snake : snake.slice(0, -1);
  return bodyToCheck.some((segment) => segment.x === head.x && segment.y === head.y);
}

export function tick(state, rand = Math.random) {
  if (state.gameOver || state.paused) {
    return state;
  }

  const direction = state.nextDirection;
  const head = state.snake[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  if (isOutsideGrid(nextHead, state.cols, state.rows)) {
    return {
      ...state,
      direction,
      gameOver: true,
    };
  }

  const grows = Boolean(
    state.food && nextHead.x === state.food.x && nextHead.y === state.food.y
  );

  if (collidesWithBody(nextHead, state.snake, grows)) {
    return {
      ...state,
      direction,
      gameOver: true,
    };
  }

  const snake = [nextHead, ...state.snake];
  if (!grows) {
    snake.pop();
  }

  const nextFood = grows ? placeFood(snake, state.cols, state.rows, rand) : state.food;

  return {
    ...state,
    direction,
    snake,
    food: nextFood,
    score: grows ? state.score + 1 : state.score,
    gameOver: grows && nextFood === null ? true : state.gameOver,
  };
}

export function togglePause(state) {
  if (state.gameOver) {
    return state;
  }

  return {
    ...state,
    paused: !state.paused,
  };
}

export function restart(state, rand = Math.random) {
  return createInitialState({
    cols: state.cols,
    rows: state.rows,
    rand,
  });
}
