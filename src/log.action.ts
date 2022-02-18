import { ActionResponse, After, Before, flat } from 'adminjs';
import { merge } from 'lodash';
import { difference } from './utils/difference';

export const rememberInitialRecord: Before = async (request, context) => {
  const id = context.record?.id();

  context.initialRecord = id ? await context.resource.findOne(id) : {};
  return request;
};

export type CreateLogActionParams = {
  onlyForPostMethod?: boolean;
};

const getRecordTitle = modifiedRecord => {
  switch (typeof modifiedRecord.title) {
    case 'string':
      return modifiedRecord.title;
    case 'function':
      return modifiedRecord.title();
  }
  return (
    Object.values(modifiedRecord).find(v => typeof v === 'string') ?? 'No title'
  );
};

export const createLogAction =
  ({
    onlyForPostMethod = false,
  }: CreateLogActionParams = {}): After<ActionResponse> =>
  async (response, request, context) => {
    const { currentAdmin, _admin } = context;
    const { params, method } = request;
    const Log = _admin.findResource('Log');
    const ModifiedResource = _admin.findResource(params.resourceId);

    if (!params.recordId || (onlyForPostMethod && !(method === 'post'))) {
      return response;
    }

    const currentUser = currentAdmin?.id ?? currentAdmin?._id ?? currentAdmin;

    try {
      const modifiedRecord = merge(
        JSON.parse(JSON.stringify(context.record)),
        await ModifiedResource.findOne(params.recordId)
      );
      if (!modifiedRecord) {
        return response;
      }

      const newParamsToCompare =
        params.action === 'delete'
          ? {}
          : flat.flatten<any, any>(
              JSON.parse(JSON.stringify(modifiedRecord.params))
            );
      await Log.create({
        recordTitle: getRecordTitle(modifiedRecord),
        resource: params.resourceId,
        action: params.action,
        recordId:
          params.recordId ?? typeof modifiedRecord.id === 'string'
            ? modifiedRecord.id
            : modifiedRecord.id?.(),
        user: currentUser,
        difference: JSON.stringify(
          difference(
            newParamsToCompare,
            flat.flatten(
              JSON.parse(JSON.stringify(context.initialRecord.params))
            )
          )
        ),
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  };
