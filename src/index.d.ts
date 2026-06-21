import { PluginCreator } from "postcss";

interface Options {
  prefix?: string;
  ignore?: (string | RegExp)[];
}

declare const plugin: PluginCreator<Options>;

export default plugin;
