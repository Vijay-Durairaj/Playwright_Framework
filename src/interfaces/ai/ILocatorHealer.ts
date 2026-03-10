export interface ILocatorHealer {

  suggestLocator(
    dom: string,
    failedLocator: string
  ): Promise<string>;

}