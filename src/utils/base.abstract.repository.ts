import { NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import {
  CreateQuery,
  FilterQuery,
  UpdateQuery,
  Model,
  Document,
  PaginateOptions,
  PaginateModel,
  PaginateResult,
  QueryOptions,
} from 'mongoose';

type TDocument<T> = T & Document;
export abstract class BaseAbstractRepository<T> {
  private model: Model<TDocument<T>>;

  protected constructor(model: Model<TDocument<T>>) {
    this.model = model;
  }

  public async create(data: CreateQuery<TDocument<T>>): Promise<TDocument<T>> {
    const newDocument = new this.model(data).save();
    return newDocument;
  }

  public async createDoc(data: T): Promise<TDocument<T>> {
    const newDocument = new this.model(data).save();
    return newDocument;
  }

  public async findOne(
    filterQuery: FilterQuery<TDocument<T>>,
    options: QueryOptions = {},
    projection: any = {},
  ): Promise<TDocument<T>> {
    const doc = await this.model
      .findOne(filterQuery, projection)
      .setOptions(options);
    return doc;
  }

  public async findAllWithPaginationOption(
    queryFiltersAndOptions: any,
    arrayOfFilters: string[],
    extraOptions: PaginateOptions = {},
  ): Promise<PaginateResult<TDocument<T>> | TDocument<T>[]> {
    const filters: FilterQuery<TDocument<T>> = _.pick(
      queryFiltersAndOptions,
      arrayOfFilters,
    );
    const options: PaginateOptions = _.pick(queryFiltersAndOptions, [
      'page',
      'limit',
    ]);
    let docs;
    if (queryFiltersAndOptions.allowPagination) {
      docs = await (this.model as PaginateModel<TDocument<T>>).paginate(
        filters,
        { ...options, ...extraOptions },
      );
    } else {
      docs = await this.model.find(filters).setOptions(options);
    }
    return docs;
  }

  public async deleteOne(
    filterQuery: FilterQuery<TDocument<T>>,
  ): Promise<void> {
    await this.model.deleteOne(filterQuery);
  }

  public async updateOne(
    filterQuery: FilterQuery<TDocument<T>>,
    updateQuery: UpdateQuery<TDocument<T>>,
    options: QueryOptions = {},
  ): Promise<TDocument<T>> {
    const doc = await this.model.findOne(filterQuery).setOptions(options);
    if (!doc) throw new NotFoundException(`${this.model.modelName} not found`);
    await doc.set(updateQuery).save();
    return doc;
  }

  public async updateOneVoid(
    filterQuery: FilterQuery<TDocument<T>>,
    updateQuery: UpdateQuery<TDocument<T>>,
    options: QueryOptions = {},
  ): Promise<void> {
    await this.model.updateOne(filterQuery, updateQuery);
  }
}
