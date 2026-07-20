import * as http from 'http';

/** Minimal DMZ HTTP surface — banks run this behind VPN / private network. */
declare function startShieldServer(port?: number): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export { startShieldServer };
