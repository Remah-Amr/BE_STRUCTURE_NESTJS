import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from './paginated.dto';

export const ApiOkResponseGeneral = <TModel extends Type<any>>(
  model: TModel,
  extraModel: Type<any> = null,
  isPaginated: boolean = true,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `ResponseOf${model.name}`,
        ...(isPaginated && {
          allOf: [
            { $ref: getSchemaPath(PaginatedDto) },
            {
              properties: {
                docs: {
                  type: 'array',
                  items: {
                    allOf: [
                      { $ref: getSchemaPath(model) },
                      {
                        ...(extraModel && { $ref: getSchemaPath(extraModel) }),
                      },
                    ],
                  },
                },
              },
            },
          ],
        }),
        ...(isPaginated === false && {
          type: 'array',
          items: {
            allOf: [
              { $ref: getSchemaPath(model) },
              {
                ...(extraModel && { $ref: getSchemaPath(extraModel) }),
              },
            ],
          },
        }),
      },
    }),
  );
};
