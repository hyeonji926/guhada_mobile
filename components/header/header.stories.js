import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import withMobile from '.storybook/decorators/withMobile';
import Header from './Header';
import HeaderMenu from './HeaderMenu';

const stories = storiesOf('header', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
// stories.addDecorator(withMobile);

stories.add('Header', () => {
  return <Header />;
});

stories.add('HeaderMenu', () => {
  return <HeaderMenu isVisible={boolean('isVisible', false)} />;
});
