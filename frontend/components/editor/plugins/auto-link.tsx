/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * Source: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/AutoLinkPlugin/index.tsx
 */

import { AutoLinkPlugin, createLinkMatcherWithRegExp } from '@lexical/react/LexicalAutoLinkPlugin';
import * as React from 'react';

const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, text => {
    if (text.startsWith('http:')) return text;

    return text.startsWith('http') ? text : `https://${text}`;
  }),
  createLinkMatcherWithRegExp(EMAIL_REGEX, text => {
    return `mailto:${text}`;
  })
];

export const AutoLinkPluginEditor = () => {
  return <AutoLinkPlugin matchers={MATCHERS} />;
};
