import React, { Component } from 'react';
import css from './FindMobileAuth.module.scss';
import LoginButton from './LoginButton';

export default class FindMobileAuthPassword extends Component {
  render() {
    return (
      <div>
        <div className={css.header}>
          본인 명의 휴대폰으로 비밀번호를 재설정합니다.
        </div>
        <LoginButton
          className="isColored"
          onClick={() => authmobile.getCertKey('findpassword')}
        >
          본인 명의 휴대폰으로 인증
        </LoginButton>
        <div className={css.subTextWrap}>
          {/* <div>
            <div className={css.dot} />
            본인명의의 휴대폰으로 본인여부를 확인합니다.
          </div>
          <div>
            <div className={css.dot} />
            본인인증 서비스는 NICE신용평가정보에서 제공합니다.
          </div>
          <div>
            <div className={css.dot} />
            인증수단의 명의가 다를 경우 고객센터로 문의하시기 바랍니다.
          </div>
          <div>
            <div className={css.dot} />
            <div>
              본인인증 시 입력한 정보는 본인확인 용도 외에는 사용되거나,
              <br /> 보관되지 않습니다.
            </div>
          </div> */}
          <div>
            <div className={css.dot} />
            인증비용은 구하다에서 부담합니다.
          </div>
        </div>
      </div>
    );
  }
}
