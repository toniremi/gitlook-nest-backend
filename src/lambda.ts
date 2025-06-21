import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { AppModule } from './app.module';
import { Express } from 'express';

// Declare a ReplaySubject to store the serverlessExpress instance.
const serverSubject = new ReplaySubject<Handler>();

async function bootstrap(): Promise<Handler> {
  console.log('COLD START: Initializing Nest');

  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as Express;

  // ESLint Disable Comment: This line is functionally correct,
  // but the linter's interpretation of the types is causing a false positive.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return serverlessExpress({ app: expressApp });
}

// Do not wait for lambdaHandler to be called before bootstrapping Nest.
// Pass the result of bootstrap() into the ReplaySubject.
void bootstrap().then((server) => serverSubject.next(server));

type EventPayload = {
  [key: string]: any;
};

export const handler: Handler = async (
  event: EventPayload,
  context: Context,
  callback: Callback,
): Promise<Handler> => {
  // Handle edge cases for the root path
  if (event.path === '' || event.path === undefined) event.path = '/';

  // Convert the ReplaySubject to a Promise.
  // Wait for bootstrap to finish, then start handling requests.
  const server = await firstValueFrom(serverSubject);
  return server(event, context, callback);
};
