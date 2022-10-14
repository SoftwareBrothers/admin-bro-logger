import { ResourceWithOptions } from 'adminjs';

import { bundleComponents } from './components/bundle';
import { getLogPropertyName } from './utils/get-log-property-name';
import { LoggerFeatureOptions } from './types';
import { ADMINJS_LOGGER_DEFAULT_RESOURCE_ID } from './constants';

const { RECORD_DIFFERENCE, RECORD_LINK } = bundleComponents();

export const createLoggerResource = <T = unknown>({
  resource,
  featureOptions,
}: {
  resource: T;
  featureOptions?: LoggerFeatureOptions;
}): ResourceWithOptions => {
  const { resourceOptions = {}, propertiesMapping = {} } = featureOptions ?? {};
  const { resourceId, navigation, actions = {} } = resourceOptions;

  return {
    resource,
    options: {
      id: resourceId ?? ADMINJS_LOGGER_DEFAULT_RESOURCE_ID,
      navigation: navigation ?? null,
      sort: {
        direction: 'desc',
        sortBy: getLogPropertyName('createdAt', propertiesMapping),
      },
      listProperties: [
        getLogPropertyName('user', propertiesMapping),
        getLogPropertyName('recordId', propertiesMapping),
        getLogPropertyName('resource', propertiesMapping),
        getLogPropertyName('action', propertiesMapping),
        getLogPropertyName('createdAt', propertiesMapping),
      ],
      actions: {
        edit: { isAccessible: false },
        new: { isAccessible: false },
        delete: { isAccessible: false },
        bulkDelete: { isAccessible: false },
        show: {
          showInDrawer: true,
          containerWidth: '700px',
          ...(actions.show ?? {}),
        },
        list: {
          ...(actions.list ?? {}),
        },
      },
      properties: {
        [getLogPropertyName('id', propertiesMapping)]: {
          isVisible: {
            list: false,
          },
        },
        [getLogPropertyName('difference', propertiesMapping)]: {
          components: {
            show: RECORD_DIFFERENCE,
          },
          custom: {
            propertiesMapping,
          },
          position: 110,
        },
        [getLogPropertyName('recordId', propertiesMapping)]: {
          components: {
            list: RECORD_LINK,
            show: RECORD_LINK,
          },
          custom: {
            propertiesMapping,
          },
        },
        [getLogPropertyName('updatedAt', propertiesMapping)]: {
          isVisible: false,
        },
      },
    },
  };
};
