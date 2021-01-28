import React, { forwardRef as forwardRefReact, Fragment, ReactElement } from 'react';
import { SFC, ForwardRefSFC, SFCOptions, SFCExtensions } from './defineComponent';
import { Template, isTemplate } from './template';
import { isFunc, noop, getFuncParams, emptyObjs, withOrigin, Func, Obj, FuncMap } from './utils';

const COMPILED_SIGN = '__cs';

export function createFuncResults(options: FuncMap, extensions?: Func | Obj, isRuntime?: boolean) {
  const ret: Obj = {};
  let template: Func = noop;

  Object.keys(options).forEach(key => {
    const item = options[key];
    if (key === 'template') {
      template = item as Func;
    } else if (key === 'styles') {
      ret[key] = isFunc(item) ? item() : item;
    }
  });

  const ex = isFunc(extensions) ? extensions() : extensions;
  ex && Object.assign(ret, ex);

  if (template) {
    const paramsCount = getFuncParams(template).length;
    ret.template =
      paramsCount > 1
        ? (data?: Template.Data) => {
            const jsxFragment: ReactElement = template({ data, ...ret }, ...emptyObjs(paramsCount - 1));
            if (jsxFragment?.type !== Fragment) {
              throw new TypeError('The return of template with multiple arguments must be React.Fragment type.');
            }

            const tmplFcs: ReactElement<{ name?: Template.Func; children: Template.Func['render'] }>[] =
              jsxFragment.props.children;
            if (!Array.isArray(tmplFcs)) {
              throw new RangeError('Must be at least 2 Template elements.');
            }

            let mainTemplate: Template.Func['render'] = noop;
            tmplFcs.forEach(item => {
              if (isTemplate(item.type)) {
                const { name, children } = item.props;
                if (name) {
                  name.render = children;
                } else {
                  mainTemplate = children;
                }
              }
            });

            return mainTemplate();
          }
        : (data?: Template.Data) => template({ data, ...ret });
  }

  if (!isRuntime) {
    ret[COMPILED_SIGN] = true;
  }

  return ret;
}

function assignToComponent(component: Func, extensions: Obj) {
  const { template } = extensions;

  return Object.assign(withOrigin(component), extensions, template ? { Template: template } : {});
}

function createSfc(isForwardRef?: boolean) {
  function defineSfc(options: SFCOptions, extensions?: SFCExtensions) {
    if (extensions?.[COMPILED_SIGN]) {
      delete extensions[COMPILED_SIGN];
      const Component = (options as any) as Func;
      const component = !isForwardRef ? Component : forwardRefReact(Component);

      return assignToComponent(component, extensions);
    } else {
      if (isFunc(options)) {
        options = { Component: options };
      }
      const { template, styles, Component } = options;
      const funcResults = createFuncResults({ template, styles }, extensions, true);

      let SeparateFunction: Func;
      if (!isForwardRef) {
        const InnerComponent: React.FC = Component;
        SeparateFunction = innerProps => {
          return <InnerComponent {...innerProps} {...funcResults} />;
        };
      } else {
        const InnerComponentWithRef = forwardRefReact(Component);
        SeparateFunction = forwardRefReact((innerProps, ref) => {
          return <InnerComponentWithRef {...innerProps} {...funcResults} ref={ref} />;
        });
      }

      return assignToComponent(SeparateFunction, funcResults);
    }
  }

  return (options?: any, extensions?: any) => {
    if (options) {
      return defineSfc(options, extensions);
    } else {
      return defineSfc;
    }
  };
}

export const sfc: SFC = createSfc() as any;
export const forwardRef: ForwardRefSFC = createSfc(true);

sfc.forwardRef = forwardRef;
sfc.createFuncResults = createFuncResults;
