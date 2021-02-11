export enum Errors {
  BadRequestError = 'BadRequestError',
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = Errors.BadRequestError;
  }
}
