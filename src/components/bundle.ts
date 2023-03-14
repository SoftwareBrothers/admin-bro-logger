import AdminJS from 'adminjs';

export const bundleComponents = (): {
  RECORD_DIFFERENCE: string;
  RECORD_LINK: string;
} => {
  return {
    RECORD_DIFFERENCE: AdminJS.bundle('../../src/components/RecordDifference'),
    RECORD_LINK: AdminJS.bundle('../../src/components/RecordLink'),
  };
};
