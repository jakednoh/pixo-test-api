export enum Errors {
  BadRequestError = 'BadRequestError',
  InternalServerError = 'InternalServerError',
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = Errors.BadRequestError;
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = Errors.InternalServerError;
  }
}
