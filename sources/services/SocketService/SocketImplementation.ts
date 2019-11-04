interface SocketImplementation {
  // Function used to send whatever message
  // TODO: Edit later
  readonly sendMessage: (message: string) => Promise<void>;
}

export default SocketImplementation;
