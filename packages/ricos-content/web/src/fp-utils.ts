import { identity, flow, pipe } from 'fp-ts/function';
import { Eq } from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { concatAll, Monoid } from 'fp-ts/Monoid';
import * as A from 'fp-ts/Array';

// TODO: replace this monad with fp-ts
/* eslint-disable @typescript-eslint/no-explicit-any */

type Fun = (data?: unknown) => any;

// promise-like interface handling success an failure result of execution
type Fork = (reject: Fun, resolve: Fun) => any;

// Task interface
type Task = {
  fork: Fork; // success/failure resolution
  map: (fun: Fun) => Task; // maps Fun to Task (resolve combined with fun)
  chain: (taskable: (data?: unknown) => Task) => Task; // chains Task with another Task and flattens Task(Task) => Task
};

type TaskMonad = ((f: Fork) => Task) & { of: (data: unknown) => Task };

export const task: TaskMonad = fork => ({
  fork,
  map(f) {
    return task((rej, res) => this.fork(rej, flow(f, res)));
  },
  chain(t) {
    return task((rej, res) => this.fork(rej, x => t(x).fork(rej, res)));
  },
});

task.of = (data: unknown) => task((rej, res) => res(data)); // lift any data into a Task

// iterate task list, return first successfully resolved result
export const firstResolved = (tasks: Task[], i = 0) =>
  tasks[i].fork(() => firstResolved(tasks, i + 1), identity);

// if/else implemented with task
export const either = (predicate: (data: unknown) => boolean) => data =>
  task((rej, res) => (predicate(data) ? res(data) : rej(data)));

export const split = (splitter: string) => (str: string) => str.split(splitter);

export const replace = (replaced: RegExp | string, by: string) => (str: string): string =>
  str.replace(replaced, by);

export const equals = <T>(E: Eq<T>) => (lhs: T) => (rhs: T) => E.equals(lhs, rhs);

export const concatApply = <T, D>(m: Monoid<T>) => (fns: ((data: D) => T)[]) => (data: D) =>
  pipe(fns, A.ap(A.of(data)), concatAll(m));

export const not = <T>(predicate: (data: T) => boolean) => (data: T) => !predicate(data);

export const toUpperCase = (str: string) => str.toUpperCase();

export const log = <T>(tag: string, processor: (data: T) => string | T = identity) => (data: T) => {
  console.log(tag, processor(data)); // eslint-disable-line no-console
  return data;
};

export const getMatches = (regex: RegExp) => (str: string): O.Option<RegExpExecArray> =>
  pipe(regex.exec(str), O.fromNullable);
