# HTTP Server

This is a simple HTTP server that has no dependencies, and runs in a node.js environment.  
It is maintained by [People and Code](https://people-and-code.com/).

The HTTP Server is used to test HTTP requests and responses in the [HTTP Messages](https://workshops.people-and-code.com/workshops/workshop-two-http-messages) workshop in conjunction with an [HTTP Client](https://github.com/p-n-c/http-client-demo).

## How to run the server

To start the server, run this command in the terminal:

`node src/server.js`

If you want the server to restart on save, run this command in the terminal:

`npm run server`

### Stopping and restarting the server

When you want to shut down the service, run:

`Ctrl + c`

From time to time, you will find it necessary to terminate the server and end the current process.  
When this happens the following error appears in the terminal:

`EADDRINUSE: address already in use`

In order to fix this, find the current process by running:

`sudo lsof -i :3000`

Copy the PID of the relevant (node) service and enter:

`kill -9 <PID>`
