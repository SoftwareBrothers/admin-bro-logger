import { buildFeature, FeatureType } from 'adminjs';

import { createLogAction, rememberInitialRecord } from './log.action';
import { LoggerFeatureOptions } from './types';

const loggerFeature = (options: LoggerFeatureOptions): FeatureType => {
  return buildFeature({
    actions: {
      new: {
        before: rememberInitialRecord,
        after: createLogAction({ onlyForPostMethod: true, options }),
      },
      edit: {
        before: rememberInitialRecord,
        after: createLogAction({ onlyForPostMethod: true, options }),
      },
      delete: {
        before: rememberInitialRecord,
        after: createLogAction({ options }),
      },
      bulkDelete: {
        before: rememberInitialRecord,
        after: createLogAction({ onlyForPostMethod: true, options }),
      },
    },
  });
};

export default loggerFeature;
