/**
 * For mocking local .ts files to help avoid unnecessary computations for certain function calls like generating
 * tokens for each unit test and manipulate behavior in order to cover different scenarios.
 *
 * @param filePath The path to the local file relative to this function.
 * @param factory A default factory to use as a mock.
 * @param customFactory For overriding the default fa
 */
export function mockLocalFile<T>(
  filePath: string,
  factory: T,
  customFactory: Partial<T>
): void {
  const isEmpty = Object.keys(customFactory).length === 0;
  let moduleFactory = factory;

  if (!isEmpty) {
    moduleFactory = { ...factory, ...customFactory };
  }

  jest.mock(filePath, () => moduleFactory);
}
