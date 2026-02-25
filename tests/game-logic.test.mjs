import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DIRECTIONS,
  createInitialState,
  placeFood,
  setDirection,
  tick,
} from '../src/game-logic.mjs';

function createState(overrides = {}) {
  return {
    cols: 6,
    rows: 6,
    snake: [{ x: 2, y: 2 }],
    direction: DIRECTIONS.right,
    nextDirection: DIRECTIONS.right,
    food: { x: 5, y: 5 },
    score: 0,
    gameOver: false,
    paused: false,
    ...overrides,
  };
}

test('tick moves snake head in current nextDirection', () => {
  const state = createState();

  const next = tick(state, () => 0);

  assert.deepEqual(next.snake, [{ x: 3, y: 2 }]);
  assert.equal(next.gameOver, false);
});

test('setDirection rejects direct reversal when snake length > 1', () => {
  const state = createState({
    snake: [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
    ],
    direction: DIRECTIONS.right,
    nextDirection: DIRECTIONS.right,
  });

  const next = setDirection(state, DIRECTIONS.left);

  assert.equal(next.nextDirection, DIRECTIONS.right);
});

test('tick sets gameOver on wall collision', () => {
  const state = createState({
    snake: [{ x: 5, y: 2 }],
    direction: DIRECTIONS.right,
    nextDirection: DIRECTIONS.right,
  });

  const next = tick(state, () => 0);

  assert.equal(next.gameOver, true);
});

test('tick grows snake and increments score after eating food', () => {
  const state = createState({
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    food: { x: 3, y: 2 },
  });

  const next = tick(state, () => 0);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, 3);
  assert.deepEqual(next.snake[0], { x: 3, y: 2 });
});

test('placeFood never returns an occupied cell', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  const food = placeFood(snake, 3, 2, () => 0);

  assert.deepEqual(food, { x: 0, y: 1 });
});

test('createInitialState uses random function deterministically', () => {
  const state = createInitialState({ cols: 4, rows: 4, rand: () => 0 });

  assert.deepEqual(state.snake, [{ x: 2, y: 2 }]);
  assert.deepEqual(state.food, { x: 0, y: 0 });
});
