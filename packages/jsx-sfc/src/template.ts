import { ReactNode } from 'react';
import { noop, Obj, Func } from './utils';

const __TEMPLATE__ = 0x5fc;

const templateFc = noop;
templateFc.__type = __TEMPLATE__;

export function isTemplate(templateFc: any): templateFc is Template.FC {
  return templateFc.__type === __TEMPLATE__;
}

export const Template: <
  Arg1 = any,
  Arg2 = any,
  Arg3 = any,
  Arg4 = any,
  Arg5 = any,
  T extends Template.Func<Arg1, Arg2, Arg3, Arg4, Arg5> = Template.Func
>(props: {
  name?: T;
  children: T['template'];
}) => JSX.Element = templateFc as Func;

export namespace Template {
  export interface Func<Arg1 = unknown, Arg2 = unknown, Arg3 = unknown, Arg4 = unknown, Arg5 = unknown> {
    template: (arg1?: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4, arg5?: Arg5, ...args: unknown[]) => ReactNode;
  }

  export type FC = typeof templateFc;

  export type Data = Obj;
}
