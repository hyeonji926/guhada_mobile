import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import ModalWrapper from './ModalWrapper';
import Alert from './Alert';
import Confirm from './Confirm';
import Mask from './Mask';
import { scrollY } from 'lib/dom';

const stories = storiesOf('common/modal', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('Modal', () => {
  return (
    <ModalWrapper
      isOpen={boolean('isOpen', true)}
      onClose={() => {}}
      contentStyle={{}}
      contentLabel={'storymodal'}
      zIndex={1000}
    >
      <div
        style={{
          padding: '20px',
          width: '400px',
          height: '200px',
          background: '#fff',
        }}
      >
        {text('Label', 'modal')}
      </div>
    </ModalWrapper>
  );
});

stories.add('Modal (big size), scrollable', () => {
  return (
    <div style={{ width: '100%', height: '2000px' }}>
      <ModalWrapper
        isOpen={boolean('isOpen', true)}
        onClose={() => {}}
        contentLabel={'storymodal'}
        zIndex={1000}
        lockScroll={boolean('lockScroll', false)}
        isBigModal={boolean('isBigModal', true)}
        contentStyle={{
          top: `${scrollY() + 100}px`, // 현재 스크롤 위치 + 임의 간격
          width: '600px',
          height: '800px',
          background: 'gold',
        }}
      >
        <div style={{}}>{text('Label', 'modal')}</div>
      </ModalWrapper>
    </div>
  );
});

stories.add('Alert', () => {
  return (
    <Alert
      isOpen={boolean('isOpen', true)}
      content={'[HMR] Checking for updates on the server...'}
      onConfirm={action('onConfirm')}
    />
  );
});

stories.add('Confirm', () => {
  return <Confirm isOpen={boolean('isOpen', true)} content={'확인 창입니다'} />;
});

stories.add('Mask', () => {
  return (
    <div>
      <Mask isVisible={boolean('isVisible', false)} />
      <div>
        <button onClick={() => alert('test')}>click</button>
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa nemo odit
        qui consectetur ipsam atque assumenda, autem id a, repellat ipsum aut
        nesciunt reiciendis tempore, cumque quo doloremque quam veritatis
        accusantium? Provident eaque neque deleniti? Velit quibusdam eligendi
        iste eum dolore asperiores nobis repellat perspiciatis perferendis
        deleniti ab eveniet repellendus, atque commodi impedit voluptatum
        nesciunt nam odit natus! Laborum ea exercitationem enim doloremque hic?
        Dolores deserunt cum nesciunt modi soluta suscipit, atque delectus
        aperiam qui in! Quibusdam fuga error officia aspernatur, sunt explicabo
        cum quaerat sed nisi, corporis accusamus illo eligendi! Fugiat error
        quisquam eaque recusandae, esse impedit, pariatur sequi dolorum minima
        vitae a consectetur dolor ducimus laudantium explicabo, quia laboriosam
        atque maiores voluptas labore fuga accusantium quo. Modi rerum sunt
        nostrum accusantium dolorem unde eos distinctio quos odio ex quas sit
        ullam, blanditiis facilis suscipit. Harum, quidem, dolorum totam
        molestias eveniet veritatis quasi doloribus sapiente temporibus
        explicabo assumenda ea sint dolore vitae nihil corrupti in. Ad maxime
        dolores iusto impedit expedita perspiciatis natus commodi ipsam beatae
        voluptates, numquam culpa inventore, eum quo tenetur aliquid mollitia
        incidunt vero molestiae dicta, nesciunt debitis! Exercitationem adipisci
        eum similique, repudiandae perferendis eaque laboriosam ad. Laboriosam
        architecto rem unde temporibus sunt consequatur nisi ipsa.
      </div>
    </div>
  );
});
