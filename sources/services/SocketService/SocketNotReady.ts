import SocketImplementation from "./SocketImplementation";

class SocketNotReady implements SocketImplementation {
  public readonly sendMessage = async (): Promise<void> => {
    throw new Error("Socket not ready");
  };
}

export default SocketNotReady;
