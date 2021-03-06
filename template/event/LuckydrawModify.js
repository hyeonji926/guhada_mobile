import React, { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import Form from 'stores/form-store/_.forms';
import css from './LuckydrawModify.module.scss';
import { LoginInput, LoginCheckBox, LoginButton } from 'components/login';
import cn from 'classnames';
import SignupInputButtonChange from 'components/login/SignupInputButtonChange';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
// @inject('luckydraw', 'countdown', 'authmobile')
@inject('countdown', 'authmobile')
@observer
class LuckydrawModify extends Component {
  render() {
    const form = Form.modifyLuckydraw;
    let value;

    if (_.isNil(form)) {
      return null;
    } else {
      value = form.get('value');
    }

    const { isOpen, closeModal } = this.props;

    return (
      <ModalWrapper
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel={'LuckydrawSignup'}
        contentStyle={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          transform: 'none',
        }}
        zIndex={999}
      >
        <div className={css.loginWrap}>
          <div className={css.headerWrap}>
            <div className={css.emptyButton} />
            회원정보수정
            <div className={css.closeButton} onClick={() => closeModal()} />
          </div>
          <div className={css.wrap}>
            <div>
              <SignupInputButtonChange
                field={form.$('email')}
                button={form.$('emailCheck')}
              />
              {value.emailCheck === 'resend' && (
                <SignupInputButtonChange
                  field={form.$('verificationNumber')}
                  button={form.$('emailAuth')}
                  countDown={this.props.countdown.time}
                  maxLength={6}
                />
              )}
              <div onClick={form.$('authMobileButton').onSubmit}>
                <LoginInput field={form.$('name')} disabled={true} />
                <SignupInputButtonChange
                  field={form.$('mobile')}
                  button={form.$('authMobileButton')}
                  maxLength={13}
                  disabled={true}
                />
              </div>
            </div>
            <div className={css.bigCheckboxWrap}>
              <LoginCheckBox
                field={form.$('optionalAgree')}
                big={true}
                className={'wrap'}
              />
            </div>

            <div className={css.borderBottom}>
              <LoginCheckBox
                field={form.$('agreeSaleTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/sale`}
              />
              <div>
                <LoginCheckBox
                  field={form.$('agreeEmailReception')}
                  className={'emailsms'}
                />
                <LoginCheckBox
                  field={form.$('agreeSmsReception')}
                  className={'emailsms'}
                />
              </div>
            </div>

            <div className={css.eventTextWarp}>
              <div className={css.eventText}>
                ※ 이벤트 참여는 본인인증 및 선택약관 전체동의 시 이용
                가능합니다.
              </div>
              <div className={css.eventText}>
                ※ 선택약관 전체동의 시 이벤트 참여 및 할인 정보 등 마케팅 정보에
                사용됩니다.
              </div>
              <div className={css.eventText}>
                ※ 결제/교환/환불 등과 관련된 내용은 거래 안전 을 위하여 수신동의
                여부와 관계없이 발송됩니다.
              </div>
            </div>
            <div>
              <LoginButton
                className={
                  !(
                    value.agreeSaleTos === true &&
                    value.agreeEmailReception === true &&
                    value.agreeSmsReception === true &&
                    value.emailCheck === 'complete' &&
                    value.authMobileButton === 'complete'
                  )
                    ? 'isGray'
                    : 'isColored'
                }
                onClick={e => {
                  form.$('email').set('disabled', false);
                  form.onSubmit(e);
                }}
                disabled={
                  !(
                    value.agreeSaleTos === true &&
                    value.agreeEmailReception === true &&
                    value.agreeSmsReception === true &&
                    value.emailCheck === 'complete' &&
                    value.authMobileButton === 'complete'
                  )
                }
              >
                동의하고 진행하기
              </LoginButton>
            </div>
            {/* 모바일 본인인증 팝업 오픈을 위한 숨겨진 폼 */}
            <form name="form_chk" method="post" style={{ display: 'none' }}>
              <input type="hidden" name="m" value="checkplusSerivce" />
              <input
                type="hidden"
                name="EncodeData"
                value={this.props.authmobile.authKey}
              />
            </form>
          </div>
        </div>
      </ModalWrapper>
    );
  }
}

export default LuckydrawModify;
