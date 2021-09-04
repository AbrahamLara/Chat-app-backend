import { MOCK_HASH } from '../mock-utils';
import { mockLocalFile } from './mock-local-file';

const MISC_UTILS_FACTORY = {
  hashValue: async () => MOCK_HASH,
};

type MiscUtilsFactory = typeof MISC_UTILS_FACTORY;

/**
 * Mocks functions that exist in misc-utils.ts.
 */
export function mockMiscUtils(factory: Partial<MiscUtilsFactory> = {}): void {
  mockLocalFile<MiscUtilsFactory>(
    '../../utils/misc-utils',
    MISC_UTILS_FACTORY,
    factory
  );
}
