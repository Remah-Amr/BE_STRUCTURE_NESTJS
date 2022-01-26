import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { QuestionType } from './models/_question.model';

@ValidatorConstraint({ name: 'modelAnswerType', async: false })
export class ModelAnswerType implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if ((args.object as any).type === QuestionType.CHOOSE) {
      return typeof value === 'number';
    }
    return typeof value === 'boolean';
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation faile
    return 'type of model answer not suitable';
  }
}
