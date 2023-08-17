/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Module dependencies.
 */

import logger from '../winston';
import * as http from 'http';
import {AddressInfo} from 'net';
import app from '../server';

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: any) => {
  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(
  process.env.PORT === undefined ? '3000' : process.env.PORT,
);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${(<number>port).toString()}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = <AddressInfo>server.address();
  const bind =
    typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port.toString()}`;
  console.log(`Listening on ${bind}`);
  logger.info(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
