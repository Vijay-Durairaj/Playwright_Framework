import { Container } from "inversify";
import { TYPES } from "./types";

import { ILocatorHealer } from "@interfaces/ai/ILocatorHealer";
import { LocatorHealer } from "@services/LocatorHealer";

const container = new Container();

container.bind<ILocatorHealer>(TYPES.LocatorHealer)
  .to(LocatorHealer);

export { container };