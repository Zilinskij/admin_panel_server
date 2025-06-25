import { Socket } from "socket.io";

export const useCompanySockets = (socket: Socket, io: any) => {
  socket.on("update:company", (data) => {
    console.log(data, "socket update company");
    io.emit("update_result:company", data);
  });
};
