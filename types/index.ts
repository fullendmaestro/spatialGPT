import { UIMessage } from "ai";

export type ExtUIMessage = UIMessage & {
  coordinateAttachments?: Array<{ latitude: number; longitude: number }>;
};
